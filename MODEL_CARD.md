# MODEL_CARD — LiteRaceSegNet-V13

LiteRaceSegNet-V13 is a lightweight road-damage segmentation research portal with AWS ablation evidence integrated.

## Intended use

Research review, portfolio presentation, and qualitative explanation of lightweight boundary-aware segmentation.

## Main evidence

- Full mIoU: `0.8072`
- Full damage IoU: `0.7113`
- Parameters: `0.125M`
- CUDA latency: `3.097 ms/image`
- 7 ablation variants
- Boundary-local patch metrics using 32x32 and 64x64 patches

## Limitations

The 10-image evaluation subset is a held-out preview/evaluation subset. Boundary recall remains limited, and production deployment is outside this release scope. The package presents measured V13 evidence rather than a SOTA leaderboard claim.

## Architecture and comparison baseline

LiteRaceSegNet-V13 is a directly implemented custom LiteIR-style lightweight CNN segmentation model with boundary-guided segmentation components. Its LiteIRBlock follows lightweight inverted-residual design ideas inspired by MobileNetV2/V3-style blocks while keeping the implementation custom.

SegFormer-B3 appears as an external comparison baseline in `seg/transformer_b3/` and related scripts. The baseline path helps compare architecture cost and validation behavior; the proposed model path remains `lite_race`.

Reviewer-friendly answer:

> LiteRaceSegNet is implemented as a custom LiteIR-style lightweight CNN segmentation model. SegFormer-B3 is used as a separate comparison baseline, with its weights and cache files kept outside this public package.

## Distribution notes

The public package contains model/source code, static pages, diagrams, evidence tables, selected visualizations, and documentation. Raw private datasets, checkpoints, pretrained weights, Hugging Face cache files, credentials, and personal environment files are kept outside the public package.

`02_SETUP_SEGFORMER_B3_HF.bat` can download/cache external SegFormer-B3 artifacts for local comparison. Those generated artifacts require separate license and redistribution review before any public packaging.

NVLabs SegFormer reference materials are treated as research-evaluation references; TorchVision is treated as BSD-3-Clause and Hugging Face Transformers as Apache 2.0.
