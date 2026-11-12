# Third-Party Notices

This repository may use or reference third-party software such as Python, PyTorch, NumPy, Pillow, OpenCV, Matplotlib, Transformers, and related packages. Each component remains governed by its original license.

Third-party datasets, pretrained weights, model checkpoints, and service credentials remain under their own rights and stay separate from this public package.

For exact package versions, inspect `requirements.txt`, `requirements_service.txt`, and `requirements_transformer_optional.txt`.

## LiteRaceSegNet and SegFormer-B3 scope

LiteRaceSegNet is implemented as a custom LiteIR-style lightweight CNN segmentation model. Its LiteIRBlock uses lightweight inverted-residual design ideas inspired by MobileNetV2/V3-style blocks while keeping the implementation custom.

SegFormer-B3-related files are provided as an external comparison baseline, including `seg/transformer_b3/`, `seg/transformer_b3/train_segformer_b3.py`, `seg/transformer_b3/segformer_b3_adapter.py`, and `02_SETUP_SEGFORMER_B3_HF.bat`.

The public package centers on static pages, code, figures, templates, and experiment summaries. SegFormer-B3 pretrained weights, fine-tuned checkpoints, Hugging Face cache files, private datasets, credentials, and locally cached setup artifacts are managed separately.

NVLabs SegFormer reference materials are treated as research-evaluation references. The Hugging Face `nvidia/segformer-b3-finetuned-ade-512-512` page is treated as an `other` license model derived from the SegFormer paper/repository line. TorchVision is treated as BSD-3-Clause, and Hugging Face Transformers as Apache 2.0.
