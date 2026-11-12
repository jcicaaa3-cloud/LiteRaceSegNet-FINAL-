# Asset and License Policy

## Public asset rule

For this release, public-facing figures are rebuilt from basic shapes and original text. Third-party decorative icons, unverified logos, and images with unclear provenance are not used.

## Included

- Figures for README and GitHub Pages.
- Visual materials for architecture, evaluation, evidence, and repository mapping.
- Static demo preview files.
- Code, configs, scripts, and documentation.

## Excluded

- Private dataset images.
- Raw masks.
- Checkpoints and pretrained weights.
- Generated run directories.
- Manuscript files.
- `.env`, API keys, cloud credentials, and `.pem` files.

## License boundary

LiteRaceSegNet-related code, documentation, diagrams, experiment records, configuration files, and assets are published for portfolio viewing and academic demonstration. Third-party components remain under their original licenses.

## Model and baseline boundary

LiteRaceSegNet is implemented as a custom LiteIR-style lightweight CNN segmentation model. The LiteIRBlock in `seg/core/lightweight_race.py` is a custom implementation inspired by MobileNetV2/V3-style lightweight inverted-residual design ideas.

SegFormer-B3 is an external comparison baseline handled through `seg/transformer_b3/`, `train_segformer_b3.py`, `segformer_b3_adapter.py`, and `02_SETUP_SEGFORMER_B3_HF.bat`. The proposed model's main path is `lite_race`; SegFormer-B3 is used for comparing architecture cost and validation behavior.

The public package centers on static pages, code, figures, explanatory text, and templates. SegFormer-B3 pretrained weights, fine-tuned checkpoints, Hugging Face cache files, private datasets, credentials, and artifacts downloaded or cached by setup scripts are kept as local-comparison artifacts outside the public package.

## Third-party license notes

NVLabs SegFormer reference materials are treated as research-evaluation references. The Hugging Face `nvidia/segformer-b3-finetuned-ade-512-512` page is treated as an `other` license model derived from the SegFormer paper/repository line. TorchVision is treated as BSD-3-Clause, and Hugging Face Transformers as Apache 2.0.
