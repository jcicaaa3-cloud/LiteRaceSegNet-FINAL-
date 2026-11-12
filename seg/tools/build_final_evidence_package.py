"""Build final capstone evidence folder from separated model outputs.

This script collects artifacts produced by:
- LiteRaceSegNet training/inference
- SegFormer-B3 training/inference
- CNN vs Transformer comparison
- LiteRace service summary used for report-ready CV output explanations

Important project rule:
- LiteRaceSegNet and SegFormer-B3 remain separated.
- Evidence generation remains limited to CV model outputs and report summaries.
"""

from __future__ import annotations

import argparse
import csv
import json
import shutil
from datetime import datetime
from pathlib import Path
from typing import Dict, Iterable, List, Optional

PROJECT_ROOT = Path(__file__).resolve().parents[2]


def resolve(path_text: str | Path) -> Path:
  p = Path(path_text)
  return p if p.is_absolute() else (PROJECT_ROOT / p).resolve()


def ensure_dir(path: Path) -> Path:
  path.mkdir(parents=True, exist_ok=True)
  return path


def file_size_mb(path: Path) -> str:
  if not path.exists():
    return "MISSING"
  return f"{path.stat().st_size / (1024 * 1024):.2f} MB"


def read_json(path: Path, default):
  if not path.exists():
    return default
  with open(path, "r", encoding="utf-8") as f:
    return json.load(f)


def read_compare_csv(path: Path) -> List[Dict[str, str]]:
  if not path.exists():
    return []
  with open(path, "r", encoding="utf-8-sig", newline="") as f:
    return list(csv.DictReader(f))


def write_text(path: Path, text: str):
  ensure_dir(path.parent)
  with open(path, "w", encoding="utf-8") as f:
    f.write(text)


def copy_matching(src_dir: Path, dst_dir: Path, patterns: Iterable[str], limit: int = 20) -> int:
  ensure_dir(dst_dir)
  if not src_dir.exists():
    return 0
  copied = 0
  seen = set()
  for pattern in patterns:
    for src in sorted(src_dir.glob(pattern)):
      if not src.is_file() or src in seen:
        continue
      seen.add(src)
      shutil.copy2(src, dst_dir / src.name)
      copied += 1
      if copied >= limit:
        return copied
  return copied


def short_model_name(name: str) -> str:
  lowered = name.lower()
  if "literace" in lowered:
    return "LiteRaceSegNet"
  if "segformer" in lowered:
    return "SegFormer-B3"
  return name


def model_family(name: str) -> str:
  lowered = name.lower()
  if "literace" in lowered or "cnn" in lowered:
    return "CNN"
  if "segformer" in lowered or "transformer" in lowered:
    return "Transformer"
  return "-"


def model_feature(name: str) -> str:
  lowered = name.lower()
  if "literace" in lowered or "cnn" in lowered:
    return "Custom lightweight CNN with detail/context/boundary components"
  if "segformer" in lowered or "transformer" in lowered:
    return "Separated SegFormer-B3 Transformer baseline"
  return "Reference model"


def pick(row: Dict[str, str], *keys: str, default: str = "NA") -> str:
  for key in keys:
    value = row.get(key)
    if value is not None and str(value).strip() != "":
      return str(value)
  return default


def fmt(value: str, suffix: str = "") -> str:
  value = str(value)
  if value in {"", "NA", "None", "nan"}:
    return "NA"
  try:
    num = float(value)
    return f"{num:.4f}{suffix}"
  except Exception:
    return value


def _is_number(value: str) -> bool:
  try:
    float(str(value))
    return True
  except Exception:
    return False


def _best_row(rows: List[Dict[str, str]], keyword: str) -> Optional[Dict[str, str]]:
  keyword = keyword.lower()
  for row in rows:
    if keyword in pick(row, "name", default="").lower():
      return row
  return None


