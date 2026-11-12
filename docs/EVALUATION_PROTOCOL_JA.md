# Evaluation Protocol

## CPU condition

CPU / no-GPU 条件では、現場デプロイ可能性を確認します。主な出力は latency、FPS、FP32 parameter size、parameter count、Damage IoU です。

## GPU condition

AWS GPU / CUDA 条件では、加速と batch processing の可能性を確認します。主な出力は latency、throughput、CUDA memory、AMP、batch size です。

## Dual-device synthesis

CPU と GPU は別の問いに答えるため、単純な直接順位付けではなく、用途別に読みます。二系統の結果を `final_evidence/` 配下の CSV、JSON、Markdown に分けて保存します。

## additional validation item rule

未測定値は `additional validation item` のまま保持します。推測値を完成結果として提示しません。
