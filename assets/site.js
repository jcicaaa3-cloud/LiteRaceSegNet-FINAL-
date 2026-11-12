document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('[data-menu]');
  const nav = document.querySelector('.nav');
  if (btn && nav) btn.addEventListener('click', () => nav.classList.toggle('open'));

  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a, .more-dropdown a').forEach(a => {
    const last = (a.getAttribute('href') || '').split('/').pop() || 'index.html';
    if (last === path) {
      a.classList.add('active');
      const more = a.closest('.header-more');
      if (more) more.querySelector('.more-toggle')?.classList.add('active');
    }
  });

  const moreMenu = document.querySelector('[data-more-menu]');
  const moreToggle = document.querySelector('[data-more-toggle]');
  if (moreMenu && moreToggle) {
    moreToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = !moreMenu.classList.contains('open');
      moreMenu.classList.toggle('open', open);
      moreToggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (event) => {
      if (!moreMenu.contains(event.target)) {
        moreMenu.classList.remove('open');
        moreToggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        moreMenu.classList.remove('open');
        moreToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }


  function updateWarningHeightForMenu() {
    const warning = document.querySelector('.site-warning');
    const header = document.querySelector('.site-header');
    if (!warning) {
      document.documentElement.style.setProperty('--warning-height', '0px');
      return;
    }
    const warningRect = warning.getBoundingClientRect();
    const headerRect = header ? header.getBoundingClientRect() : { bottom: 0 };
    const visibleBelowHeader = warningRect.bottom > headerRect.bottom + 2 && warningRect.top < window.innerHeight;
    const height = visibleBelowHeader ? Math.ceil(warningRect.height) : 0;
    document.documentElement.style.setProperty('--warning-height', `${height}px`);
  }
  updateWarningHeightForMenu();
  window.addEventListener('resize', updateWarningHeightForMenu);
  window.addEventListener('scroll', updateWarningHeightForMenu, { passive: true });

  const TRANSLATIONS = {
  "日本語": "Japanese",
  "English": "English",
  "More": "More",
  "License / Scope": "License / Scope",
  "研究ポートフォリオ": "Research portfolio",
  "AWS 実験の結果、モデル構造、可視化資料をまとめた静的ポートフォリオです。数値・図・会話文は、記載した条件とファイル構成に沿って読めるよう整理しています。": "Static research portfolio summarizing AWS experiment results, model structure, and visual materials. Values, figures, and dialogue are organized with their stated conditions and file layout.",
  "AWS 実験の結果、モデル構造、可視化資料をまとめた静的ポートフォリオです。数値は記載した条件と一緒に読めるよう、Evidence と公開範囲を分けています。": "Static research portfolio summarizing AWS experiment results, model structure, and visual materials. Evidence and release scope are separated so values can be read with their conditions.",
  "概要": "Overview",
  "構造": "Architecture",
  "証拠": "Evidence",
  "可視デモ": "Visual Demo",
  "QAガイド": "QA Guide",
  "リポジトリ": "Repository",
  "詳細": "More",
  "ライセンス / 公開範囲": "License / Scope",
  "メニュー": "Menu",
  "ダーク": "Dark",
  "小さな道路損傷を、": "Small road damage,",
  "境界から説明する。": "explained from the boundary.",
  "軽量モデルを、": "A lightweight model,",
  "実験結果から説明する。": "explained from experiment results.",
  "LiteRaceSegNet-V13 は、7-variant ablation、threshold sweep、boundary-local patch metric を統合した GitHub Pages 向け研究ポータルです。可視画像を前面に出さず、構造要素の寄与・限界・公開範囲を先に確認できるように整理しました。": "LiteRaceSegNet-V13 is a GitHub Pages research portal integrating a 7-variant ablation, threshold sweep, and boundary-local patch metrics. It keeps structure, evidence, and release scope easy to read before the visual sheets.",
  "V13 evidence を見る": "Open V13 evidence",
  "構造を見る": "Open architecture",
  "公開範囲を見る": "Open release scope",
  "LiteRaceSegNet の立ち位置": "LiteRaceSegNet positioning",
  "LiteRaceSegNet は、LiteIRBlock を中心に直接実装した custom LiteIR-style lightweight CNN segmentation model です。": "LiteRaceSegNet is a directly implemented custom LiteIR-style lightweight CNN segmentation model centered on LiteIRBlock.",
  "MobileNetV2/V3-style の inverted residual 設計アイデアを背景にしながら、道路損傷 segmentation 向けに detail/context branch と boundary-guided fusion を組み合わせています。": "It uses MobileNetV2/V3-style inverted-residual efficiency ideas as design background and combines detail/context branches with boundary-guided fusion for road-damage segmentation.",
  "SegFormer-B3 は comparison baseline として別経路に置き、LiteRaceSegNet 本体の説明は lightweight_race.py の custom CNN path を中心にまとめています。": "SegFormer-B3 is placed on a separate comparison-baseline path, while the LiteRaceSegNet explanation focuses on the custom CNN path in lightweight_race.py.",
  "公開パッケージ": "Release package",
  "公開 zip は、静的ページ、コード、図表、説明文、テンプレートを中心に構成しています。": "The release zip centers on static pages, code, figures, text, and templates; external weights, checkpoints, caches, private datasets, and credentials are managed separately.",
  "What changed in V13": "What changed in V13",
  "実験済み evidence をサイトに反映": "Measured evidence integrated into the site",
  "V13 は、AWS 実験で生成した表、画像、読み方をまとめた evidence integrated version です。": "V13 presents concrete tables, visuals, and reading notes produced by the AWS experiment package.",
  "Ablation": "Ablation",
  "Threshold": "Threshold",
  "Boundary": "Boundary",
  "Case split": "Case split",
  "Reading route": "Reading route",
  "レビュー向けの読み順": "Suggested review route",
  "Evidence": "Evidence",
  "Visual Demo": "Visual Demo",
  "QA Guide": "QA Guide",
  "Architecture": "Architecture",
  "Repository": "Repository",
  "Scope": "Scope",
  "QA Guide で研究内容を会話形式に整理": "Research content organized as a QA guide",
  "人物カードは QA Guide の読みやすさを補助する案内役として配置し、本文では構造、数値表、公開範囲を中心に読めるようにしました。": "The character cards support readability in the QA Guide, while the main text keeps structure, metric tables, and release scope in focus.",
  "Research-first layout": "Research-first layout",
  "構造・証拠・公開範囲を最初に整理": "Structure, evidence, and scope first",
  "Overview では見た目の演出より先に、モデルの役割、baseline、evidence、release scope を確認できるようにしました。": "The overview makes the model role, baseline setup, evidence, and release scope readable before decorative visuals.",
  "提案モデル": "Proposed model",
  "比較 baseline": "Comparison baseline",
  "Release package": "Release package",
  "静的ページ、コード、図表、説明文を収録し、external weight、checkpoint、cache、private dataset、credentials は配布物から分けています。": "Static pages, code, figures, and text are included; external weights, checkpoints, caches, private datasets, and credentials are managed separately.",
  "モデル構造": "Model structure",
  "軽量 CNN の分岐構造と境界誘導": "Lightweight CNN branches and boundary guidance",
  "LiteIRBlock と比較 baseline の位置づけ": "LiteIRBlock and comparison-baseline placement",
  "LiteRaceSegNet は MobileNetV2/V3-style lightweight block / inverted residual の設計アイデアから着想を得た custom LiteIR-style lightweight CNN segmentation model です。比較 baseline は別経路に置き、ここでは LiteRaceSegNet の設計を中心に読みます。": "LiteRaceSegNet is a custom LiteIR-style lightweight CNN segmentation model inspired by MobileNetV2/V3-style lightweight-block and inverted-residual design ideas. The comparison baseline lives on a separate path; this page focuses on LiteRaceSegNet design.",
  "短い説明": "Short description",
  "LiteRaceSegNet は LiteIRBlock で軽量化し、boundary-guided fusion で小さな損傷形状を読みやすくした CNN segmentation model です。": "LiteRaceSegNet is a CNN segmentation model that uses LiteIRBlock for efficiency and boundary-guided fusion to make small damage shapes easier to analyze.",
  "V13 evidence: ablation・threshold・boundary metric": "V13 evidence: ablation, threshold, boundary metrics",
  "測定済み AWS evidence": "Measured AWS evidence",
  "主要結果": "Key results",
  "GT mask から easy / hard を整理": "Easy/hard groups from GT masks",
  "Reading scope": "Reading scope",
  "10-image subset の位置づけ": "Role of the 10-image subset",
  "10-image subset は held-out preview/evaluation subset として、mask・overlay・boundary の見え方を確認するために使います。Evidence では数値と条件、Visual Demo では可視化を中心に読みます。": "The 10-image subset is used as a held-out preview/evaluation subset for reading masks, overlays, and boundary behavior. Evidence focuses on values and conditions; Visual Demo focuses on visuals.",
  "Static V13 result viewer": "Static V13 result viewer",
  "AWS 実験結果を読むための静的 viewer": "Static viewer for AWS experiment results",
  "一括確認用シート": "Summary sheets",
  "10 sample cards": "10 sample cards",
  "研究レビューで聞かれそうな質問": "Likely research-review questions",
  "AWS 実験で出た実数値と読み方を、会話形式で追えるようにしました。": "The dialogue follows actual AWS experiment values and how to read them.",
  "対話で evidence を説明する": "Explain evidence through dialogue",
  "補足": "Note",
  "人物画像は研究案内用の生成ビジュアルです。評価内容は Evidence の表と図で確認します。": "The character images are generated guide visuals. Evaluation content is checked through the Evidence tables and figures.",
  "Repository map": "Repository map",
  "研究成果を追跡できる構成": "A structure that makes research outputs traceable",
  "説明ファイルの役割": "Roles of explanation files",
  "SegFormer-B3 関連 script の置き場所": "Location of SegFormer-B3 scripts",
  "比較実験用の SegFormer-B3 scripts を main implementation と別フォルダにまとめています。": "SegFormer-B3 scripts for comparison experiments are kept in a separate folder from the main implementation.",
  "LiteRaceSegNet implementation": "LiteRaceSegNet implementation",
  "SegFormer-B3 baseline scripts": "SegFormer-B3 baseline scripts",
  "Release scope": "Release scope",
  "公開パッケージの構成": "Release package structure",
  "LiteRaceSegNet と SegFormer-B3 の役割": "Roles of LiteRaceSegNet and SegFormer-B3",
  "Third-party baseline handling": "Third-party baseline handling",
  "SegFormer-B3 baseline artifacts": "SegFormer-B3 baseline artifacts",
  "表現の範囲": "Expression scope",
  "そのまま使える表現": "Reusable wording",
  "AWS 実験 evidence 統合ポータル": "AWS experiment evidence portal",
  "V13 / AWS evidence / 軽量道路損傷 segmentation": "V13 / AWS evidence / lightweight road-damage segmentation",
  "モデルの位置づけと公開範囲": "Model positioning and release scope",
  "LiteRaceSegNet は、LiteIRBlock を中心にした custom LiteIR-style lightweight CNN segmentation model です。": "LiteRaceSegNet is a custom LiteIR-style lightweight CNN segmentation model centered on LiteIRBlock.",
  "MobileNetV2/V3-style の inverted residual から着想を得て、道路損傷 segmentation 向けに detail/context branch と boundary-guided fusion を組み合わせています。": "It draws on MobileNetV2/V3-style inverted-residual ideas and combines detail/context branches with boundary-guided fusion for road-damage segmentation.",
  "SegFormer-B3 は比較表で使う Transformer baseline として、LiteRaceSegNet 本体とは別 path に置いています。": "SegFormer-B3 is kept on a separate path as the Transformer baseline used for comparison tables.",
  "full、no detail、no boundary gate、no fusion、no LiteASPP、no aux、slim を同条件で比較。": "Compares full, no-detail, no-boundary-gate, no-fusion, no-LiteASPP, no-aux, and slim under the same protocol.",
  "metric-first と conservative inference を分け、数値比較と可視化用途を切り分ける。": "Separates metric-first settings from conservative inference, keeping numeric comparison and visual review distinct.",
  "whole-image だけでなく、32×32 / 64×64 boundary-local patch metric を追加。": "Adds 32×32 and 64×64 boundary-local patch metrics in addition to whole-image evaluation.",
  "mask area ratio、component count、fragmentation に基づく objective easy/hard split を採用。": "Uses an objective easy/hard split based on mask area ratio, component count, and fragmentation.",
  "数字、画像、実験条件を分けて読みやすい順番に並べています。": "Numbers, visuals, and experiment conditions are separated into a review-friendly reading order.",
  "7 ablation と数値表": "7 ablations and metric tables",
  "mIoU、damage IoU、params、latency、threshold、boundary patch metric を確認。": "Review mIoU, damage IoU, parameters, latency, threshold settings, and boundary patch metrics.",
  "service card、overlay、boundary sheet で qualitative evidence を確認。": "Review qualitative evidence through service cards, overlays, and boundary sheets.",
  "会話で説明練習": "Practice the explanation as dialogue",
  "ablation、threshold、boundary、case split、limitation を対話形式で読む。": "Read ablation, threshold, boundary, case split, and limitations in dialogue form.",
  "構造と出力契約": "Architecture and output contract",
  "detail、LiteASPP、boundary gate、boundary-logit fusion、aux output を読む。": "Review detail branch, LiteASPP, boundary gate, boundary-logit fusion, and auxiliary output.",
  "公開ファイル構成": "Public file layout",
  "final_evidence、docs/assets/v13、scripts、model implementation の場所を確認。": "Check where final_evidence, docs/assets/v13, scripts, and model implementation files are located.",
  "公開範囲": "Release scope",
  "raw dataset、weights、credentials は含めず、10-image evaluation subset の位置づけも確認。": "Confirm that raw datasets, weights, and credentials are excluded, and review the role of the 10-image evaluation subset.",
  "V13 QA Guide を見る": "Open the V13 QA Guide",
  "構造・ablation・実装確認": "Architecture, ablation, implementation check",
  "証拠・説明順・公開範囲": "Evidence, reading order, release scope",
  "証拠と公開範囲を読みやすく整理": "Evidence and release scope organized for review",
  "メインページでは、モデル説明、baseline の位置づけ、公開範囲を短く確認できるように整理しました。": "The main page gives a quick view of the model description, baseline placement, and release scope.",
  "LiteRaceSegNet は custom LiteIR-style lightweight CNN segmentation model です。": "LiteRaceSegNet is a custom LiteIR-style lightweight CNN segmentation model.",
  "SegFormer-B3 は別 path の comparison baseline として扱います。": "SegFormer-B3 is handled as a comparison baseline on a separate path.",
  "公開 package": "Public package",
  "静的ページ、コード、図表、説明文を中心に構成しています。": "The package centers on static pages, code, figures, and explanatory text.",
  "静的ポートフォリオ。公開用 evidence、図表、コード、説明文を中心に構成。": "Static portfolio centered on public evidence, figures, code, and explanatory text.",
  "ホーム": "Home",
  "/ 構造": "/ Architecture",
  "LiteRaceSegNet-V13 は、custom LiteIR-style lightweight CNN backbone と boundary-guided segmentation decoder を軸に、小さな損傷領域と不規則境界を説明します。比較表では SegFormer-B3 baseline も扱い、このページでは LiteRaceSegNet 本体の構造を中心に読みます。": "LiteRaceSegNet-V13 explains small damage regions and irregular boundaries through a custom LiteIR-style lightweight CNN backbone and a boundary-guided segmentation decoder. Comparison tables also include the SegFormer-B3 baseline, while this page focuses on the LiteRaceSegNet architecture.",
  "の LiteIRBlock は、軽量 inverted-residual の考え方を道路損傷 segmentation 向けに組み直した custom block です。detail/context branch と boundary-guided fusion につながる main path として読めます。": " contains LiteIRBlock, a custom block that adapts lightweight inverted-residual ideas for road-damage segmentation. It is the main path leading into the detail/context branches and boundary-guided fusion.",
  "公開用の再構成図。入力から detail/context、LiteASPP、boundary-guided fusion、出力までを一つの流れで確認する。": "Public-facing reconstructed diagram showing the flow from input to detail/context branches, LiteASPP, boundary-guided fusion, and outputs.",
  "なぜ境界を別に見るのか": "Why boundaries are reviewed separately",
  "道路損傷は画素数が小さく、低コントラストで、背景路面と混ざりやすい。mIoU の平均値だけでは、細い亀裂が消えたのか、境界が膨張したのか、背景へ吸収されたのかが説明しにくい。": "Road damage often occupies few pixels, has low contrast, and blends into the road surface. A mean mIoU value alone does not explain whether a thin crack disappeared, a boundary expanded, or a region was absorbed into the background.",
  "そのため本ポータルでは、主出力": "This portal therefore separates the main output",
  "、補助出力": ", auxiliary output",
  "、境界補助": ", and boundary auxiliary logit",
  "を分け、実装確認と説明を接続します。": "so implementation checks and explanations stay connected.",
  "説明の軸": "Explanation focus",
  "「軽いモデルで高い数値を出す」だけではなく、「どの境界劣化をどう観察するか」を先に置く。": "The focus is not only on getting high scores with a lightweight model, but on how boundary degradation is observed and explained.",
  "主要コンポーネント": "Main components",
  "各部品は単独の飾りではなく、境界を説明可能にするための役割を持ちます。": "Each component has a role in making boundary behavior easier to explain; it is not decorative.",
  "浅い特徴を残し、細線・端点・局所的な変化を失いにくくする。": "Preserves shallow features so thin lines, endpoints, and local changes are less likely to be lost.",
  "周辺路面や損傷の連続性を読み、局所ノイズだけで判定しない。": "Reads surrounding road context and damage continuity instead of relying only on local noise.",
  "軽量な受容野拡張で、広い文脈を過剰なパラメータ増加なしに取り込む。": "Adds a wider receptive field with limited parameter growth.",
  "境界補助信号を使い、主セグメンテーションの形状説明を支える。": "Uses a boundary auxiliary signal to support the shape explanation of the main segmentation output.",
  "出力契約と smoke check": "Output contract and smoke check",
  "モデル説明と実装確認をつなぐ最低限の契約です。公開ページでは、実測値と未測定値を混ぜず、この契約を基準に説明します。": "This is the minimum contract connecting the model explanation to implementation checks. The public pages use it to avoid mixing measured and unmeasured values.",
  "確認する意味": "What it checks",
  "レビュー時の見方": "How to read it in review",
  "主セグメンテーション logits": "Main segmentation logits",
  "損傷領域の最終予測を読む。": "Read the final damage-region prediction.",
  "補助セグメンテーション出力": "Auxiliary segmentation output",
  "中間 supervision と安定性の補助として扱う。": "Treat it as intermediate supervision and a stability aid.",
  "境界補助 logit": "Boundary auxiliary logit",
  "境界の残り方、膨張、細線消失の説明に使う。": "Use it to explain boundary retention, expansion, and thin-line disappearance.",
  "境界劣化を分類して読む": "Read boundary degradation by category",
  "成功例だけでなく、侵食、膨張、細線消失、文脈吸収、誤境界を分けることで、モデルがどこで弱いかを説明できます。これは改善方針や ablation の理由にもなります。": "Separating erosion, expansion, thin-line loss, context absorption, and false boundaries explains where the model is weak, not just where it succeeds. It also motivates future improvements and ablations.",
  "細い亀裂が途中で切れる。": "A thin crack breaks in the middle.",
  "背景路面の模様を損傷として拾う。": "A road-surface texture is picked up as damage.",
  "損傷領域が太りすぎ、実形状から外れる。": "The predicted damage area becomes too thick and drifts from the actual shape.",
  "影や水濡れで boundary logit が不安定になる。": "Shadows or wet surfaces make the boundary logit unstable.",
  "失敗条件を隠さず、研究テーマの説明材料として残す。": "Failure conditions are kept visible as part of the research explanation.",
  "静的ポートフォリオ。公開用の図表、コード、説明文を中心に構成。": "Static portfolio centered on public figures, code, and explanatory text.",
  "ブラウザ推論ではなく、AWS 実験で生成された conservative inference 結果を静的に確認するページです。": "This page is a static review of conservative-inference results generated by the AWS experiment, not browser-side inference.",
  "このページでは、AWS 実験で生成された segmentation result を静的に並べ、mask、overlay、boundary の読み方を確認します。": "This page lays out segmentation results generated by the AWS experiment so masks, overlays, and boundaries can be reviewed statically.",
  "Mask / overlay / boundary / card を分離": "Mask, overlay, boundary, and card views are separated.",
  "10-image subset の扱い": "How the 10-image subset is used",
  "発表や GitHub Pages では、個別画像よりまずこの 3 枚を見せると分かりやすいです。": "For presentations and GitHub Pages, these three overview sheets are easier to read before individual images.",
  "各カードは service viewer 風に整理した、静的な結果確認用プレビューです。": "Each card is a static result preview arranged in a service-viewer style.",
  "/ 証拠": "/ Evidence",
  "このページは placeholder を置かず、AWS 実験から得た結果を表示します。同一条件で構造差を比較した研究 evidence として、数値と条件をセットでまとめています。": "This page shows results from the AWS experiment instead of placeholders. Values and conditions are paired as research evidence comparing architecture changes under the same protocol.",
  "主要 result values": "Main result values",
  "Full model は最も高い mIoU を示し、LiteASPP と aux loss の除去で比較的大きい低下が見られました。": "The full model produced the highest mIoU, while removing LiteASPP and auxiliary loss caused comparatively larger drops.",
  "同じ protocol で各構造要素を off にし、full reference との差を確認します。": "Each architecture element is switched off under the same protocol and compared with the full reference model.",
  "Full model が最良。LiteASPP removal は ΔmIoU -0.0222、aux removal は ΔmIoU -0.0153。Slim は params を 0.059M まで下げつつ mIoU 0.8064 を維持しました。": "The full model is best. Removing LiteASPP gives ΔmIoU -0.0222, and removing aux loss gives ΔmIoU -0.0153. Slim reduces parameters to 0.059M while keeping mIoU at 0.8064.",
  "metric-first と conservative を分離": "Metric-first and conservative settings are separated",
  "定量比較は metric-first、可視化や demo mask は conservative setting として分けて記述します。": "Quantitative comparison is described as metric-first, while visual/demo masks are described as conservative settings.",
  "Boundary-local precision は比較的高い一方、recall は制限的です。これは今後の boundary refinement 課題として明記します。": "Boundary-local precision is comparatively high, while recall is limited. This is stated as a future boundary-refinement target.",
  "area group は GT mask area ratio と positive pixel count を使って分類し、fragmentation は component count で確認します。Evidence タブでは画像を置かず、数値・設定・解釈メモを分離します。": "Area groups are classified with GT mask area ratio and positive pixel count, while fragmentation is checked by component count. The Evidence tab keeps values, settings, and interpretation notes separate from images.",
  "10-image subset は held-out preview/evaluation subset として整理します。可視化は Visual Demo 側に分け、Evidence では数値と条件を優先します。": "The 10-image subset is treated as a held-out preview/evaluation subset. Visuals are kept in Visual Demo, while Evidence prioritizes values and conditions.",
  "Repository 内の evidence ファイル": "Evidence files in the repository",
  "GitHub 上で表・CSV・Markdown を確認できます。": "Tables, CSV files, and Markdown reports can be reviewed on GitHub.",
  "/ ライセンス / 公開範囲": "/ License / Scope",
  "公開範囲とライセンス": "Release scope and license",
  "公開 package の範囲": "Public package scope",
  "ポートフォリオ公開と研究レビューに使うファイルを整理し、第三者ライセンス、非公開データ、認証情報、生成ビジュアルの扱いを分けています。": "Files used for portfolio release and research review are separated from third-party licenses, private data, credentials, and generated visuals.",
  "含めるもの": "Included",
  "静的ページ、説明図、README、MODEL_CARD、評価プロトコル、公開用テンプレート。": "Static pages, explanatory diagrams, README, MODEL_CARD, evaluation protocol, and public templates.",
  "含めないもの": "Excluded",
  "raw datasets、private images/masks、checkpoints、pretrained weights、.env、API keys、cloud credentials、.pem files、個人環境ファイル。": "Raw datasets, private images/masks, checkpoints, pretrained weights, .env files, API keys, cloud credentials, .pem files, and personal environment files.",
  "このサイトは静的な研究ポートフォリオです。ブラウザ上で実推論、アップロード、サーバー通信を行いません。研究説明、図版閲覧、QA 形式の案内を提供します。": "This site is a static research portfolio. It does not run browser inference, uploads, or server communication; it provides research explanation, figure viewing, and QA-style guidance.",
  "LiteRaceSegNet と SegFormer-B3 の位置づけ": "Placement of LiteRaceSegNet and SegFormer-B3",
  "LiteRaceSegNet 本体、SegFormer-B3 baseline、public package の外に置く artifact を整理します。": "This section separates the LiteRaceSegNet model, the SegFormer-B3 baseline, and artifacts kept outside the public package.",
  "LiteRaceSegNet は MobileNetV2/V3-style inverted residual の設計アイデアから着想を得た、直接実装の custom LiteIR-style lightweight CNN segmentation model です。": "LiteRaceSegNet is a directly implemented custom LiteIR-style lightweight CNN segmentation model inspired by MobileNetV2/V3-style inverted-residual design ideas.",
  "SegFormer-B3 は comparison baseline/reference として別 path に置いています。LiteRaceSegNet の実装主経路は": "SegFormer-B3 is kept on a separate path as a comparison baseline/reference. The main LiteRaceSegNet implementation path is",
  "です。": ".",
  "公開 package の外": "Outside the public package",
  "SegFormer-B3 pretrained weight、fine-tuned checkpoint、Hugging Face cache、private dataset、credentials は public package の外に置きます。script 実行後の artifact はライセンス確認後に扱います。": "SegFormer-B3 pretrained weights, fine-tuned checkpoints, Hugging Face cache files, private datasets, and credentials stay outside the public package. Artifacts generated after running scripts are handled only after license review.",
  "SegFormer-B3 関連 code/script は optional comparison baseline 用です。weight や cache は public package の外に置きます。": "SegFormer-B3 code/scripts are for an optional comparison baseline. Weights and cache files stay outside the public package.",
  "関連 path": "Related paths",
  "は SegFormer-B3 comparison baseline 用です。": "is for the SegFormer-B3 comparison baseline.",
  "SegFormer-B3 の参照元 NVLabs repo は research/evaluation reference として扱います。Hugging Face の nvidia/segformer-b3-finetuned-ade-512-512 は license 表示が other のため、artifact の扱いは別途確認対象にします。": "The NVLabs SegFormer repository is treated as a research/evaluation reference. The Hugging Face nvidia/segformer-b3-finetuned-ade-512-512 entry lists its license as other, so artifact handling is reviewed separately.",
  "は Hugging Face SegFormer-B3 weight を local comparison 用に download/cache する script です。生成物はライセンス確認後に扱います。": "downloads/caches Hugging Face SegFormer-B3 weights for local comparison. Generated artifacts are handled after license review.",
  "には torchvision": "contains a torchvision",
  "を呼ぶ": "call through the",
  "class があります。V13 の説明主経路は": "class. The main V13 explanation path is",
  "です。TorchVision は BSD-3-Clause、Hugging Face Transformers は Apache 2.0 として扱います。": ". TorchVision is treated as BSD-3-Clause, and Hugging Face Transformers as Apache 2.0.",
  "公開目的は閲覧と評価補助です。商用利用、再配布、第三者データ利用は別途確認が必要です。": "The public purpose is viewing and evaluation support. Commercial use, redistribution, and third-party data use require separate review.",
  "ライブラリ、フレームワーク、データセット、比較対象はそれぞれのライセンスに従います。": "Libraries, frameworks, datasets, and comparison targets follow their respective licenses.",
  "研究案内用の AI 生成ビジュアルです。主役はモデル構造、評価証拠、公開範囲の説明です。": "These are AI-generated guide visuals. The technical focus remains on model structure, evaluation evidence, and release scope.",
  "測定済みの値だけを確定値として扱う。": "Treat only measured values as confirmed values.",
  "小規模 validation は研究レビュー用の参考評価として扱う。": "Treat small validation results as reference evaluation for research review.",
  "静的デモは qualitative result viewer として見せる。": "Present the static demo as a qualitative result viewer.",
  "非公開データや重みは public package の外に分ける。": "Keep private data and weights outside the public package.",
  "「公開用の静的プレビュー」": "\"Public static preview\"",
  "「測定済み結果 / 予備参照 / 追加検証項目」": "\"Measured results / preliminary reference / additional validation items\"",
  "「実データ・重み・認証情報は含めない」": "\"No raw data, weights, or credentials included\"",
  "「境界劣化を説明する研究ポートフォリオ」": "\"Research portfolio explaining boundary degradation\"",
  "V13 では会話量を増やし、ablation・threshold・boundary・case split・limitation まで説明します。": "V13 expands the dialogue to cover ablation, thresholding, boundary metrics, case split, and limitations.",
  "初見レビュー": "First review",
  "研究の入口": "Research entry point",
  "構造説明": "Architecture explanation",
  "分岐と出力契約": "Branches and output contract",
  "7 variant の読み方": "How to read 7 variants",
  "patch metric と限界": "Patch metrics and limits",
  "easy / hard の客観化": "Objective easy/hard split",
  "Demo 範囲": "Demo scope",
  "静的 viewer": "Static viewer",
  "弱点の説明": "Explaining weaknesses",
  "評価範囲": "Evaluation scope",
  "タブを選ぶと、発表・メール・README に使う説明を短い会話で確認できます。": "Select a tab to review short dialogue explanations that can be used in presentations, emails, or README text.",
  "この会話はレビュー準備用メモです。数値の詳細は Evidence ページと final_evidence の CSV/Markdown で確認できます。": "This dialogue is a review-preparation memo. Detailed values are available in the Evidence page and the final_evidence CSV/Markdown files.",
  "会話表示は静的 JavaScript です。AI API、画像アップロード、外部通信は行いません。": "The dialogue display is static JavaScript. It does not use an AI API, image uploads, or external communication.",
  "7 ablation と threshold を確認": "Check the 7 ablations and threshold settings",
  "cards / overlays / boundaries を確認": "Check cards, overlays, and boundaries",
  "patch metric と recall limitation を確認": "Check patch metrics and recall limitations",
  "評価範囲を確認": "Check the evaluation scope",
  "V13 では、最初に何を伝えるべきですか？": "For V13, what should be explained first?",
  "「軽量 segmentation モデルを作った」だけでなく、AWS 実験で構造差・閾値・境界・case split を検証した版だと伝えます。": "Explain that this is not just a lightweight segmentation model; it is a version where architecture differences, thresholds, boundaries, and case splits were checked through AWS experiments.",
  "性能の大きな言い切りより、実験の中身を先に見せるわけですね。": "So the experiment details come before any broad performance claim.",
  "はい。full model、ablation、threshold、boundary-local metric、visual evidence の順に見せると研究として読みやすくなります。": "Yes. It reads well as research when shown in the order of full model, ablation, threshold, boundary-local metrics, and visual evidence.",
  "モデル構造と baseline はどう分けて説明しますか？": "How should the model architecture and baseline be separated?",
  "LiteRaceSegNet は MobileNetV2/V3-style inverted residual の設計アイデアを参考にした custom LiteIR-style lightweight CNN segmentation model として説明します。": "Describe LiteRaceSegNet as a custom LiteIR-style lightweight CNN segmentation model inspired by MobileNetV2/V3-style inverted-residual design ideas.",
  "SegFormer-B3 は comparison baseline として別 path に置いています。関連 script はありますが、weight や checkpoint は public package の外です。": "SegFormer-B3 is kept on a separate path as a comparison baseline. Related scripts are included, but weights and checkpoints stay outside the public package.",
  "実装確認では out、aux、boundary の 3 出力契約と ablation 結果を evidence ページに接続します。": "Implementation checks connect the three-output contract—out, aux, and boundary—to the ablation results on the Evidence page.",
  "7つの ablation で一番大きな結果は？": "What stands out most in the seven ablations?",
  "Full model が mIoU 0.8072、damage IoU 0.7113 で最も高い結果でした。": "The full model performed best with mIoU 0.8072 and damage IoU 0.7113.",
  "LiteASPP を外すと mIoU が 0.7850 まで下がり、低下幅が最も大きいです。": "Removing LiteASPP drops mIoU to 0.7850, the largest decrease.",
  "Aux loss を外した場合も mIoU 0.7919 で、補助 supervision の役割が見えます。": "Removing aux loss gives mIoU 0.7919, showing the role of auxiliary supervision.",
  "Slim variant は params 0.059M なのに mIoU 0.8064 を維持しました。": "The slim variant keeps mIoU at 0.8064 while reducing parameters to 0.059M.",
  "ただし slim の latency 改善は明確ではないので、speed claim ではなく parameter efficiency として説明します。": "However, the slim variant does not show a clear latency improvement, so it should be framed as parameter efficiency rather than a speed claim.",
  "Threshold はどれを採用すればいいですか？": "Which threshold setting should be used?",
  "定量比較は metric-first: threshold 0.60, min area 120 を使います。": "For quantitative comparison, use metric-first: threshold 0.60 and min area 120.",
  "可視化では conservative: threshold 0.75, min area 30 を使います。": "For visualization, use conservative: threshold 0.75 and min area 30.",
  "conservative は precision を高め、false positive を抑えるための demo/preview 用設定です。": "The conservative setting is for demo/preview use, raising precision and reducing false positives.",
  "一つの threshold を全用途に使わず、目的ごとに分けた点が大事です。": "The important point is that one threshold is not forced into every use case; settings are separated by purpose.",
  "Boundary branch は mIoU だけで評価していいですか？": "Is mIoU enough to evaluate the boundary branch?",
  "いいえ。V13 では 32×32 と 64×64 の boundary-local patch metric を追加しました。": "No. V13 adds 32×32 and 64×64 boundary-local patch metrics.",
  "Aggregate boundary patch IoU は 0.3212、precision は 0.8864 です。": "Aggregate boundary patch IoU is 0.3212, and precision is 0.8864.",
  "一方で recall は 0.3350 なので、境界 recall はまだ制限的です。": "Recall is 0.3350, so boundary recall remains limited.",
  "つまり boundary-aware design の効果は見せつつ、boundary refinement は今後の改善点として残します。": "That shows the value of the boundary-aware design while leaving boundary refinement as future work.",
  "Easy / hard は目で見て分けましたか？": "Were easy and hard cases separated by visual judgment?",
  "主観ではなく、GT mask area ratio、positive pixels、component count を使って分けました。": "No. They were separated using GT mask area ratio, positive pixels, and component count.",
  "今回の 10 samples では large/easy 4、medium 3、small/hard 3 です。": "In the 10 samples, there are 4 large/easy, 3 medium, and 3 small/hard cases.",
  "fragmented は 10 samples で、component が多いケースとして扱います。": "Fragmented cases are treated as samples with many components among the 10 samples.",
  "shadow confusion や road texture confusion は、今後の qualitative taxonomy として追加整理できます。": "Shadow confusion and road-texture confusion can be organized later as a qualitative taxonomy.",
  "Visual Demo は実サービスですか？": "Is Visual Demo a live service?",
  "いいえ。V13 でも static result viewer です。画像アップロード、API、server inference はありません。": "No. In V13 it is still a static result viewer. There is no image upload, API, or server inference.",
  "service card、overlay、boundary は AWS 実験から生成した結果画像です。": "Service cards, overlays, and boundary views are result images generated from the AWS experiment.",
  "研究結果の見せ方を補助する visual evidence として、実験条件と一緒に読みます。": "They are visual evidence for presenting the research result and should be read with the experiment conditions.",
  "失敗条件はどこまで見せますか？": "How much of the failure conditions should be shown?",
  "細線消失、境界膨張、影・路面模様の誤検出、小領域 missed damage を分けて説明します。": "Separate thin-line loss, boundary expansion, false detections from shadows or road textures, and missed small damage.",
  "今回の zip では objective split と visual sheets はありますが、詳細な failure taxonomy はまだ補強余地があります。": "This zip includes objective splits and visual sheets, while a more detailed failure taxonomy can still be strengthened.",
  "今回の整理では、failure case を分類するための土台を作ったところまで示します。": "This version shows the foundation for classifying failure cases.",
  "今回の結果はどの範囲で見せますか？": "What scope should these results be shown under?",
  "held-out preview/evaluation subset の結果として、測定条件と一緒に見せます。": "Show them as held-out preview/evaluation subset results together with the measurement conditions.",
  "10-image evaluation subset は held-out preview/evaluation subset として扱います。": "The 10-image evaluation subset is treated as a held-out preview/evaluation subset.",
  "Boundary F1 や recall から、boundary refinement を future work として整理します。": "Boundary F1 and recall support framing boundary refinement as future work.",
  "研究型 evidence package として、測定条件と結果表をセットで提示します。": "As a research-style evidence package, it presents measurement conditions together with result tables.",
  "GitHub に入れるものは何ですか？": "What goes into GitHub?",
  "静的 HTML、README、model code、scripts、final_evidence、docs/assets/v13 の visual sheets です。": "Static HTML, README, model code, scripts, final_evidence, and visual sheets under docs/assets/v13.",
  "public package は静的 HTML、README、model code、scripts、final_evidence、visual sheets を中心に構成します。": "The public package centers on static HTML, README, model code, scripts, final_evidence, and visual sheets.",
  "final_evidence は今回の結果表と画像を確認する場所です。SegFormer-B3 setup script の generated artifact は local comparison 用として分けています。": "final_evidence is where the current result tables and images are reviewed. Generated artifacts from the SegFormer-B3 setup script are separated for local comparison.",
  "/ リポジトリ": "/ Repository",
  "公開ページ、図版、実装メモ、評価テンプレートを分け、閲覧者が「どこに何があるか」を確認できるように整理します。": "Public pages, figures, implementation notes, and evaluation templates are separated so readers can see where each item lives.",
  "公開用の構成図。サイト、図版、証拠テンプレート、説明文の位置を分離する。": "Public-facing structure diagram separating the site, figures, evidence templates, and explanatory text.",
  "ページだけでなく説明ドキュメントも補強": "Explanation documents are strengthened, not just the pages",
  "今回の更新では、QA ページの見た目だけでなく、リポジトリに入る説明文書も追加しました。研究内容を追跡しやすくするため、モデル説明、証拠プロトコル、レビュー用チェックリストを分けます。": "This update adds explanatory documents to the repository, not only visual changes to the QA page. Model description, evidence protocol, and review checklist are separated so the research can be traced more easily.",
  "ページ、図版、MODEL_CARD、evidence protocol を分け、レビュー時に参照しやすい構成にしています。": "Pages, figures, MODEL_CARD, and evidence protocol are separated for easier review.",
  "Architecture と MODEL_CARD で、構造、forward 出力、想定用途、限界を説明する。": "Architecture and MODEL_CARD explain structure, forward outputs, intended use, and limitations.",
  "Evidence と EVIDENCE_PROTOCOL で、測定済み結果・参考値・追加検証項目・CPU/GPU の扱いを明記する。": "Evidence and EVIDENCE_PROTOCOL clarify measured results, reference values, additional validation items, and CPU/GPU handling.",
  "Overview、Visual Demo で、読み順と静的プレビューの公開範囲を示す。": "Overview and Visual Demo show the reading order and static-preview scope.",
  "baseline 用 script の位置づけ": "Placement of baseline scripts",
  "SegFormer-B3 関連 script は比較用の別 path として整理しています。": "SegFormer-B3 scripts are organized as a separate comparison path.",
  "提案モデルは custom LiteIR-style lightweight CNN segmentation model です。主要な実装説明は": "The proposed model is a custom LiteIR-style lightweight CNN segmentation model. The main implementation explanation uses",
  "を基準にします。": "as its reference point.",
  "は optional comparison baseline 用の別 path です。": "is a separate path for the optional comparison baseline.",
  "SegFormer-B3 pretrained weight、fine-tuned checkpoint、Hugging Face cache は public package の外に置きます。script 実行後の生成物はライセンス確認後に扱います。": "SegFormer-B3 pretrained weights, fine-tuned checkpoints, and Hugging Face cache files stay outside the public package. Generated script artifacts are handled after license review.",
  "は Hugging Face SegFormer-B3 weight を local comparison 用に download/cache する script です。生成物は public package の外に置いています。": "downloads/caches Hugging Face SegFormer-B3 weights for local comparison. Generated artifacts are kept outside the public package.",
  "公開する範囲を明示する": "Make the release scope explicit",
  "静的ページ、図版、説明文、公開用テンプレート": "Static pages, figures, explanatory text, and public templates",
  "非公開データ、重み、認証情報、個人環境ファイル": "Private data, weights, credentials, and personal environment files",
  "評価プロトコル、可視化例": "Evaluation protocol and visual examples",
  "raw 実験フォルダ、秘密鍵、クラウド設定、.env": "Raw experiment folders, private keys, cloud settings, and .env files",
  "研究案内用の人物画像": "Guide character images for research navigation",
  "第三者権利が不明な素材、個人識別情報": "Materials with unclear third-party rights and personally identifiable information",
  "公開フローは説明図としてのみ掲載。公開範囲の考え方を示す。": "The publishing flow is shown only as an explanatory diagram to clarify the release-scope concept."
};
  const LANGUAGE_TABLES = { en: TRANSLATIONS };

  const originalText = new WeakMap();
  const skipTags = new Set(['SCRIPT','STYLE','CODE','PRE','TEXTAREA','INPUT','NOSCRIPT']);

  function normalize(text) { return text.replace(/\s+/g, ' ').trim(); }
  function setTextNode(node, lang) {
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const original = originalText.get(node);
    const core = normalize(original);
    if (!core) return;
    if (lang === 'ja') { node.nodeValue = original; return; }
    const table = LANGUAGE_TABLES[lang] || TRANSLATIONS;
    const translated = table[core];
    if (!translated) return;
    const leading = (original.match(/^\s*/) || [''])[0];
    const trailing = (original.match(/\s*$/) || [''])[0];
    node.nodeValue = leading + translated + trailing;
  }
  function translateVisibleText(lang) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || skipTags.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest('.no-translate')) return NodeFilter.FILTER_REJECT;
        return normalize(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => setTextNode(node, lang));
  }

  const themeToggle = document.querySelector('[data-theme-toggle]');
  const themeLabel = document.querySelector('[data-theme-label]');
  const themeIcon = document.querySelector('[data-theme-icon]');
  function storageGet(key, fallback) {
    try { return window.localStorage.getItem(key) || fallback; }
    catch (_) { return fallback; }
  }
  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); }
    catch (_) { /* Static/local preview can run without storage permission. */ }
  }
  let currentLang = storageGet('lrs-v13-lang', 'ja');
  function themeLabelText(theme) {
    const darkActive = theme === 'dark';
    if (currentLang === 'en') return darkActive ? 'Light' : 'Dark';
    return darkActive ? 'ライト' : 'ダーク';
  }
  function applyTheme(theme) {
    document.body.classList.toggle('theme-dark', theme === 'dark');
    if (themeLabel) themeLabel.textContent = themeLabelText(theme);
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀' : '☾';
  }
  const savedTheme = storageGet('lrs-v13-theme', 'light');
  applyTheme(savedTheme);
  if (themeToggle) themeToggle.addEventListener('click', () => {
    const next = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
    storageSet('lrs-v13-theme', next);
    applyTheme(next);
  });

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  let typingRun = 0;

  function resetPanel(panel){
    if(!panel) return;
    panel.querySelectorAll('.bubble').forEach(b => b.classList.remove('revealed'));
    panel.querySelectorAll('.typewriter').forEach(el => { el.textContent = ''; el.classList.remove('typing','done'); });
    const scrollBox = panel.closest('.qa-chat-panels');
    if(scrollBox) scrollBox.scrollTop = 0;
  }

  function fillPanel(panel){
    if(!panel) return;
    panel.querySelectorAll('.bubble').forEach(b => b.classList.add('revealed'));
    panel.querySelectorAll('.typewriter').forEach(el => { el.textContent = el.dataset.text || ''; el.classList.remove('typing'); el.classList.add('done'); });
    const scrollBox = panel.closest('.qa-chat-panels');
    if(scrollBox) scrollBox.scrollTop = scrollBox.scrollHeight;
  }

  function prepareDialogueLanguage(lang) {
    document.querySelectorAll('.typewriter').forEach(el => {
      if (!el.dataset.textJa) el.dataset.textJa = el.dataset.text || '';
      const ja = el.dataset.textJa;
      const table = LANGUAGE_TABLES[lang] || TRANSLATIONS;
      el.dataset.textEn = TRANSLATIONS[ja] || ja;
      el.dataset.text = lang === 'ja' ? ja : (table[ja] || el.dataset.textEn || ja);
    });
  }

  async function typeOne(el, runId){
    const bubble = el.closest('.bubble');
    const panel = el.closest('.scenario-panel');
    const scrollBox = el.closest('.qa-chat-panels');
    const text = el.dataset.text || '';
    if (bubble) bubble.classList.add('revealed');
    el.textContent = '';
    el.classList.add('typing');
    const speed = 15;
    for (const ch of text){
      if(runId !== typingRun) return;
      el.textContent += ch;
      if(scrollBox) scrollBox.scrollTop = scrollBox.scrollHeight;
      await sleep((ch === '。' || ch === '、' || ch === '.' || ch === ',') ? speed * 4 : speed);
    }
    el.classList.remove('typing');
    el.classList.add('done');
    if(panel && scrollBox) scrollBox.scrollTop = scrollBox.scrollHeight;
  }

  async function playPanel(panel){
    if(!panel) return;
    typingRun += 1;
    const runId = typingRun;
    resetPanel(panel);
    if(prefersReduced){ fillPanel(panel); return; }
    const lines = Array.from(panel.querySelectorAll('.typewriter'));
    for(const line of lines){
      if(runId !== typingRun) return;
      await typeOne(line, runId);
      await sleep(110);
    }
  }

  function activateScenario(stage, name){
    if(!stage || !name) return;
    typingRun += 1;
    stage.querySelectorAll('.scenario-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.scenario === name));
    stage.querySelectorAll('.scenario-panel').forEach(panel => {
      const active = panel.dataset.panel === name;
      panel.classList.toggle('active', active);
      resetPanel(panel);
    });
    playPanel(stage.querySelector(`.scenario-panel[data-panel="${name}"]`));
  }

  function applyImageLanguage(lang) {
    document.querySelectorAll('img[data-en-src]').forEach(img => {
      if (!img.dataset.jaSrc) img.dataset.jaSrc = img.getAttribute('src') || '';
      const nextSrc = lang === 'en' ? img.dataset.enSrc : img.dataset.jaSrc;
      if (nextSrc && img.getAttribute('src') !== nextSrc) img.setAttribute('src', nextSrc);
    });
  }

  function applyLanguage(lang, replayDialogue = false) {
    currentLang = ['ja','en'].includes(lang) ? lang : 'ja';
    storageSet('lrs-v13-lang', currentLang);
    document.documentElement.lang = currentLang;
    translateVisibleText(currentLang);
    applyImageLanguage(currentLang);
    prepareDialogueLanguage(currentLang);
    document.querySelectorAll('[data-lang-switch]').forEach(button => button.classList.toggle('active', button.dataset.langSwitch === currentLang));
    if (themeLabel) themeLabel.textContent = themeLabelText(document.body.classList.contains('theme-dark') ? 'dark' : 'light');
    if(replayDialogue) {
      const stage = document.querySelector('[data-typing-stage]');
      const active = stage && stage.querySelector('.scenario-panel.active');
      if(active) playPanel(active);
    }
  }

  const savedLang = currentLang;
  applyLanguage(savedLang, false);
  document.querySelectorAll('[data-lang-switch]').forEach(button => {
    button.addEventListener('click', () => applyLanguage(button.dataset.langSwitch || 'ja', true));
  });

  document.querySelectorAll('[data-typing-stage]').forEach(stage => {
    stage.querySelectorAll('.scenario-tab').forEach(tab => tab.addEventListener('click', () => activateScenario(stage, tab.dataset.scenario)));
    const active = stage.querySelector('.scenario-panel.active');
    if(!active) return;
    if(!('IntersectionObserver' in window)) { playPanel(active); return; }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting && !stage.dataset.played){
          stage.dataset.played = 'true';
          playPanel(stage.querySelector('.scenario-panel.active'));
        }
      });
    }, {threshold: 0.18});
    observer.observe(stage);
  });
});