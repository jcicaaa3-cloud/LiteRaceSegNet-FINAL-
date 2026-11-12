SegFormer-B3 comparison baseline
================================

This folder contains the optional SegFormer-B3 comparison path for LiteRaceSegNet-V13.

LiteRaceSegNet is implemented as a custom LiteIR-style lightweight CNN segmentation model. SegFormer-B3 is used as an external comparison baseline for architecture cost and validation behavior.

Included scripts
----------------
- `download_segformer_b3.py`
- `segformer_b3_adapter.py`
- `train_segformer_b3.py`
- `02_SETUP_SEGFORMER_B3_HF.bat`

Distribution scope
------------------
The public package keeps SegFormer-B3 pretrained weights, fine-tuned checkpoints, Hugging Face cache files, private datasets, and credentials outside the zip.

`02_SETUP_SEGFORMER_B3_HF.bat` can download/cache external Hugging Face artifacts for local comparison. Generated artifacts are handled after license and redistribution terms are reviewed.

Architecture note
-----------------
LiteRaceSegNet uses a custom LiteIR-style path in `seg/core/lightweight_race.py`. The LiteIRBlock follows lightweight inverted-residual design ideas inspired by MobileNetV2/V3-style blocks while keeping the implementation custom.
