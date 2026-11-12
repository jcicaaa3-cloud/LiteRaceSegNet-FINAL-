# Boundary-local patch metrics

Boundary patches are sampled from GT boundary pixels only. This is a local metric for boundary-aware discussion, not a replacement for whole-image mIoU.

- evaluated_patches: 2560
- aggregate_iou_damage: 0.321208
- aggregate_dice_damage: 0.486234
- aggregate_precision: 0.886439
- aggregate_recall: 0.334993

## By patch size

| patch | IoU_damage | Dice | Precision | Recall | patches |
|---:|---:|---:|---:|---:|---:|
| 32 | 0.230596 | 0.374772 | 0.795239 | 0.245152 | 1280 |
| 64 | 0.3406 | 0.50813 | 0.901418 | 0.353778 | 1280 |
