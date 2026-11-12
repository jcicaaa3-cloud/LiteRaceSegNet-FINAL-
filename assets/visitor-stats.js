/* LiteRaceSegNet-V13-Clean visitor statistics
   Static GitHub Pages counter with an immediate local fallback.
   - Remote global counts: CounterAPI v1 public counters
   - Local fallback: localStorage so the panel never stays blank
*/
(function(){
  'use strict';

  const CONFIG = {
    namespace: 'literacesegnet-v13-portal-clean',
    endpoint: 'https://api.counterapi.dev/v1',
    repoUrl: 'https://github.com/jcicaaa3-cloud/LiteRaceSegNet-FINAL-',
    storagePrefix: 'lrs-v13-clean-traffic-v2',
    timeoutMs: 7500
  };

  const LABELS = {
    ko: {
      chip: '방문 통계', title: '방문 통계', close: '닫기', open: '열기',
      site: '사이트 누적 방문', unique: '방문자 수', page: '현재 페이지', github: 'GitHub 이동',
      loading: '실시간 카운터 연결 중 · 임시 수치 표시',
      global: '실시간 카운터 연결됨',
      local: '외부 카운터 연결 전 · 이 브라우저 기준 표시',
      note: '사이트 방문과 GitHub 저장소 이동을 집계합니다. 외부 카운터가 막혀도 화면은 멈추지 않도록 브라우저 기준 수치를 먼저 보여줍니다.',
      repo: 'GitHub 저장소 열기', unit: '회'
    },
    ja: {
      chip: '訪問統計', title: '訪問統計', close: '閉じる', open: '開く',
      site: 'サイト累計訪問', unique: '訪問者数', page: '現在ページ', github: 'GitHub 遷移',
      loading: 'リアルタイムカウンター接続中 · 仮の数値を表示',
      global: 'リアルタイムカウンター接続済み',
      local: '外部カウンター接続前 · このブラウザ基準で表示',
      note: 'サイト訪問と GitHub リポジトリへの遷移を集計します。外部カウンターが遮断されても、画面が止まらないようにブラウザ基準の数値を先に表示します。',
      repo: 'GitHub リポジトリを開く', unit: '回'
    },
    en: {
      chip: 'Visit stats', title: 'Visit stats', close: 'Close', open: 'Open',
      site: 'Total site views', unique: 'Visitors', page: 'Current page', github: 'GitHub exits',
      loading: 'Connecting live counter · showing temporary counts',
      global: 'Live counter connected',
      local: 'External counter not connected yet · browser-local counts shown',
      note: 'Counts site visits and exits to the GitHub repository. Browser-local counts appear first so the panel never gets stuck when the external counter is blocked.',
      repo: 'Open GitHub repository', unit: 'views'
    }
  };

  const STATE = {
    expanded: false,
    mode: 'loading',
    ready: false,
    values: { site: 0, unique: 0, page: 0, github: 0 }
  };

  function lang(){
    const value = (document.documentElement.lang || 'ja').toLowerCase();
    if(value.startsWith('ko')) return 'ko';
    if(value.startsWith('en')) return 'en';
    return 'ja';
  }
  function t(key){ return (LABELS[lang()] || LABELS.ja)[key] || LABELS.en[key] || key; }
  function fmt(value){
    const n = Number(value);
    if(!Number.isFinite(n)) return '0';
    return new Intl.NumberFormat(lang()==='ja' ? 'ja-JP' : lang()==='ko' ? 'ko-KR' : 'en-US').format(Math.max(0, Math.floor(n)));
  }
  function storageKey(key){ return CONFIG.storagePrefix + ':' + key; }
  function storeGet(key){ try { return localStorage.getItem(storageKey(key)); } catch(_) { return null; } }
  function storeSet(key, value){ try { localStorage.setItem(storageKey(key), String(value)); } catch(_) {} }
  function storeNumber(key){
    const n = Number(storeGet(key));
    return Number.isFinite(n) ? n : 0;
  }
  function storeIncrement(key){
    const next = storeNumber(key) + 1;
    storeSet(key, next);
    return next;
  }
  function normalizeCounterName(value){
    return String(value || 'index')
      .replace(/^\/+|\/+$/g,'')
      .replace(/index\.html$/i,'index')
      .replace(/\.html$/i,'')
      .replace(/[^a-zA-Z0-9_-]+/g,'-')
      .replace(/^-+|-+$/g,'')
      .toLowerCase() || 'index';
  }
  function currentPageKey(){
    const path = location.pathname.split('/').pop() || 'index.html';
    const parent = location.pathname.includes('/pages/') ? 'pages-' : '';
    return 'page-' + parent + normalizeCounterName(path);
  }
  function extractCount(data){
    if(typeof data === 'number') return data;
    if(typeof data === 'string' && data.trim() !== '' && !Number.isNaN(Number(data))) return Number(data);
    if(!data || typeof data !== 'object') return NaN;
    for(const key of ['value','count','data','result','total']){
      const value = data[key];
      const parsed = extractCount(value);
      if(Number.isFinite(parsed)) return parsed;
    }
    return NaN;
  }
  function fetchWithTimeout(url){
    const controller = window.AbortController ? new AbortController() : null;
    const timer = controller ? setTimeout(function(){ controller.abort(); }, CONFIG.timeoutMs) : null;
    return fetch(url, {
      cache: 'no-store',
      mode: 'cors',
      credentials: 'omit',
      signal: controller ? controller.signal : undefined
    }).finally(function(){ if(timer) clearTimeout(timer); });
  }
  async function counter(name, action){
    const clean = normalizeCounterName(name);
    const suffix = action === 'up' ? '/up' : '';
    const url = CONFIG.endpoint + '/' + encodeURIComponent(CONFIG.namespace) + '/' + encodeURIComponent(clean) + suffix + '?_=' + Date.now();
    const res = await fetchWithTimeout(url);
    if(!res.ok){
      if(res.status === 404 && action !== 'up') return 0;
      throw new Error('counter api status ' + res.status);
    }
    const json = await res.json();
    const count = extractCount(json);
    return Number.isFinite(count) ? count : 0;
  }
  function getCount(name){ return counter(name, 'get'); }
  function upCount(name){ return counter(name, 'up'); }

  function bumpLocalCounters(){
    const pageKey = currentPageKey();
    const site = storeIncrement('local-site-views');
    const page = storeIncrement('local-' + pageKey);
    if(!storeGet('local-visitor-id')) storeSet('local-visitor-id', Math.random().toString(36).slice(2) + '-' + Date.now());
    const unique = 1;
    const github = storeNumber('local-github-clicks');
    STATE.values = { site, page, unique, github };
    STATE.mode = 'loading';
    STATE.ready = true;
  }

  function injectStyle(){
    if(document.getElementById('lrs-visitor-stats-style')) return;
    const css = `
      .lrs-visitor-stats{position:fixed;right:18px;bottom:18px;z-index:9998;font-family:inherit;color:#0f172a}.lrs-visitor-stats *{box-sizing:border-box}.lrs-visitor-toggle{display:flex;align-items:center;gap:10px;border:1px solid rgba(37,99,235,.22);background:linear-gradient(135deg,rgba(255,255,255,.96),rgba(239,246,255,.94));border-radius:999px;padding:10px 14px;box-shadow:0 18px 48px rgba(15,23,42,.18);cursor:pointer;color:#0f172a;font-weight:950;backdrop-filter:blur(14px)}.lrs-visitor-toggle span{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#2563eb}.lrs-visitor-toggle strong{font-size:15px;min-width:34px;text-align:right}.lrs-visitor-toggle i{width:9px;height:9px;border-radius:50%;background:#f59e0b;box-shadow:0 0 0 6px rgba(245,158,11,.15);display:block}.lrs-visitor-stats[data-mode="global"] .lrs-visitor-toggle i{background:#22c55e;box-shadow:0 0 0 6px rgba(34,197,94,.13)}.lrs-visitor-stats[data-mode="local"] .lrs-visitor-toggle i{background:#f59e0b}.lrs-visitor-panel{position:absolute;right:0;bottom:58px;width:min(370px,calc(100vw - 32px));background:linear-gradient(180deg,#fff,#f7fbff);border:1px solid rgba(148,163,184,.28);border-radius:22px;padding:16px;box-shadow:0 26px 74px rgba(15,23,42,.24)}.lrs-visitor-panel[hidden]{display:none}.lrs-visitor-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}.lrs-visitor-head b{display:block;font-size:17px;color:#0f172a}.lrs-visitor-head small{display:block;margin-top:3px;color:#64748b;font-weight:800;line-height:1.35}.lrs-visitor-close{border:0;background:#eaf2ff;color:#1d4ed8;border-radius:999px;padding:7px 10px;font-weight:900;cursor:pointer}.lrs-visitor-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.lrs-visitor-card{border:1px solid #dbe7f4;background:#fff;border-radius:16px;padding:12px}.lrs-visitor-card span{display:block;color:#64748b;font-size:12px;font-weight:900;line-height:1.25}.lrs-visitor-card strong{display:block;margin-top:5px;font-size:22px;letter-spacing:-.03em;color:#0b1d34}.lrs-visitor-note{margin:12px 0 0;color:#64748b;font-size:12px;line-height:1.5;font-weight:750}.lrs-visitor-actions{display:flex;justify-content:flex-end;margin-top:12px}.lrs-visitor-actions a{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:#0f172a;color:#fff;text-decoration:none;font-size:12px;font-weight:950;padding:9px 12px}.theme-dark .lrs-visitor-panel,.qa-chat-ui .lrs-visitor-panel{background:linear-gradient(180deg,#102035,#071426);border-color:rgba(255,255,255,.16);color:#e8f2ff}.theme-dark .lrs-visitor-head b,.qa-chat-ui .lrs-visitor-head b{color:#fff}.theme-dark .lrs-visitor-head small,.theme-dark .lrs-visitor-note,.qa-chat-ui .lrs-visitor-head small,.qa-chat-ui .lrs-visitor-note{color:#aac0d8}.theme-dark .lrs-visitor-card,.qa-chat-ui .lrs-visitor-card{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.14)}.theme-dark .lrs-visitor-card strong,.qa-chat-ui .lrs-visitor-card strong{color:#fff}.theme-dark .lrs-visitor-card span,.qa-chat-ui .lrs-visitor-card span{color:#aac0d8}@media(max-width:620px){.lrs-visitor-stats{right:12px;bottom:12px}.lrs-visitor-toggle{padding:9px 12px}.lrs-visitor-panel{bottom:54px}.lrs-visitor-grid{grid-template-columns:1fr}}`;
    const style = document.createElement('style');
    style.id = 'lrs-visitor-stats-style';
    style.textContent = css;
    document.head.appendChild(style);
  }
  function ensureUI(){
    if(document.querySelector('[data-lrs-visitor-stats]')) return;
    injectStyle();
    const wrap = document.createElement('aside');
    wrap.className = 'lrs-visitor-stats no-translate';
    wrap.setAttribute('data-lrs-visitor-stats','');
    wrap.setAttribute('data-mode','loading');
    wrap.innerHTML = `
      <button class="lrs-visitor-toggle" type="button" data-lrs-visitor-toggle aria-expanded="false"><i aria-hidden="true"></i><span data-lrs-visitor-chip></span><strong data-lrs-visitor-total>0</strong></button>
      <section class="lrs-visitor-panel" data-lrs-visitor-panel hidden>
        <div class="lrs-visitor-head"><div><b data-lrs-visitor-title></b><small data-lrs-visitor-sub></small></div><button class="lrs-visitor-close" type="button" data-lrs-visitor-close></button></div>
        <div class="lrs-visitor-grid">
          <div class="lrs-visitor-card"><span data-lrs-label="site"></span><strong data-lrs-value="site">0</strong></div>
          <div class="lrs-visitor-card"><span data-lrs-label="unique"></span><strong data-lrs-value="unique">0</strong></div>
          <div class="lrs-visitor-card"><span data-lrs-label="page"></span><strong data-lrs-value="page">0</strong></div>
          <div class="lrs-visitor-card"><span data-lrs-label="github"></span><strong data-lrs-value="github">0</strong></div>
        </div>
        <p class="lrs-visitor-note" data-lrs-visitor-note></p>
        <div class="lrs-visitor-actions"><a href="${CONFIG.repoUrl}" target="_blank" rel="noreferrer" data-lrs-visitor-repo></a></div>
      </section>`;
    document.body.appendChild(wrap);
    wrap.querySelector('[data-lrs-visitor-toggle]').addEventListener('click', function(){ STATE.expanded = !STATE.expanded; render(); });
    wrap.querySelector('[data-lrs-visitor-close]').addEventListener('click', function(){ STATE.expanded = false; render(); });
  }
  function statusText(){
    if(STATE.mode === 'global') return t('global');
    if(STATE.mode === 'local') return t('local');
    return t('loading');
  }
  function render(){
    const wrap = document.querySelector('[data-lrs-visitor-stats]');
    if(!wrap) return;
    wrap.setAttribute('data-mode', STATE.mode);
    const panel = wrap.querySelector('[data-lrs-visitor-panel]');
    const toggle = wrap.querySelector('[data-lrs-visitor-toggle]');
    if(panel) panel.hidden = !STATE.expanded;
    if(toggle) toggle.setAttribute('aria-expanded', String(STATE.expanded));
    const setText = (sel, value) => { const el = wrap.querySelector(sel); if(el) el.textContent = value; };
    setText('[data-lrs-visitor-chip]', t('chip'));
    setText('[data-lrs-visitor-title]', t('title'));
    setText('[data-lrs-visitor-sub]', statusText());
    setText('[data-lrs-visitor-close]', STATE.expanded ? t('close') : t('open'));
    setText('[data-lrs-visitor-note]', t('note'));
    setText('[data-lrs-visitor-repo]', t('repo'));
    setText('[data-lrs-visitor-total]', fmt(STATE.values.site));
    ['site','unique','page','github'].forEach(function(key){
      setText('[data-lrs-label="' + key + '"]', t(key));
      setText('[data-lrs-value="' + key + '"]', fmt(STATE.values[key]));
    });
  }
  async function loadRemoteCounters(){
    const pageKey = currentPageKey();
    try{
      const site = await upCount('site-views');
      const page = await upCount(pageKey);
      let unique;
      if(!storeGet('remote-unique-counted')){
        unique = await upCount('unique-visitors');
        storeSet('remote-unique-counted','1');
      } else {
        unique = await getCount('unique-visitors');
      }
      const github = await getCount('github-clicks').catch(function(){ return STATE.values.github || 0; });
      STATE.values = { site, page, unique, github };
      STATE.mode = 'global';
      STATE.ready = true;
      render();
    } catch(err){
      STATE.mode = 'local';
      render();
      if(window.console) console.warn('[LiteRaceSegNet stats] remote counter unavailable; local fallback is displayed:', err && err.message ? err.message : err);
    }
  }
  function watchGithubLinks(){
    document.addEventListener('click', function(event){
      const link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
      if(!link) return;
      let href = '';
      try{ href = new URL(link.getAttribute('href'), location.href).href; }catch(_){ return; }
      if(!/https?:\/\/github\.com\/jcicaaa3-cloud\/LiteRaceSegNet-FINAL-\/?/i.test(href)) return;
      const localGithub = storeIncrement('local-github-clicks');
      if(STATE.mode !== 'global'){
        STATE.values.github = localGithub;
        render();
      }
      upCount('github-clicks').then(function(value){
        STATE.values.github = value;
        STATE.mode = 'global';
        render();
      }).catch(function(err){
        if(window.console) console.warn('[LiteRaceSegNet stats] github click remote count unavailable; local fallback updated:', err && err.message ? err.message : err);
      });
    }, true);
  }
  function watchLanguage(){
    if(!window.MutationObserver) return;
    const observer = new MutationObserver(render);
    observer.observe(document.documentElement, { attributes:true, attributeFilter:['lang'] });
  }
  function init(){
    ensureUI();
    bumpLocalCounters();
    render();
    loadRemoteCounters();
    watchGithubLinks();
    watchLanguage();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
