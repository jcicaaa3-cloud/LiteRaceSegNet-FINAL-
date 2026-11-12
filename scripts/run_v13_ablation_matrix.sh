#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

BASE_CONFIG=${1:-seg/config/pothole_binary_literace_train.yaml}
EPOCHS=${2:-}

if [ -n "$EPOCHS" ]; then
  python scripts/v13_make_ablation_configs.py --base "$BASE_CONFIG" --epochs "$EPOCHS"
else
  python scripts/v13_make_ablation_configs.py --base "$BASE_CONFIG"
fi

mkdir -p seg/runs/v13_ablation
for cfg in seg/config/v13_ablation/v13_*.yaml; do
  echo "============================================================"
  echo "[V13] Training ablation config: $cfg"
  echo "============================================================"
  python seg/train_literace.py --config "$cfg"
done

python seg/tools/v13_profile_models.py --config_dir seg/config/v13_ablation --out_csv seg/runs/v13_ablation/v13_model_profile.csv
python seg/tools/v13_summarize_ablation.py --runs_dir seg/runs/v13_ablation --profile_csv seg/runs/v13_ablation/v13_model_profile.csv --out_dir seg/runs/v13_ablation/_summary