def _tradeoff_note(rows: List[Dict[str, str]]) -> str:
  if not rows:
    return "No comparison rows were found. Generate CPU/GPU comparison CSV files before using this as final evidence."

  groups: Dict[str, List[Dict[str, str]]] = {}
  for row in rows:
    device = pick(row, "device", default="unknown").lower()
    groups.setdefault(device, []).append(row)

  notes: List[str] = []
  for device, device_rows in groups.items():
    lite = _best_row(device_rows, "literace")
    segformer = _best_row(device_rows, "segformer")
    if not lite or not segformer:
      continue

    device_label = device.upper()
    lite_size = pick(lite, "param_size_mb_fp32", default="NA")
    seg_size = pick(segformer, "param_size_mb_fp32", default="NA")
    lite_lat = pick(lite, "latency_ms", default="NA")
    seg_lat = pick(segformer, "latency_ms", default="NA")
    lite_miou = pick(lite, "miou_binary", default="NA")
    seg_miou = pick(segformer, "miou_binary", default="NA")
    lite_mem = pick(lite, "cuda_peak_memory_mb", default="NA")
    seg_mem = pick(segformer, "cuda_peak_memory_mb", default="NA")

    notes.append(f"### {device_label} comparison")
    if _is_number(lite_size) and _is_number(seg_size):
      ratio = float(seg_size) / max(float(lite_size), 1e-12)
      notes.append(f"- FP32 size ratio, SegFormer-B3 divided by LiteRaceSegNet: {ratio:.2f}x")
    if _is_number(lite_lat) and _is_number(seg_lat):
      ratio = float(seg_lat) / max(float(lite_lat), 1e-12)
      notes.append(f"- {device_label} latency ratio, SegFormer-B3 divided by LiteRaceSegNet: {ratio:.2f}x")
    if device == "cuda" and _is_number(lite_mem) and _is_number(seg_mem):
      ratio = float(seg_mem) / max(float(lite_mem), 1e-12)
      notes.append(f"- CUDA peak-memory ratio, SegFormer-B3 divided by LiteRaceSegNet: {ratio:.2f}x")
    if _is_number(lite_miou) and _is_number(seg_miou):
      diff = float(lite_miou) - float(seg_miou)
      notes.append(f"- mIoU difference, LiteRaceSegNet minus SegFormer-B3: {diff:+.4f}")

  if not notes:
    return "Comparison rows exist, but matching LiteRaceSegNet and SegFormer-B3 rows were not both found for the same device."
  return "\n".join(notes)


def make_comparison_md(rows: List[Dict[str, str]]) -> str:
  header = [
    "Model", "Family", "Device", "Device Name", "Input", "Batch", "AMP",
    "Params", "FP32 Size", "Latency", "Latency Std", "FPS", "GPU Peak Mem",
    "mIoU", "Damage IoU", "Pixel Acc", "Role",
  ]
  lines = ["# Final Comparison Table", "", "| " + " | ".join(header) + " |", "|" + "|".join(["---"] * len(header)) + "|"]
  if not rows:
    lines.append("| No comparison rows | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | Generate model_compare_summary.csv first. |")
    return "\n".join(lines) + "\n"

  def sort_key(row: Dict[str, str]):
    device = pick(row, "device", default="")
    model = pick(row, "name", default="")
    return (0 if device == "cpu" else 1 if device == "cuda" else 2, 0 if "literace" in model.lower() else 1)

  for row in sorted(rows, key=sort_key):
    name = pick(row, "name", default="unknown")
    params = pick(row, "param_million", "params", default="NA")
    if params != "NA" and params == pick(row, "param_million", default=""):
      params = fmt(params, "M")
    size = fmt(pick(row, "param_size_mb_fp32", default="NA"), " MB")
    latency = fmt(pick(row, "latency_ms", default="NA"), " ms")
    latency_std = fmt(pick(row, "latency_std_ms", default="NA"), " ms")
    fps = fmt(pick(row, "throughput_fps", default="NA"), " fps")
    gpu_mem = fmt(pick(row, "cuda_peak_memory_mb", default="NA"), " MB")
    miou = fmt(pick(row, "miou_binary", default="NA"))
    damage_iou = fmt(pick(row, "iou_damage", default="NA"))
    pixel = fmt(pick(row, "pixel_acc", default="NA"))
    lines.append(
      "| " + " | ".join([
        short_model_name(name),
        model_family(name),
        pick(row, "device", default="NA"),
        pick(row, "device_name", default="NA"),
        pick(row, "image_size_hw", default="NA"),
        pick(row, "batch_size", default="1"),
        pick(row, "amp", default="False"),
        params,
        size,
        latency,
        latency_std,
        fps,
        gpu_mem,
        miou,
        damage_iou,
        pixel,
        model_feature(name),
      ]) + " |"
    )

  lines.extend([
    "",
    "## Trade-off notes",
    "",
    _tradeoff_note(rows),
    "",
    "## Interpretation notes",
    "",
    "LiteRaceSegNet and SegFormer-B3 are compared under a recorded validation layout, image size, checkpoint condition, batch size, device, and evaluation script. The table is a bounded research comparison rather than a universal superiority claim.",
  ])
  return "\n".join(lines) + "\n"


