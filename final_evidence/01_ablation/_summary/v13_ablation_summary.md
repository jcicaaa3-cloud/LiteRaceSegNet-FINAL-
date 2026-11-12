# V13 Ablation Summary

| variant | best_miou_binary | best_iou_damage | params_million | latency_ms_per_image | best_epoch | status |
|---|---|---|---|---|---|---|
| v13_full_reference | 0.8072165849511359 | 0.7112691400321568 | 0.124509 | 3.097 | 2 | ok |
| v13_no_aux_loss | 0.791883293786984 | 0.6865786194109244 | 0.124411 | 3.0289 | 11 | ok |
| v13_no_boundary_gate | 0.800952794427751 | 0.7022640072854306 | 0.124509 | 3.0544 | 2 | ok |
| v13_no_boundary_logit_fusion | 0.8046026398508912 | 0.7077500840775756 | 0.124509 | 3.1127 | 2 | ok |
| v13_no_detail_branch | 0.7981966262164919 | 0.698415589822897 | 0.124509 | 2.6676 | 2 | ok |
| v13_no_liteaspp_context | 0.7850106417538016 | 0.6784074642695562 | 0.123477 | 2.7642 | 2 | ok |
| v13_slim_backbone_capacity | 0.8064117884725099 | 0.7094504680246185 | 0.059397 | 3.1216 | 20 | ok |

## Interpretation notes
- This ablation table is read together with the data, epoch, and protocol settings used for each variant.
- Quick-run or early-stopped variants are marked explicitly in the final report.
- Boundary claims are tied to full and no-boundary variants measured under the same protocol.
