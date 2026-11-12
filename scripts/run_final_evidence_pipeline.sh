#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
python seg/tools/v13_result_readiness_audit.py --repo . --out final_evidence/RESULT_READINESS_AUDIT_BEFORE.md
python scripts/v13_make_ablation_configs.py
python seg/tools/v13_profile_models.py --config_dir seg/config/v13_ablation --out_csv seg/runs/v13_ablation/model_profile.csv --device cpu --iters 10 --warmup 3
bash scripts/run_cpu_evidence.sh
bash scripts/run_gpu_evidence.sh
bash scripts/run_dual_device_evidence.sh
python seg/tools/v13_result_readiness_audit.py --repo . --out final_evidence/RESULT_READINESS_AUDIT.md