def checkpoint_manifest(literace_ckpt: Path, segformer_ckpt: Path) -> str:
  rows = [
    ("LiteRaceSegNet", "CNN", literace_ckpt),
    ("SegFormer-B3", "Transformer", segformer_ckpt),
  ]
  lines = ["# Checkpoint Manifest", "", "| Model | Family | Path | Status/Size |", "|---|---|---|---|"]
  for name, family, path in rows:
    status = file_size_mb(path)
    display_path = path.relative_to(PROJECT_ROOT) if path.exists() else path
    lines.append(f"| {name} | {family} | `{display_path}` | {status} |")
  lines.append("")
  lines.append("Note: checkpoint files are listed for local evidence generation only. `.pth` files stay in the local evidence environment until redistribution and privacy requirements are reviewed.")
  return "\n".join(lines) + "\n"


def make_summary_md(args, compare_rows, service_rows, copies: Dict[str, int]) -> str:
  literace_ckpt = resolve(args.literace_ckpt)
  segformer_ckpt = resolve(args.segformer_ckpt)
  now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
  checklist = [
    ("LiteRaceSegNet best.pth", literace_ckpt.exists()),
    ("SegFormer-B3 best.pth", segformer_ckpt.exists()),
    ("Comparison CSV/JSON", bool(compare_rows)),
    ("LiteRace overlay/service artifacts", copies.get("literace", 0) > 0),
    ("SegFormer-B3 overlay artifacts", copies.get("segformer", 0) > 0),
    ("LiteRace service summary", bool(service_rows)),
  ]
  lines = [
    "# Capstone Result Summary",
    "",
    f"Generated at: {now}",
    "",
    "## Scope",
    "This package summarizes a separated comparison between the proposed LiteRaceSegNet lightweight CNN and the SegFormer-B3 Transformer baseline. The models, checkpoints, and large-scale generalization claims are kept separate.",
    "",
    "## Readiness checklist",
    "",
    "| Item | Status |",
    "|---|---|",
  ]
  for item, ok in checklist:
    lines.append(f"| {item} | {'OK' if ok else 'MISSING'} |")
  lines.extend([
    "",
    "## Evidence boundary",
    "- LiteRaceSegNet rows refer to the LiteRaceSegNet checkpoint and service outputs.",
    "- SegFormer-B3 rows refer only to the separated Transformer baseline checkpoint and inference outputs.",
    "- Missing checkpoints or comparison CSV files are marked as missing and values are filled from recorded evidence only.",
    "- LiteRace service summaries explain LiteRaceSegNet outputs only.",
    "",
    "## Folder map",
    "- `01_checkpoints/checkpoint_manifest.md`: local checkpoint status table.",
    "- `02_metrics_and_compare/`: CNN vs Transformer CSV/JSON plus optional GPU rows.",
    "- `03_literace_overlays/`: LiteRaceSegNet service overlay/card/mask artifacts.",
    "- `04_segformer_overlays/`: SegFormer-B3 inference overlay/mask artifacts.",
    "- `06_report_ready/`: report-ready Markdown summary tables.",
    "",
  ])
  return "\n".join(lines)


