# Dataset and Privacy

この repository では raw datasets、private images、raw masks を public package の外に置きます。利用許可を確認した data のみを local environment に配置してください。

推奨配置:

```text
datasets/pothole_binary/processed/
├─ train/images/
├─ train/masks/
├─ val/images/
├─ val/masks/
├─ test/images/
└─ test/masks/
```

Public release では、dataset layout のみを示し、実データは public package の外に置きます。
