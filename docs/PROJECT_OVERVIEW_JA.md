# Project Overview

LiteRaceSegNet-V13-Portal は、道路損傷 segmentation のための軽量 CNN 研究パッケージです。主な関心は、小さな損傷 mask、不規則な edge、低コントラスト領域を、軽量構成でどこまで保持できるかです。

## Key idea

- 詳細分岐で局所的な損傷手掛かりを保持する。
- 文脈分岐で広域 road texture を扱う。
- LiteASPP で軽量な文脈集約を行う。
- 境界 head と境界誘導融合で edge quality を評価対象に含める。

## Release boundary

この package は public portfolio と academic demonstration のためのものです。private data、raw masks、checkpoints、pretrained weights、credentials は public package の外に置きます。