def main():
  parser = argparse.ArgumentParser(description="Collect final capstone evidence artifacts")
  parser.add_argument("--outdir", default="final_evidence")
  parser.add_argument("--compare_dir", default="final_evidence/02_metrics_and_compare")
  parser.add_argument("--gpu_compare_dir", default="", help="Optional CUDA comparison directory. If provided, CPU and GPU rows are merged in the final report.")
  parser.add_argument("--literace_service_dir", default="seg/runs/literace_service")
  parser.add_argument("--segformer_infer_dir", default="seg/runs/segformer_b3_infer_after_train")
  parser.add_argument("--literace_ckpt", default="seg/runs/literace_boundary_degradation/best.pth")
  parser.add_argument("--segformer_ckpt", default="seg/transformer_b3/checkpoints/segformer_b3_best.pth")
  parser.add_argument("--copy_limit", type=int, default=30)
  args = parser.parse_args()

  outdir = ensure_dir(resolve(args.outdir))
  dirs = {
    "checkpoints": ensure_dir(outdir / "01_checkpoints"),
    "compare": ensure_dir(outdir / "02_metrics_and_compare"),
    "literace": ensure_dir(outdir / "03_literace_overlays"),
    "segformer": ensure_dir(outdir / "04_segformer_overlays"),
    "report": ensure_dir(outdir / "06_report_ready"),
  }

  compare_dir = resolve(args.compare_dir)
  compare_rows = read_compare_csv(compare_dir / "model_compare_summary.csv")
  if (compare_dir / "model_compare_summary.csv").exists():
    shutil.copy2(compare_dir / "model_compare_summary.csv", dirs["compare"] / "model_compare_summary.csv")
  if (compare_dir / "model_compare_summary.json").exists():
    shutil.copy2(compare_dir / "model_compare_summary.json", dirs["compare"] / "model_compare_summary.json")

  gpu_compare_rows: List[Dict[str, str]] = []
  if args.gpu_compare_dir:
    gpu_compare_dir = resolve(args.gpu_compare_dir)
    gpu_compare_rows = read_compare_csv(gpu_compare_dir / "model_compare_summary.csv")
    gpu_dst = ensure_dir(dirs["compare"] / "gpu")
    if (gpu_compare_dir / "model_compare_summary.csv").exists():
      shutil.copy2(gpu_compare_dir / "model_compare_summary.csv", gpu_dst / "model_compare_summary_gpu.csv")
    if (gpu_compare_dir / "model_compare_summary.json").exists():
      shutil.copy2(gpu_compare_dir / "model_compare_summary.json", gpu_dst / "model_compare_summary_gpu.json")

  all_compare_rows = compare_rows + gpu_compare_rows

  service_dir = resolve(args.literace_service_dir)
  service_rows = read_json(service_dir / "service_batch_summary.json", [])
  if (service_dir / "service_batch_summary.json").exists():
    shutil.copy2(service_dir / "service_batch_summary.json", dirs["report"] / "literace_service_batch_summary.json")
  if (service_dir / "service_batch_summary.csv").exists():
    shutil.copy2(service_dir / "service_batch_summary.csv", dirs["report"] / "literace_service_batch_summary.csv")

  copies = {}
  copies["literace"] = copy_matching(
    service_dir,
    dirs["literace"],
    ["*_service_card.png", "*_service_overlay.png", "*_service_mask.png", "*_service_boundary.png"],
    limit=args.copy_limit,
  )
  copies["segformer"] = copy_matching(
    resolve(args.segformer_infer_dir),
    dirs["segformer"],
    ["*_overlay.png", "*_mask_color.png", "*_pred_class.png"],
    limit=args.copy_limit,
  )

  write_text(dirs["checkpoints"] / "checkpoint_manifest.md", checkpoint_manifest(resolve(args.literace_ckpt), resolve(args.segformer_ckpt)))
  write_text(dirs["report"] / "final_comparison_table.md", make_comparison_md(all_compare_rows))
  write_text(dirs["report"] / "capstone_result_summary.md", make_summary_md(args, all_compare_rows, service_rows, copies))

  write_text(outdir / "README_FINAL_EVIDENCE.txt", """Final evidence folder for capstone presentation/report.

Run order after data is ready:
1) 03A_TRAIN_LITERACESEGNET_ONLY.bat
2) TRAIN_SEGFORMER_B3_ONLY.bat
3) 10_DUAL_DEVICE_RESEARCH_EVIDENCE.bat on an AWS GPU machine, or 06_BUILD_FINAL_EVIDENCE_ONLY.bat for CPU-only evidence.

Core rule:
- LiteRaceSegNet and SegFormer-B3 are trained separately.
- Comparison happens only in the comparison table.
- Service summary explains LiteRaceSegNet output only.
""")

  print("[OK] Final evidence package built:", outdir)
  print("-", dirs["report"] / "final_comparison_table.md")
  print("-", dirs["report"] / "capstone_result_summary.md")


if __name__ == "__main__":
  main()
