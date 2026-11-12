@echo off
setlocal
cd /d %~dp0

set BASE_CONFIG=seg\config\pothole_binary_literace_v13_reference.yaml

echo [V13] Generating ablation configs from %BASE_CONFIG%
python scripts\v13_make_ablation_configs.py --base "%BASE_CONFIG%"
if errorlevel 1 goto failed

echo.
echo [V13] Training generated ablation configs
for %%F in (seg\config\v13_ablation\v13_*.yaml) do (
  echo [V13] Training ablation config: %%F
  python seg\train_literace.py --config "%%F"
  if errorlevel 1 goto failed
)

echo.
echo [V13] Profiling and summarizing ablation runs
python seg\tools\v13_profile_models.py --config_dir seg\config\v13_ablation --out_csv seg\runs\v13_ablation\v13_model_profile.csv
python seg\tools\v13_summarize_ablation.py --runs_dir seg\runs\v13_ablation --profile_csv seg\runs\v13_ablation\v13_model_profile.csv --out_dir seg\runs\v13_ablation\_summary
if errorlevel 1 goto failed

echo.
echo [OK] V13 ablation matrix is complete.
pause
exit /b 0

:failed
echo.
echo [FAILED] V13 ablation matrix stopped. Check the error above.
pause
exit /b 1
