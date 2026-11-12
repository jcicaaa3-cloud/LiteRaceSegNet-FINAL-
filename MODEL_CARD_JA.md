# LiteRaceSegNet-V13 Model Card

## 概要

LiteRaceSegNet-V13 は、道路損傷セグメンテーション向けの軽量 CNN です。詳細分岐、文脈分岐、LiteASPP、境界補助、境界誘導融合を組み合わせ、小さな損傷領域と不規則な境界を扱います。

## 出力契約

| key | shape | meaning |
|---|---:|---|
| `out` | `(B, 2, H, W)` | main segmentation logits |
| `aux` | `(B, 2, H, W)` | auxiliary segmentation logits |
| `boundary` | `(B, 1, H, W)` | boundary auxiliary logit |

## 参照証拠

| item | value | status |
|---|---:|---|
| Params | `0.1245M` | measured reference |
| FP32 parameter size | `0.475 MiB` | measured reference |
| Pixel Accuracy | `0.9157` | preliminary reference |
| binary mIoU | `0.7988` | preliminary reference |
| Damage IoU | `0.7029` | preliminary reference |

これらは研究レビュー用の参照値です。V13 evidence pipeline では ablation、Boundary IoU、CPU/GPU latency、case split まで整理しています。

## 公開境界

公開するものは code、configs、scripts、diagrams、static demos、documentation、templates です。raw datasets、private masks、checkpoints、pretrained weights、credentials は local environment 側で管理します。

## 構造説明と比較 baseline

LiteRaceSegNet-V13 は、boundary-guided segmentation components を持つ custom LiteIR-style lightweight CNN segmentation model です。LiteIRBlock は MobileNetV2/V3-style の lightweight inverted-residual design から着想を得ていますが、実装は LiteRaceSegNet 用の custom path です。

SegFormer-B3 は `seg/transformer_b3/` と関連 script で扱う外部比較 baseline です。architecture cost と validation behavior を比較するための別 path であり、提案モデルの主経路は `lite_race` です。

短い説明:

> LiteRaceSegNet は custom LiteIR-style lightweight CNN segmentation model です。SegFormer-B3 は比較用の別 baseline です。

## 配布メモ

public package は model/source code、static pages、diagrams、evidence tables、selected visualizations、documentation を中心に構成します。raw private datasets、checkpoints、pretrained weights、Hugging Face cache files、credentials、個人環境ファイルは local environment 側で管理します。

`02_SETUP_SEGFORMER_B3_HF.bat` は local comparison 用に external SegFormer-B3 artifact を download/cache できます。実行後の生成物は local comparison artifact として別管理します。

NVLabs SegFormer reference materials は research-evaluation reference として扱い、TorchVision は BSD-3-Clause、Hugging Face Transformers は Apache 2.0 として扱います。
