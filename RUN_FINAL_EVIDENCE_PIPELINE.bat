@echo off
setlocal enabledelayedexpansion
cd /d %~dp0

echo ============================================================
echo LiteRaceSegNet-V13 final evidence pipeline
echo ============================================================
echo This pipeline prepares GitHub-visible evidence tables and reports only.
echo It only prepares GitHub-visible evidence tables and reports.
echo.

echo [1/5] Readiness audit...
python seg\tools\v13_result_readiness_audit.py --repo . --out final_evidence\RESULT_READINESS_AUDIT_BEFORE.md

echo [2/5] V13 ablation config/profile candidates...
python scripts\v13_make_ablation_configs.py
python seg\tools\v13_profile_models.py --config_dir seg\config\v13_ablation --out_csv seg\runs\v13_ablation\model_profile.csv --device cpu --iters 10 --warmup 3

echo [3/5] CPU evidence...
call 08_CPU_LIGHTWEIGHT_EVIDENCE.bat

echo [4/5] GPU evidence...
call 09_GPU_ACCELERATION_EVIDENCE.bat

echo [5/5] Dual-device synthesis...
call 10_DUAL_DEVICE_RESEARCH_EVIDENCE.bat

python seg\tools\v13_result_readiness_audit.py --repo . --out final_evidence\RESULT_READINESS_AUDIT.md

echo.
echo [DONE] Check final_evidence\RESULT_READINESS_AUDIT.md and generated CSV/JSON/Markdown files.
pause
