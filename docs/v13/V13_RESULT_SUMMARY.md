# LiteRaceSegNet-V13 Result Summary

## One-line position

V13 is an evidence-integrated GitHub Pages release. It summarizes AWS ablation results, threshold selection, boundary-local patch metrics, and visual examples with their experiment context.

## Ablation conclusion

Full reference achieved mIoU `0.8072` and damage IoU `0.7113`. Removing LiteASPP caused the largest mIoU drop. Removing auxiliary loss and the detail branch also reduced performance. The slim variant reduced parameters to `0.059M` while maintaining similar mIoU `0.8064`.

## Threshold conclusion

- Metric-first: threshold `0.60`, min area `120`.
- Conservative visual inference: threshold `0.75`, min area `30`.

## Boundary-local conclusion

Aggregate boundary-patch IoU is `0.3212`, precision `0.8864`, recall `0.3350`. Precision is useful, but recall remains limited, so boundary refinement is future work.

## Case split

- large/easy candidate: 4
- medium: 3
- small/hard candidate: 3
- fragmented: 10

## Interpretation notes

The 10-image subset is treated as a held-out preview/evaluation subset for reading visual behavior.
