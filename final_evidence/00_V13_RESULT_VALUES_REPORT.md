> This V13 file summarizes the release-facing AWS ablation evidence. Variant labels are normalized to `v13_*` for the public package.

# LiteRaceSegNet V13 Integrated AWS Result Values

This file summarizes result values that can be moved directly into a presentation or report. It records ablation evidence from turning structural elements on/off under the same protocol.

## Dataset protocol

- src_root: datasets/pothole_binary/processed
- split_note: source_train_val_used
- train_pairs: 2400
- val_pairs: 10
- test_images: 10
- test_masks: 10
- val_ratio: 0.1
- seed: 42

## 1. Seven-variant ablation table

| variant | component_change | best_miou_binary | best_iou_damage | params_million | latency_ms_per_image | delta_miou_vs_full | status |
|---|---|---|---|---|---|---|---|
| v13_full_reference | Full model: detail branch + boundary gate + boundary-logit fusion + LiteASPP + aux loss | 0.8072165849511359 | 0.7112691400321568 | 0.124509 | 3.097 | 0.000000 | ok |
| v13_no_detail_branch | Detail branch OFF | 0.7981966262164919 | 0.698415589822897 | 0.124509 | 2.6676 | -0.009020 | ok |
| v13_no_boundary_gate | Boundary gate OFF | 0.800952794427751 | 0.7022640072854306 | 0.124509 | 3.0544 | -0.006264 | ok |
| v13_no_boundary_logit_fusion | Boundary-logit fusion OFF | 0.8046026398508912 | 0.7077500840775756 | 0.124509 | 3.1127 | -0.002614 | ok |
| v13_no_liteaspp_context | LiteASPP replaced by DSConv context | 0.7850106417538016 | 0.6784074642695562 | 0.123477 | 2.7642 | -0.022206 | ok |
| v13_no_aux_loss | Auxiliary head/loss OFF | 0.791883293786984 | 0.6865786194109244 | 0.124411 | 3.0289 | -0.015333 | ok |
| v13_slim_backbone_capacity | Reduced backbone/context capacity | 0.8064117884725099 | 0.7094504680246185 | 0.059397 | 3.1216 | -0.000805 | ok |

## 2. Threshold setting

### metric_first
- threshold: 0.60
- min_area_pixels: 120
- mIoU: 0.807282
- damage IoU: 0.711291
- precision / recall: 0.918315 / 0.759334
- false_positive_ratio_percent: 1.711833

### conservative
- threshold: 0.75
- min_area_pixels: 30
- mIoU: 0.800625
- damage IoU: 0.698373
- precision / recall: 0.951095 / 0.724386
- false_positive_ratio_percent: 0.944010

## 3. Test / boundary-local evidence

### Whole-image and boundary metric means

- mean_iou_damage: 0.662285
- mean_dice_damage: 0.795061
- mean_boundary_f1: 0.058208
- mean_precision: 0.962777
- mean_recall: 0.680854
- mean_pred_area_ratio: 0.179731
- mean_gt_area_ratio: 0.252614
- evaluated_test_pairs: 10

### Boundary-local patch metrics

- evaluated_patches: 2560
- aggregate_iou_damage: 0.321208
- aggregate_dice_damage: 0.486234
- aggregate_precision: 0.886439
- aggregate_recall: 0.334993

| patch | IoU_damage | Dice | Precision | Recall | patches |
|---:|---:|---:|---:|---:|---:|
| 32 | 0.230596 | 0.374772 | 0.795239 | 0.245152 | 1280 |
| 64 | 0.3406 | 0.50813 | 0.901418 | 0.353778 | 1280 |

## 4. Objective case split

- area_group_counts: {"large_or_easy_candidate": 4, "medium": 3, "small_or_hard_candidate": 3}
- fragmentation_counts: {"fragmented": 10}

## 5. Interpretation notes

- The useful research point is not a single best-score claim, but the fact that multiple structure-removal experiments were performed under the same conditions and limitations were explained.
- Read the boundary branch with both whole-image mIoU and boundary-local 32x32/64x64 patch results, then connect the numbers with failure cases.
- Easy/hard cases are split by GT mask area ratio, component count, and fragmentation flag, not subjective visual judgment.
- Service/QA screens are separated as a qualitative result viewer / project QA assistant, not as the core research evidence.
