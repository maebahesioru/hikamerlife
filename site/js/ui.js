/* =========================================================
   4万分の1のヒカマー — UI
   ========================================================= */
window.HK = window.HK || {};

(function () {
  "use strict";
  const D = () => HK.DATA;
  const $ = id => document.getElementById(id);
  const fmt = n => n.toLocaleString("ja-JP");

  /* ---------- 永続化 ---------- */
  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  };
  const MEMORIAL_KEY = "hk4m.memorial.v1";
  const ZUKAN_KEY = "hk4m.zukan.v1";
  const TITLES_KEY = "hk4m.titles.v1";
  const OPTS_KEY = "hk4m.opts.v1";

  let S = null;           // 現在の人生
  let timer = null;
  let speed = LS.get(OPTS_KEY, { speed: 2 }).speed || 2;
  let auto = LS.get(OPTS_KEY, { auto: false }).auto || false;
  let waitedAt = 0;

  /* ---------- 起動時のカウンター ---------- */
  function bindLiveCounters() {
    const t0 = Date.now();
    const births0 = Math.floor(Math.random() * 3);
    const postsBase = 8123456789 + Math.floor(Math.random() * 10000000);
    function upd() {
      const el = (Date.now() - t0) / 1000;
      const births = births0 + Math.floor(el * (1 / 46) * 10) / 10;
      $("liveBirths").textContent = births.toFixed(1);
      $("livePosts").textContent = fmt(Math.floor(postsBase + el * D().meta.xPostsPerSec));
      requestAnimationFrame(() => setTimeout(upd, 500));
    }
    upd();
  }

  /* ---------- 画面切替 ---------- */
  function show(name) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("on"));
    $("screen-" + name).classList.add("on");
    window.scrollTo(0, 0);
  }

  /* ---------- 開始 ---------- */
  function bindStart() {
    $("btnStart").addEventListener("click", () => {
      const name = $("inpName").value.trim();
      const handle = $("inpHandle").value.trim();
      const sexSel = $("selSex").value;
      const bySel = $("selBirthYear").value;
      const opts = {};
      const clean = s => s.replace(/[<>&"'`]/g, "").slice(0, 24);
      if (name) opts.name = clean(name);
      if (handle) opts.handle = clean(handle).replace(/\s+/g, "_");
      if (sexSel !== "random") opts.sex = sexSel;
      if (bySel !== "random") opts.birthYear = parseInt(bySel, 10);
      startGame(opts);
    });
    // 生年セレクト埋め
    const sel = $("selBirthYear");
    for (let y = 2005; y <= 2014; y++) {
      const o = document.createElement("option");
      o.value = y; o.textContent = y + "年生まれ";
      sel.appendChild(o);
    }
  }

  function startGame(opts) {
    S = HK.engine.newGame(opts);
    window.__S = S; // デバッグ用
    $("lifeTitleSub").textContent = `第${(LS.get("hk4m.playcount", 0) + 1)}回の人生`;
    LS.set("hk4m.playcount", LS.get("hk4m.playcount", 0) + 1);
    renderAll();
    show("life");
    schedule(400);
  }

  /* ---------- タイマー ---------- */
  function speedMs() { return { 1: 1500, 2: 750, 4: 380, 8: 190 }[speed] || 750; }
  function schedule(ms) {
    clearTimeout(timer);
    if (!S || S.dead) return;
    timer = setTimeout(tick, ms != null ? ms : speedMs());
  }

  function tick() {
    if (!S || S.dead) return;
    const r = HK.engine.step(S);
    renderAll();
    if (r.status === "dead") { setTimeout(showDeath, 900); return; }
    if (r.status === "waiting") { showPending(); return; }
    if (S.pending) { showPending(); return; }
    schedule();
  }

  function showPending() {
    const p = S.pending;
    if (!p) return;
    if (p.kind === "decision") {
      const d = HK.DECISIONS.find(x => x.id === p.id);
      const t = HK.engine.renderText;
      $("modalPrompt").textContent = t(d.prompt, S);
      const wrap = $("modalChoices");
      wrap.innerHTML = "";
      d.choices.forEach((c, i) => {
        const b = document.createElement("button");
        b.className = "choice";
        b.textContent = c.label;
        b.onclick = () => { HK.engine.resolve(S, i); toast(c.fx && c.fx.join ? "あなたはヒカマーになった。" : "", "hk"); renderAll(); hideModal(); schedule(speedMs() * 0.6); };
        wrap.appendChild(b);
      });
      if (auto) {
        waitAuto(() => {
          const idx = autoChoice(d);
          HK.engine.resolve(S, idx);
          renderAll(); hideModal(); schedule(speedMs() * 0.6);
        });
      } else { hideAuto(); }
      showModal("決断");
    } else if (p.kind === "breather") {
      $("modalPrompt").textContent = p.q;
      const wrap = $("modalChoices");
      wrap.innerHTML = "";
      const ta = document.createElement("textarea");
      ta.id = "breatherNote"; ta.rows = 3; ta.placeholder = "（任意）ひとこと残す";
      wrap.appendChild(ta);
      const b = document.createElement("button");
      b.className = "choice"; b.textContent = "先へ進む";
      b.onclick = () => { const v = ta.value.trim(); if (v) S.notes.push({ age: S.age, text: v }); HK.engine.resolve(S, 0); renderAll(); hideModal(); schedule(speedMs() * 0.6); };
      wrap.appendChild(b);
      if (auto) waitAuto(() => { HK.engine.resolve(S, 0); renderAll(); hideModal(); schedule(speedMs() * 0.6); });
      else hideAuto();
      showModal("ひと息");
    } else if (p.kind === "revive") {
      $("modalPrompt").textContent = "アカウントを失った。あなたはどうする？";
      const wrap = $("modalChoices");
      wrap.innerHTML = "";
      [["転生する（新しい名前で戻る）", 0], ["界隈を去る（引退）", 1]].forEach(([label, i]) => {
        const b = document.createElement("button");
        b.className = "choice"; b.textContent = label;
        b.onclick = () => { HK.engine.resolve(S, i); renderAll(); hideModal(); schedule(speedMs() * 0.6); };
        wrap.appendChild(b);
      });
      if (auto) {
        waitAuto(() => {
          const idx = Math.random() < 0.75 ? 0 : 1;
          HK.engine.resolve(S, idx);
          renderAll(); hideModal(); schedule(speedMs() * 0.6);
        });
      } else { hideAuto(); }
      showModal("凍結");
    }
  }

  function autoChoice(d) {
    // おまかせ: 前向きな選択をやや多めに選ぶ（参加・投稿・制作を好む）
    const w = d.choices.map(c => {
      const f = c.fx || {};
      let s = 1;
      if (f.join) s += 3;
      if (f.fame) s += Math.min(2, f.fame / 400);
      if (f.skill) s += f.skill / 20;
      if (f.goroku) s += f.goroku / 25;
      if (f.nareai) s += f.nareai / 20;
      s -= (f.banRisk || 0) / 15;
      s -= (f.fameRisk || 0) / 25;
      return Math.max(0.1, s);
    });
    const sum = w.reduce((a, b) => a + b, 0);
    let r = Math.random() * sum;
    for (let i = 0; i < w.length; i++) { r -= w[i]; if (r <= 0) return i; }
    return 0;
  }

  let autoTimer = null;
  function waitAuto(fn) { clearTimeout(autoTimer); autoTimer = setTimeout(fn, 1400); }
  function hideAuto() { clearTimeout(autoTimer); }

  function showModal(label) { $("modalTag").textContent = label; $("modal").classList.add("on"); }
  function hideModal() { $("modal").classList.remove("on"); }

  /* ---------- レンダリング ---------- */
  function formatInv(v) {
    if (v <= 1) return "1";
    if (v < 10) return (Math.round(v * 100) / 100).toString();
    if (v < 100) return (Math.round(v * 10) / 10).toString();
    return Math.round(v).toLocaleString();
  }

  function renderAll() {
    if (!S) return;
    renderHeader();
    renderStats();
    renderLog();
    renderCompanions();
    renderMap();
    renderSurvival();
    renderHkPanel();
  }

  function renderHeader() {
    $("lifeAge").textContent = S.age + "歳";
    $("lifeYear").textContent = S.year + "年";
    $("lifeHandle").textContent = S.handle;
  }

  function bar(k, label, v, cls) {
    return `<div class="statrow"><span class="k">${label}</span>
      <span class="bar"><i class="${cls || ""}" style="width:${Math.round(v)}%"></i></span>
      <span class="v">${Math.round(v)}</span></div>`;
  }

  function renderStats() {
    const s = S.stats;
    let h = "";
    h += bar("hp", "健康", s.hp);
    h += bar("happy", "幸福", s.happy);
    h += bar("know", "知識", s.know);
    h += bar("rel", "人間関係", s.rel);
    h += bar("mental", "メンタル", s.mental, "m");
    $("statList").innerHTML = h;
    $("statMoney").textContent = "¥" + fmt(Math.round(S.money));
  }

  function renderHkPanel() {
    const hk = S.hk;
    const el = $("hkPanel");
    if (!hk.joined) {
      el.innerHTML = `<div class="dim small">まだネットの海の外にいる。${S.age >= 10 ? "何かの拍子で、扉が開くかもしれない。" : ""}</div>`;
      return;
    }
    const fm = (v) => v >= 10000 ? (v / 10000).toFixed(1) + "万" : fmt(v);
    el.innerHTML = `
      <div class="statrow"><span class="k">フォロワー</span><span class="bigv">${fm(hk.followers)}</span></div>
      <div class="statrow"><span class="k">語録力</span><span class="bar"><i class="g" style="width:${hk.goroku}%"></i></span><span class="v">${hk.goroku}</span></div>
      <div class="statrow"><span class="k">技量</span><span class="bar"><i class="g" style="width:${hk.skill}%"></i></span><span class="v">${hk.skill}</span></div>
      <div class="statrow"><span class="k">特定リスク</span><span class="bar"><i class="r" style="width:${hk.fameRisk}%"></i></span><span class="v">${hk.fameRisk}</span></div>
      <div class="statrow"><span class="k">凍結リスク</span><span class="bar"><i class="r" style="width:${hk.banRisk}%"></i></span><span class="v">${hk.banRisk}</span></div>
      <div class="dim small">${hk.retired ? "いまは引退中。" : ""} ${hk.freezes ? "凍結" + hk.freezes + "回。" : ""} ${S.flags.includes("doxxed") ? "（特定済み）" : ""}</div>`;
  }

  function renderLog() {
    const box = $("logBox");
    const near = box.scrollHeight - box.scrollTop - box.clientHeight < 120;
    box.innerHTML = S.log.map(l => {
      const t = l.text.length > 400 ? l.text : l.text;
      return `<div class="logline k-${l.kind}"><span class="ly">${l.age}歳</span>${esc(t)}</div>`;
    }).join("");
    if (near) box.scrollTop = box.scrollHeight;
  }
  const esc = s => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function renderCompanions() {
    const el = $("compBox");
    if (!S.companions.length) { el.innerHTML = ""; return; }
    el.innerHTML = S.companions.map(c => {
      const st = !S.hk.joined ? "—" : (c.stage >= c.lines.length ? "消息わずか" : "活動中");
      return `<div class="comp"><b>${esc(c.name)}</b><span class="dim">${st}</span></div>`;
    }).join("");
  }

  function renderMap() {
    const el = $("mapBox");
    const cells = S.years.map(y => {
      const cls = y.happy >= 66 ? "m3" : y.happy >= 44 ? "m2" : y.happy >= 25 ? "m1" : "m0";
      return `<i class="${cls}" title="${y.age}歳"></i>`;
    }).join("");
    el.innerHTML = `<div class="mapgrid">${cells || "<span class='dim small'>—</span>"}</div><div class="dim small">1マス=1年（色=幸福）</div>`;
  }

  function renderSurvival() {
    const el = $("survBox");
    if (!S.hk.joined) { el.innerHTML = `<div class="dim small">ヒカマーになると、ここに「アカウント生存曲線」が出る。界隈の平均寿命は2〜3年と言われている。</div>`; return; }
    const n = Math.max(0, S.age - S.hk.joinAge);
    const W = 260, H = 90;
    let you = "", cohort = "";
    const maxN = Math.max(n, 6);
    const pts = [];
    const ypts = [];
    for (let i = 0; i <= maxN; i++) {
      const x = 8 + (W - 16) * i / (maxN || 1);
      const p = Math.exp(-i / 2.5);
      pts.push(`${x.toFixed(1)},${(H - 12 - (H - 24) * p).toFixed(1)}`);
      const alive = S.cohort.filter(l => l > i).length / S.cohort.length;
      // 実コホートは stage 情報が無いので指数モデルを表示（注記あり）
      ypts.push(`${x.toFixed(1)},${(H - 12 - (H - 24) * alive).toFixed(1)}`);
    }
    cohort = `<polyline points="${pts.join(" ")}" class="surv-line" />`;
    const xYou = 8 + (W - 16) * n / (maxN || 1);
    const youDot = `<circle cx="${xYou.toFixed(1)}" cy="${(H - 12 - (H - 24) * (S.hk.retired ? 0.15 : 1)).toFixed(1)}" r="3.5" class="surv-you" />`;
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="surv">${cohort}${youDot}</svg>
      <div class="dim small">モデル: 活動継続率=e^(−年数/2.5)（界隈の平均寿命2〜3年の実測感覚を近似）。●があなた。</div>`;
  }

  function toast(text, kind) {
    if (!text) return;
    const box = $("toasts");
    const el = document.createElement("div");
    el.className = "toast " + (kind || "");
    el.textContent = text;
    box.appendChild(el);
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 300); }, 2600);
  }

  /* ---------- 死亡画面 ---------- */
  function showDeath() {
    if (!S || !S.title) return;
    const t = S.title;
    $("deathTitle").textContent = t.name;
    $("deathRank").textContent = t.rank;
    $("deathRank").className = "rank r-" + t.rank;
    $("deathDesc").textContent = t.desc;
    $("deathLife").textContent = `${S.name}／${S.handle} ・ ${S.birthYear}–${S.year}（${S.age}歳）`;
    $("deathCause").textContent = S.deathCause;
    // 統計
    const yearsActive = S.hk.joined ? Math.max(0, S.age - S.hk.joinAge) : 0;
    $("deathStats").innerHTML = `
      <div class="dstat"><span>最高フォロワー</span><b>${fmt(S.hk.peakFollowers)}</b></div>
      <div class="dstat"><span>参入からの年数</span><b>${S.hk.joined ? yearsActive + "年（" + S.hk.joinAge + "歳で参入）" : "—（ならなかった）"}</b></div>
      <div class="dstat"><span>凍結</span><b>${S.hk.freezes}回</b></div>
      <div class="dstat"><span>特定</span><b>${S.flags.includes("doxxed") ? "された" : "されなかった"}</b></div>
      <div class="dstat"><span>引退宣言</span><b>${S.hk.retireCount}回</b></div>
      <div class="dstat"><span>語録力 / 技量</span><b>${S.hk.goroku} / ${S.hk.skill}</b></div>`;
    // 確率チェーン
    const pc = S.prob;
    $("deathChain").innerHTML = pc.chain.map(c =>
      `<div class="chainrow"><span>${c.label}</span><b>1 / ${formatInv(c.inv)}</b></div>`
    ).join("") + `<div class="chainrow total"><span>この人生の希少度（モデル計算）</span><b>約 1 / ${Math.round(1 / pc.product).toLocaleString()}</b></div>`;
    // 心に残る行
    const memorable = S.log.filter(l => ["hk", "decision", "doxx", "comp", "revive", "debut"].includes(l.kind));
    const pick3 = [];
    for (let i = 0; i < 3 && memorable.length; i++) {
      pick3.push(memorable.splice(Math.floor(Math.random() * memorable.length), 1)[0]);
    }
    $("deathMoments").innerHTML = pick3.map(l => `<div class="moment">「${esc(l.text.slice(0, 120))}」<span class="dim">— ${l.age}歳</span></div>`).join("");
    // 図鑑・称号の保存
    const z = LS.get(ZUKAN_KEY, {});
    Object.assign(z, S._zukan || {});
    LS.set(ZUKAN_KEY, z);
    const tt = LS.get(TITLES_KEY, {});
    tt[t.id] = true;
    LS.set(TITLES_KEY, tt);
    renderCard();
    show("death");
  }

  /* ---------- 共有カード ---------- */
  function renderCard() {
    const cv = $("cardCanvas");
    const ctx = cv.getContext("2d");
    const W = 1080, H = 1350;
    ctx.fillStyle = "#0b0f14"; ctx.fillRect(0, 0, W, H);
    // 枠
    ctx.strokeStyle = "#233040"; ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, W - 80, H - 80);
    ctx.fillStyle = "#ff8a3d";
    ctx.font = "700 40px 'Noto Sans JP', sans-serif";
    ctx.fillText("4万分の1のヒカマー", 90, 150);
    ctx.fillStyle = "#7d8ea3";
    ctx.font = "24px 'Noto Sans JP', sans-serif";
    ctx.fillText("— ひとつの人生の記録 —", 90, 192);
    // 名前
    ctx.fillStyle = "#e8eef5";
    ctx.font = "700 64px 'Noto Sans JP', sans-serif";
    wrapText(ctx, S.handle, 90, 300, W - 180, 70);
    ctx.font = "30px 'Noto Sans JP', sans-serif";
    ctx.fillStyle = "#9fb0c3";
    ctx.fillText(`${S.name} ・ ${S.birthYear}–${S.year}（${S.age}歳）`, 90, 380);
    // 称号
    ctx.fillStyle = "#141b24";
    roundRect(ctx, 80, 420, W - 160, 150, 16); ctx.fill();
    ctx.fillStyle = "#ffb877";
    ctx.font = "700 58px 'Noto Sans JP', sans-serif";
    ctx.fillText(`【${S.title.rank}】${S.title.name}`, 110, 500);
    ctx.fillStyle = "#9fb0c3";
    ctx.font = "26px 'Noto Sans JP', sans-serif";
    wrapText(ctx, S.title.desc, 110, 545, W - 220, 34, 2);
    // 統計
    ctx.fillStyle = "#e8eef5";
    ctx.font = "30px 'Noto Sans JP', sans-serif";
    const rows = [
      ["最高フォロワー", fmt(S.hk.peakFollowers)],
      ["参入からの年数", S.hk.joined ? (S.age - S.hk.joinAge) + "年（" + S.hk.joinAge + "歳参入）" : "ならなかった"],
      ["凍結 / 特定", S.hk.freezes + "回 / " + (S.flags.includes("doxxed") ? "あり" : "なし")],
      ["語録力 / 技量", S.hk.goroku + " / " + S.hk.skill],
      ["死因", (S.deathCause || "").slice(0, 32)]
    ];
    let y = 660;
    rows.forEach(([k, v]) => {
      ctx.fillStyle = "#7d8ea3"; ctx.font = "28px 'Noto Sans JP', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(k, 90, y);
      ctx.fillStyle = "#e8eef5"; ctx.font = "700 30px 'Noto Sans JP', sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(v, W - 90, y);
      ctx.textAlign = "left";
      y += 58;
    });
    // 心に残る一行
    const memorable = S.log.filter(l => ["decision", "hk", "doxx", "debut"].includes(l.kind));
    if (memorable.length) {
      const line = memorable[S.rng ? Math.floor((S.seed % memorable.length)) : 0] || memorable[0];
      y += 24;
      ctx.fillStyle = "#7d8ea3"; ctx.font = "24px 'Noto Sans JP', sans-serif";
      ctx.fillText("心に残る一行", 90, y); y += 42;
      ctx.fillStyle = "#c9d6e4"; ctx.font = "italic 26px 'Noto Sans JP', sans-serif";
      wrapText(ctx, "「" + line.text.slice(0, 90) + "」", 90, y, W - 180, 36, 2);
      y += 42;
    }
    // 確率
    y += 20;
    ctx.fillStyle = "#7d8ea3"; ctx.font = "24px 'Noto Sans JP', sans-serif";
    ctx.fillText("この人生の希少度（モデル計算）", 90, y); y += 46;
    ctx.fillStyle = "#7ee787"; ctx.font = "700 44px 'Noto Sans JP', sans-serif";
    ctx.fillText(`約 1 / ${Math.round(1 / S.prob.product).toLocaleString()}`, 90, y + 10);
    // フッタ
    ctx.fillStyle = "#54657a"; ctx.font = "20px 'Noto Sans JP', sans-serif";
    ctx.fillText("出典: ヒカマーWiki・Hikabooru・810ch・ヒカマーズ8values ほか（詳細はサイトの「しくみ」へ）", 90, H - 110);
    ctx.fillText("この人生はフィクションです。", 90, H - 75);
  }

  function wrapText(ctx, text, x, y, maxW, lineH, maxLines) {
    const chars = text.split("");
    let line = "", lines = [];
    for (const ch of chars) {
      if (ctx.measureText(line + ch).width > maxW) { lines.push(line); line = ch; }
      else line += ch;
    }
    if (line) lines.push(line);
    lines.slice(0, maxLines || 99).forEach((l, i) => ctx.fillText(l, x, y + i * lineH));
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function bindDeath() {
    $("btnDownload").addEventListener("click", () => {
      const a = document.createElement("a");
      a.download = `4manbun_${S.handle}_${S.year}.png`;
      a.href = $("cardCanvas").toDataURL("image/png");
      a.click();
    });
    $("btnMemorial").addEventListener("click", () => { saveMemorial(); showMemorial(); });
    $("btnAgain").addEventListener("click", () => { S = null; show("start"); });
  }

  /* ---------- メモリアル ---------- */
  function saveMemorial() {
    const list = LS.get(MEMORIAL_KEY, []);
    list.unshift({
      id: Date.now(),
      name: S.name, handle: S.handle, sex: S.sex,
      birthYear: S.birthYear, year: S.year, age: S.age,
      title: S.title.name, rank: S.title.rank, desc: S.title.desc,
      cause: S.deathCause, peak: S.hk.peakFollowers,
      rare: Math.round(1 / S.prob.product),
      candles: 0, ts: new Date().toISOString()
    });
    LS.set(MEMORIAL_KEY, list.slice(0, 10));
    toast("メモリアルに納めた。", "hk");
  }

  function showMemorial() {
    const list = LS.get(MEMORIAL_KEY, []);
    $("memList").innerHTML = list.length ? list.map(m => `
      <div class="memcard">
        <div class="memhead"><span class="rank r-${m.rank} small">${m.rank}</span><b>${esc(m.handle)}</b></div>
        <div class="dim">${esc(m.name)} ・ ${m.birthYear}–${m.year}（${m.age}歳）</div>
        <div class="memtitle">${esc(m.title)}</div>
        <div class="dim small">${esc(m.desc)}</div>
        <div class="membottom">
          <span class="dim small">希少度 約1/${fmt(m.rare)}</span>
          <button class="candle" data-id="${m.id}">🕯 ${m.candles}</button>
        </div>
      </div>`).join("") : `<div class="dim">まだ、ここに人生はない。</div>`;
    document.querySelectorAll(".candle").forEach(b => {
      b.onclick = () => {
        const list = LS.get(MEMORIAL_KEY, []);
        const m = list.find(x => x.id == b.dataset.id);
        if (m) { m.candles++; LS.set(MEMORIAL_KEY, list); b.textContent = "🕯 " + m.candles; }
      };
    });
    show("memorial");
  }

  /* ---------- 図鑑 ---------- */
  function showZukan() {
    const z = LS.get(ZUKAN_KEY, {});
    const cats = {};
    D().zukan.forEach(e => { (cats[e.cat] = cats[e.cat] || []).push(e); });
    let html = "";
    Object.keys(cats).forEach(cat => {
      html += `<h3 class="zcat">${cat}</h3><div class="zgrid">`;
      cats[cat].forEach(e => {
        const on = !!z[e.id];
        html += `<div class="zitem ${on ? "on" : ""}"><b>${on ? esc(e.name) : "???"}</b><p>${on ? esc(e.desc) : "まだ出会っていない。"}</p></div>`;
      });
      html += `</div>`;
    });
    const total = D().zukan.length, got = D().zukan.filter(e => z[e.id]).length;
    $("zukanBody").innerHTML = `<div class="dim small">解放 ${got} / ${total}（人生を重ねるほど増える。この端末に保存される）</div>` + html;
    // 称号
    const tt = LS.get(TITLES_KEY, {});
    $("titlesBody").innerHTML = D().titles.map(t => tt[t.id]
      ? `<div class="zitem on"><b>【${t.rank}】${esc(t.name)}</b><p>${esc(t.desc)}</p></div>`
      : `<div class="zitem"><b>???</b><p>まだ到達していない。</p></div>`).join("");
    show("zukan");
  }

  function bindNav() {
    document.querySelectorAll("[data-nav]").forEach(b => {
      b.addEventListener("click", () => {
        const n = b.dataset.nav;
        if (n === "memorial") { showMemorial(); return; }
        if (n === "zukan") { showZukan(); return; }
        if (n === "about") { show("about"); return; }
        if (n === "start") { show("start"); return; }
      });
    });
    $("btnQuit").addEventListener("click", () => { if (confirm("この人生を中断しますか？（記録は残りません）")) { S = null; clearTimeout(timer); show("start"); } });
  }

  /* ---------- 速度・おまかせ ---------- */
  function bindControls() {
    document.querySelectorAll(".spd").forEach(b => {
      b.addEventListener("click", () => {
        speed = parseInt(b.dataset.s, 10);
        LS.set(OPTS_KEY, { speed, auto });
        document.querySelectorAll(".spd").forEach(x => x.classList.remove("on"));
        b.classList.add("on");
      });
      if (parseInt(b.dataset.s, 10) === speed) b.classList.add("on");
    });
    $("tglAuto").addEventListener("click", () => {
      auto = !auto;
      LS.set(OPTS_KEY, { speed, auto });
      $("tglAuto").classList.toggle("on", auto);
      $("tglAuto").textContent = auto ? "おまかせ: ON" : "おまかせ: OFF";
      if (auto && S && S.pending) showPending();
    });
    $("tglAuto").classList.toggle("on", auto);
    $("tglAuto").textContent = auto ? "おまかせ: ON" : "おまかせ: OFF";
  }

  /* ---------- しくみ画面の実データ埋め込み ---------- */
  function fillAbout() {
    const m = D().meta;
    $("helplineBox").innerHTML = `<b>つらいとき</b><br>${esc(D().helpline)}<br><span class="dim small">このゲームの出来事はフィクションですが、現実のつらさは本物です。</span>`;
    $("aboutData").innerHTML = `
      <li>日本の人口 約${(m.japanPop / 1e8).toFixed(2)}億人 ÷ 界隈の活動人口 数百〜数千人（Wiki Handbooks）→ <b>${m.allHuman}</b> という逆算</li>
      <li>ヒカマーWiki: 記事${m.wikiArticles}・利用者187（2026-08実測）／名簿「ヒカマー一覧」約${fmt(m.hikamerRegistry)}件</li>
      <li>Hikabooru（画像素材庫）: 投稿${fmt(m.booruPosts)}件・タグ${fmt(m.booruTags)}件（実測）</li>
      <li>ニコニコ動画「Hikakin_mania」タグ ${fmt(m.nicoHikamani)}本・「ヒカマニ外伝リンク」${fmt(m.nicoGaiden)}本</li>
      <li>ヒカマーズ8values 診断回答 ${m.f8values}件（実測・最多タイプ「反開發主義」）</li>
      <li>界隈の平均寿命 2〜3年・入れ替わりの激しさ（Wiki・当事者資料）</li>
      <li>2017年 Hikakin Mania チャンネル開設 → 2019年 ニコチンTVのヒカ淫投稿で「ヒカマー」誕生 → 2026年 ONICHA騒動・五・一六デモ・ザビャン戦争まで</li>`;
  }

  /* ---------- init ---------- */
  function init() {
    bindStart();
    bindDeath();
    bindNav();
    bindControls();
    bindLiveCounters();
    fillAbout();
    show("start");
  }
  document.addEventListener("DOMContentLoaded", init);
})();
