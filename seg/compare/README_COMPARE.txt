LiteRaceSegNet vs SegFormer-B3 comparison
============================================

Purpose
-------
This folder contains utilities for comparing the proposed LiteRaceSegNet CNN path with the separated SegFormer-B3 Transformer baseline.

The comparison table records parameters, FP32 model size, latency, throughput, optional GPU memory, and segmentation metrics when checkpoints and masks are available.

Run entry points
----------------
- 04_COMPARE_AFTER_SEGFORMER_B3_TRAIN.bat
- 08_CPU_LIGHTWEIGHT_EVIDENCE.bat
- 09_GPU_ACCELERATION_EVIDENCE.bat
- 10_DUAL_DEVICE_RESEARCH_EVIDENCE.bat

CPU example
-----------
python seg/compare/compare_models.py ^
 --configs seg/config/pothole_binary_literace_train.yaml seg/config/pothole_binary_segformer_b3_train.yaml ^
 --names LiteRaceSegNet_CNN SegFormer_B3_Transformer ^
 --ckpts seg/runs/literace_boundary_degradation/best.pth seg/transformer_b3/checkpoints/segformer_b3_best.pth ^
 --input_dir datasets/pothole_binary/processed/val/images ^
 --mask_dir datasets/pothole_binary/processed/val/masks ^
 --device cpu ^
 --batch_size 1 ^
 --latency_warmup 10 ^
 --latency_repeats 50 ^
 --outdir final_evidence/02_metrics_and_compare_cpu

GPU example
-----------
python seg/compare/compare_models.py ^
 --configs seg/config/pothole_binary_literace_train.yaml seg/config/pothole_binary_segformer_b3_train.yaml ^
 --names LiteRaceSegNet_CNN SegFormer_B3_Transformer ^
 --ckpts seg/runs/literace_boundary_degradation/best.pth seg/transformer_b3/checkpoints/segformer_b3_best.pth ^
 --input_dir datasets/pothole_binary/processed/val/images ^
 --mask_dir datasets/pothole_binary/processed/val/masks ^
 --device cuda ^
 --batch_size 1 ^
 --latency_warmup 20 ^
 --latency_repeats 100 ^
 --outdir final_evidence/02_metrics_and_compare_gpu

Interpretation notes
--------------------
This table is a bounded research comparison. Dataset split, image size, checkpoint condition, batch size, device, and evaluation script belong with the numbers.
