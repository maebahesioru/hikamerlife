/* =========================================================
   2万分の1のヒカマー v3 — UI（日単位・時代くじ・引退エンド）
   ========================================================= */
window.HK = window.HK || {};

(function () {
  "use strict";
  const D = () => HK.DATA2;
  const $ = id => document.getElementById(id);
  const fmt = n => Math.round(n).toLocaleString("ja-JP");

  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } },
    remove(k) { try { localStorage.removeItem(k); } catch (e) { } }
  };
  const MEM_KEY = "hk4m2.memorial";
  const ZUK_KEY = "hk4m2.zukan";
  const TIT_KEY = "hk4m2.titles";
  const OPT_KEY = "hk4m2.opts";
  const SAVE_KEY = "hk4m2.save";
  const MEM_API = (location.hostname === "127.0.0.1" || location.hostname === "localhost") ? "https://hikamerlife.hikamers.app/api" : "/api";
  let memTab = "local";
  const litSet = () => LS.get("hk4m2.lit", []);
  const markLit = id => { const s = litSet(); if (!s.includes(id)) { s.push(id); LS.set("hk4m2.lit", s.slice(-500)); } };
  const pubHash = r => `${r.handle}|${r.days}|${r.era}|${r.title}`;
  const pubSet = () => LS.get("hk4m2.pub", []);

  let S = null;
  let timer = null;
  let paused = false;
  let pendingLife = false;
  let currentShownRecord = null;
  let speed = LS.get(OPT_KEY, { speed: 2 }).speed || 2;
  let auto = LS.get(OPT_KEY, { auto: false }).auto || false;

  /* ---------- カウンター ---------- */
  function bindLive() {
    const t0 = Date.now();
    const births0 = Math.floor(Math.random() * 3);
    const posts0 = 8123456789 + Math.floor(Math.random() * 9999999);
    function upd() {
      const el = (Date.now() - t0) / 1000;
      $("liveBirths").textContent = (births0 + el / 46).toFixed(1);
      $("livePosts").textContent = fmt(posts0 + el * D().meta.xPostsPerSec);
      requestAnimationFrame(() => setTimeout(upd, 500));
    }
    upd();
  }

  /* ---------- 画面 ---------- */
  function show(name) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("on"));
    $("screen-" + name).classList.add("on");
    if (name === "start") refreshResumeBtn();
    window.scrollTo(0, 0);
  }

  function bindStart() {
    const eraSel = $("selEra");
    D().eras.forEach(e => {
      const o = document.createElement("option");
      o.value = e.year; o.textContent = `${e.year}年（${e.name}）`;
      eraSel.appendChild(o);
    });
    const ageSel = $("selAge");
    for (let a = 10; a <= 32; a++) {
      const o = document.createElement("option");
      o.value = a; o.textContent = a + "歳";
      ageSel.appendChild(o);
    }
    const realEraSel = $("selRealEra");
    for (let y = 2008; y <= 2026; y++) {
      const o = document.createElement("option");
      o.value = y; o.textContent = y + "年";
      realEraSel.appendChild(o);
    }
    const realAgeSel = $("selRealAge");
    for (let a = 8; a <= 45; a++) {
      const o = document.createElement("option");
      o.value = a; o.textContent = a + "歳";
      realAgeSel.appendChild(o);
    }
    const pathSel = $("selPath");
    D().paths.forEach(p => {
      const o = document.createElement("option");
      o.value = p.id; o.textContent = `${p.label}（${p.desc.slice(0, 24)}…）`;
      pathSel.appendChild(o);
    });
    const triggerSel = $("selTrigger");
    D().triggers.forEach(t => {
      const o = document.createElement("option");
      o.value = t.id; o.textContent = t.label;
      triggerSel.appendChild(o);
    });
    $("btnStart").addEventListener("click", () => {
      if (hasSave()) {
        const d = LS.get(SAVE_KEY, null);
        const info = d && d.st ? `（@${d.st.handle}・Day ${d.st.dayNum}）` : "";
        if (!confirm(`保存中の界隈歴${info}があります。新しく始めると上書きされます。新しく始めますか？`)) return;
        LS.remove(SAVE_KEY);
        refreshResumeBtn();
      }
      const clean = s => (s || "").replace(/[<>&"'`]/g, "").slice(0, 24);
      const opts = {};
      if ($("inpName").value.trim()) opts.name = clean($("inpName").value.trim());
      if ($("inpHandle").value.trim()) opts.handle = clean($("inpHandle").value.trim()).replace(/\s+/g, "_");
      if ($("selSex").value !== "random") opts.sex = $("selSex").value;
      if (eraSel.value !== "random") opts.era = parseInt(eraSel.value, 10);
      if (ageSel.value !== "random") opts.age = parseInt(ageSel.value, 10);
      if (realEraSel.value !== "none") opts.realEra = parseInt(realEraSel.value, 10);
      if (realAgeSel.value !== "none") opts.realAge = parseInt(realAgeSel.value, 10);
      if (pathSel.value !== "random") opts.path = pathSel.value;
      if (triggerSel.value !== "random") opts.trigger = triggerSel.value;
      const btn = $("btnStart");
      btn.disabled = true;
      btn.textContent = "くじを引いています…";
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = "くじを引いて参入する";
        startGame(opts);
      }, 900);
    });
    $("btnResume").addEventListener("click", resumeGame);
    $("btnEnterLife").addEventListener("click", () => {
      if (!S) return;
      pendingLife = false;
      $("lifeTitleSub").textContent = `第${S.playNo || 1}回の界隈歴`;
      renderAll();
      show("life");
      schedule(300);
    });
  }

  function startGame(opts) {
    S = HK.engine2.newGame(opts);
    window.__S = S;
    S.playNo = LS.get("hk4m2.plays", 0) + 1;
    LS.set("hk4m2.plays", S.playNo);
    hideModal();
    pendingLife = true;
    fillCertScreen();
    show("cert");
  }

  /* ---------- 参入証セレモニー ---------- */
  function fillCertScreen() {
    const p = D().paths.find(x => x.id === S.pathId) || { label: "—" };
    const t = D().triggers.find(x => x.id === S.triggerId) || { label: "—" };
    $("certScreenNo").textContent = `No. ${S.era.year}-${String(S.seed % 1000000).padStart(6, "0")}`;
    $("certScreenHandle").textContent = S.handle;
    $("certScreenName").textContent = `（${S.name}）`;
    const q = S.qualities;
    const dotRow = (label, v) => {
      const n = Math.max(0, Math.min(5, Math.round(v / 20)));
      let d = "";
      for (let i = 0; i < 5; i++) d += `<i class="${i < n ? "on" : ""}"></i>`;
      return `<div class="certrow"><span>${label}</span><b class="dots">${d}</b></div>`;
    };
    $("certScreenFields").innerHTML =
      `<div class="certrow"><span>参入</span><b>${S.era.year}年（${esc(S.era.name)}）・${S.startAge}歳</b></div>` +
      `<div class="certrow"><span>経緯</span><b>${esc(p.label)}</b></div>` +
      `<div class="certrow"><span>きっかけ</span><b>${esc(t.label)}</b></div>` +
      `<div class="certrow"><span>出身</span><b>${esc(S.pref)}</b></div>` +
      `<div class="certrow"><span>家</span><b>${esc(S.family.label)}</b></div>` +
      `<div class="certrow"><span>ネット環境</span><b>${esc(S.net.label)}</b></div>` +
      dotRow("画力", q.draw) + dotRow("音感", q.beat) + dotRow("文才", q.word) +
      dotRow("社交", q.social) + dotRow("根性", q.grit) + dotRow("運", q.luck);
    $("certScreenStory").textContent = S.log[0] ? S.log[0].text : "";
  }

  /* ---------- 途中保存 / つづきから ---------- */
  function saveLife() {
    if (!S || S.ended) return;
    const st = Object.assign({}, S);
    delete st.rng;
    LS.set(SAVE_KEY, { v: 3, at: Date.now(), st, rng: S.rng ? S.rng._a : null });
  }
  function loadLife() {
    const d = LS.get(SAVE_KEY, null);
    if (!d || d.v !== 3 || !d.st || d.st.ended || !(d.st.dayNum >= 1)) return null;
    try {
      const st = d.st;
      st.rng = new HK.engine2.RNG(d.rng != null ? d.rng : st.seed);
      st.startDate = new Date(st.startDate);
      st.date = new Date(st.date);
      return st;
    } catch (e) { return null; }
  }
  function hasSave() { return !!loadLife(); }
  function refreshResumeBtn() {
    const b = $("btnResume");
    if (!b) return;
    const d = LS.get(SAVE_KEY, null);
    if (hasSave()) {
      b.style.display = "";
      b.textContent = `つづきから（@${d.st.handle}・Day ${d.st.dayNum}・${d.st.era ? d.st.era.year + "年" : ""}）`;
    } else b.style.display = "none";
  }
  function resumeGame() {
    const st = loadLife();
    if (!st) { toast("保存された界隈歴を開けなかった"); LS.remove(SAVE_KEY); refreshResumeBtn(); return; }
    S = st; window.__S = S;
    $("lifeTitleSub").textContent = `第${S.playNo || 1}回の界隈歴（つづき）`;
    hideModal();
    renderAll();
    show("life");
    if (S.pending) showPending(); else schedule(300);
  }

  /* ---------- ループ ---------- */
  function speedMs() { return { 1: 800, 2: 400, 4: 200, 8: 100 }[speed] || 400; }
  function schedule(ms) {
    clearTimeout(timer);
    if (!S || S.ended || paused) return;
    timer = setTimeout(tick, ms != null ? ms : speedMs());
  }

  function tick() {
    if (!S || S.ended) return;
    const r = HK.engine2.step(S);
    renderAll();
    if (S.dayNum % 10 === 0) saveLife();
    if (r.status === "ended" || S.ended) { setTimeout(showEnding, 800); return; }
    if (S.pending) { showPending(); return; }
    schedule();
  }

  function skip() {
    if (!S || S.ended) return;
    clearTimeout(timer);
    let guard = 0;
    while (!S.pending && !S.ended && guard < 400) {
      const r = HK.engine2.step(S);
      guard++;
      if (r.status === "ended") break;
      if (S.pending) break;
    }
    renderAll();
    saveLife();
    if (S.ended) { showEnding(); return; }
    if (S.pending) { showPending(); return; }
    toast(`${guard}日スキップした（次の出来事まで）`, "hk");
    schedule();
  }

  function showPending() {
    const p = S.pending;
    if (!p) return;
    if (p.kind === "decision") {
      const d = HK.DECISIONS2.find(x => x.id === p.id);
      $("modalTag").textContent = `決断 ・ ${HK.engine2.fmtDate(S.date)}`;
      $("modalPrompt").textContent = HK.engine2.renderText(d.prompt, S);
      const wrap = $("modalChoices"); wrap.innerHTML = "";
      d.choices.forEach((c, i) => {
        const b = document.createElement("button");
        b.className = "choice"; b.textContent = c.label;
        b.onclick = () => { HK.engine2.resolve(S, i); renderAll(); hideModal(); schedule(speedMs() * 0.5); };
        wrap.appendChild(b);
      });
      if (auto) waitAuto(() => { HK.engine2.resolve(S, autoChoice(d)); renderAll(); hideModal(); schedule(speedMs() * 0.5); });
      else hideAuto();
      showModal("決断");
    } else if (p.kind === "breather") {
      $("modalTag").textContent = `ひと息 ・ ${p.day}日目`;
      $("modalPrompt").textContent = p.q;
      const wrap = $("modalChoices"); wrap.innerHTML = "";
      const ta = document.createElement("textarea");
      ta.id = "breatherNote"; ta.rows = 3; ta.placeholder = "（任意）ひとこと残す";
      wrap.appendChild(ta);
      const b = document.createElement("button");
      b.className = "choice"; b.textContent = "先へ進む";
      b.onclick = () => { const v = ta.value.trim(); if (v) S.notes.push({ day: S.dayNum, text: v }); HK.engine2.resolve(S, 0); renderAll(); hideModal(); schedule(speedMs() * 0.5); };
      wrap.appendChild(b);
      if (auto) waitAuto(() => { HK.engine2.resolve(S, 0); renderAll(); hideModal(); schedule(speedMs() * 0.5); });
      else hideAuto();
      showModal("ひと息");
    } else if (p.kind === "revive") {
      $("modalTag").textContent = "凍結";
      $("modalPrompt").textContent = "アカウントを失った。あなたはどうする？";
      const wrap = $("modalChoices"); wrap.innerHTML = "";
      [["転生する（新しい名前で戻る）", 0], ["界隈を去る（ここで終わり）", 1], ["少し休んでから戻る", 2]].forEach(([label, i]) => {
        const b = document.createElement("button");
        b.className = "choice"; b.textContent = label;
        b.onclick = () => { HK.engine2.resolve(S, i); renderAll(); hideModal(); if (S.ended) { showEnding(); return; } schedule(speedMs() * 0.5); };
        wrap.appendChild(b);
      });
      if (auto) waitAuto(() => { const idx = Math.random() < 0.7 ? 0 : 2; HK.engine2.resolve(S, idx); renderAll(); hideModal(); if (S.ended) { showEnding(); return; } schedule(speedMs() * 0.5); });
      else hideAuto();
      showModal("凍結");
    }
  }

  function autoChoice(d) {
    const w = d.choices.map(c => {
      const f = c.fx || {};
      let s = 1;
      if (f.fame) s += Math.min(2, f.fame / 500);
      if (f.skill) s += f.skill / 25;
      if (f.goroku) s += f.goroku / 30;
      if (f.nareai) s += f.nareai / 25;
      s -= (f.banRisk || 0) / 20;
      s -= (f.fameRisk || 0) / 30;
      if (f.end) s -= 5;
      return Math.max(0.1, s);
    });
    const sum = w.reduce((a, b) => a + b, 0);
    let r = Math.random() * sum;
    for (let i = 0; i < w.length; i++) { r -= w[i]; if (r <= 0) return i; }
    return 0;
  }
  let autoTimer = null;
  function waitAuto(fn) { clearTimeout(autoTimer); autoTimer = setTimeout(fn, 1000); }
  function hideAuto() { clearTimeout(autoTimer); }
  function showModal(tag) { $("modalTag").textContent = tag + (S ? " ・ " + HK.engine2.fmtDate(S.date) : ""); $("modal").classList.add("on"); }
  function hideModal() { $("modal").classList.remove("on"); }

  /* ---------- レンダリング ---------- */
  function renderAll() {
    if (!S) return;
    renderScene(); renderHeader(); renderCert(); renderStats(); renderHk(); renderFocus(); renderLog(); renderComp(); renderMap(); renderSurv();
  }
  function renderHeader() {
    $("lifeHandle").textContent = S.handle;
    $("lifeAge").textContent = S.age + "歳";
    $("lifeYear").textContent = HK.engine2.fmtDate(S.date);
    $("lifeDay").textContent = "Day " + S.dayNum;
  }
  function renderCert() {
    const p = D().paths.find(x => x.id === S.pathId) || { label: "—" };
    const t = D().triggers.find(x => x.id === S.triggerId) || { label: "—" };
    const no = "No. " + S.era.year + "-" + String(S.seed % 1000000).padStart(6, "0");
    $("certBox").innerHTML = `
      <div class="certno">${no}</div>
      <div class="certrow"><span>ハンドル</span><b>${esc(S.handle)}</b></div>
      <div class="certrow"><span>参入</span><b>${S.era.year}年・${S.startAge}歳</b></div>
      <div class="certrow"><span>経緯</span><b>${esc(p.label)}</b></div>
      <div class="certrow"><span>きっかけ</span><b>${esc(t.label)}</b></div>
      <div class="certrow"><span>環境</span><b>${esc(S.pref)}／${esc(S.family.label)}／${esc(S.net.label)}</b></div>`;
  }

  /* ---------- 部屋シーン ---------- */
  let sceneKey = "";
  function sceneStage() {
    const hk = S.hk;
    let dev = 0;
    if ((S.net && S.net.id === "jippc") || S.money >= 300000 || hk.skill >= 40) dev = 2;
    else if ((S.net && (S.net.tier || 1) >= 2) || S.money >= 80000 || hk.skill >= 20) dev = 1;
    if (dev >= 2 && hk.skill >= 60 && hk.followers >= 1000) dev = 3;
    let lvl = 0;
    if (hk.followers >= 10000) lvl = 4;
    else if (hk.followers >= 1000) lvl = 3;
    else if (hk.followers >= 100) lvl = 2;
    else if (hk.followers >= 10) lvl = 1;
    return { dev, lvl, night: (S.dayNum % 14) < 10 };
  }
  function sceneCaption(st) {
    const where = st.dev >= 2 ? "モニターの明かり" : st.dev === 1 ? "小さな画面の明かり" : "スマホの明かり";
    const when = st.night ? "深夜" : "昼下がり";
    if (S.faded) return `${when}の部屋。${where}は、少し暗くなっている。`;
    if (st.lvl >= 3) return `${when}の部屋。${where}だけが、あなたの戦場だ。壁には、残してきた記録。`;
    return `${when}の部屋。${where}だけが、あなたの戦場だ。`;
  }
  function renderScene() {
    const el = $("sceneBox");
    if (!el || !S) return;
    const st = sceneStage();
    const key = [st.dev, st.lvl, st.night ? 1 : 0, S.faded ? 1 : 0].join("|");
    if (key === sceneKey) return;
    sceneKey = key;
    el.innerHTML = `<canvas id="sceneCv" width="640" height="360"></canvas><div class="dim small" style="margin-top:6px">${sceneCaption(st)}</div>`;
    drawScene($("sceneCv"), st);
  }
  function drawScene(cv, st) {
    if (!cv) return;
    const x = cv.getContext("2d");
    const night = st.night;
    const dim = S.faded ? 0.45 : 1;
    // 部屋（壁と床の境目をはっきり）
    x.fillStyle = night ? "#1a2133" : "#232c42";
    x.fillRect(0, 0, 640, 360);
    x.fillStyle = night ? "#0d111d" : "#141a2c";
    x.fillRect(0, 272, 640, 88);
    x.fillStyle = "#2f3d5c";
    x.fillRect(0, 268, 640, 5);
    // 窓
    x.fillStyle = "#0b0f1c";
    x.fillRect(472, 46, 108, 118);
    x.strokeStyle = "#2a3550"; x.lineWidth = 4;
    x.strokeRect(472, 46, 108, 118);
    x.beginPath(); x.moveTo(526, 46); x.lineTo(526, 164); x.moveTo(472, 105); x.lineTo(580, 105); x.stroke();
    if (night) {
      x.fillStyle = "#e8e4c8";
      x.beginPath(); x.arc(550, 80, 12, 0, Math.PI * 2); x.fill();
      x.fillStyle = "#8fa3c8";
      for (const [sx, sy, r] of [[495, 70, 2], [510, 135, 1.6], [560, 140, 1.8], [575, 68, 1.5]]) { x.beginPath(); x.arc(sx, sy, r, 0, Math.PI * 2); x.fill(); }
    } else {
      x.fillStyle = "#7ea6d8";
      x.beginPath(); x.arc(550, 82, 13, 0, Math.PI * 2); x.fill();
      x.fillStyle = "#c9d9ee";
      x.fillRect(480, 120, 40, 8); x.fillRect(544, 132, 30, 7);
    }
    // 壁の記録（ピン留めした記録カード）
    for (let i = 0; i < Math.min(4, st.lvl); i++) {
      const px0 = 64 + i * 46, py0 = 70;
      x.fillStyle = i % 2 ? "#2a3a54" : "#2e3450";
      x.fillRect(px0, py0, 34, 46);
      x.strokeStyle = "#475b83"; x.lineWidth = 2; x.strokeRect(px0, py0, 34, 46);
      x.fillStyle = "#8fa3c8";
      x.fillRect(px0 + 5, py0 + 8, 24, 3); x.fillRect(px0 + 5, py0 + 16, 24, 3); x.fillRect(px0 + 5, py0 + 24, 16, 3);
      x.fillStyle = "#e8c15a"; x.beginPath(); x.arc(px0 + 17, py0 - 3, 3, 0, Math.PI * 2); x.fill();
    }
    if (st.lvl >= 4) {
      x.fillStyle = "#f0c860"; x.fillRect(60, 56, 200, 6);
      for (let i = 0; i < 5; i++) {
        x.save(); x.translate(280 + i * 36, 110); x.rotate(Math.PI / 4);
        x.fillStyle = "#f0c860"; x.fillRect(-6, -6, 12, 12); x.restore();
      }
    }
    // いす・人（背面・モニター側からリムライト）
    x.fillStyle = "#26324e"; x.fillRect(196, 192, 66, 100);
    x.strokeStyle = "#3a4a70"; x.lineWidth = 2; x.strokeRect(196, 192, 66, 100);
    x.fillStyle = "#1d2637";
    x.beginPath(); x.arc(232, 186, 22, 0, Math.PI * 2); x.fill();
    x.fillRect(212, 204, 40, 74);
    x.strokeStyle = "#26324e"; x.lineWidth = 8;
    x.beginPath(); x.arc(232, 180, 27, Math.PI, Math.PI * 2); x.stroke();
    x.strokeStyle = "rgba(126,200,169,.5)"; x.lineWidth = 3;
    x.beginPath(); x.arc(232, 186, 22, -Math.PI * 0.55, Math.PI * 0.45); x.stroke();
    x.beginPath(); x.moveTo(250, 206); x.lineTo(250, 274); x.stroke();
    x.fillStyle = "rgba(13,17,25,.5)"; x.fillRect(206, 274, 64, 8);
    // 机（天板・前板・脚・影）
    x.fillStyle = "#34425f"; x.fillRect(300, 250, 286, 12);
    x.fillStyle = "#232e49"; x.fillRect(300, 262, 286, 10);
    x.fillStyle = "#2b3854"; x.fillRect(312, 272, 12, 64); x.fillRect(560, 272, 12, 64);
    x.fillStyle = "rgba(8,10,16,.55)"; x.fillRect(306, 336, 274, 10);
    // ランプ
    if (night && st.dev >= 1) {
      const g = x.createRadialGradient(318, 214, 3, 318, 214, 46);
      g.addColorStop(0, "rgba(232,193,90,.30)"); g.addColorStop(1, "rgba(232,193,90,0)");
      x.fillStyle = g; x.beginPath(); x.arc(318, 214, 46, 0, Math.PI * 2); x.fill();
      x.strokeStyle = "#3d4b6b"; x.lineWidth = 4;
      x.beginPath(); x.moveTo(318, 214); x.lineTo(318, 252); x.stroke();
      x.fillStyle = "#3d4b6b"; x.fillRect(308, 204, 20, 10);
    }
    // 画面グロー
    const glow = (gx, gy, gr, alpha) => {
      const g = x.createRadialGradient(gx, gy, 4, gx, gy, gr);
      g.addColorStop(0, `rgba(126,200,169,${(alpha * dim).toFixed(3)})`);
      g.addColorStop(1, "rgba(126,200,169,0)");
      x.fillStyle = g; x.beginPath(); x.arc(gx, gy, gr, 0, Math.PI * 2); x.fill();
    };
    const scr = c => { x.globalAlpha = dim; x.fillStyle = c; };
    if (st.dev <= 0) {
      glow(511, 242, 44, 0.25);
      x.fillStyle = "#0d1119"; x.fillRect(500, 232, 22, 20);
      scr("#7ec8a9"); x.fillRect(502, 234, 18, 15);
    } else if (st.dev === 1) {
      glow(463, 224, 62, 0.3);
      x.fillStyle = "#0d1119"; x.fillRect(424, 204, 78, 40);
      scr("#7ec8a9"); x.fillRect(428, 208, 70, 32);
      x.globalAlpha = 1; x.fillStyle = "#0d1119"; x.fillRect(418, 244, 90, 8);
      x.fillStyle = "#0d1119"; x.fillRect(508, 236, 20, 16);
      scr("#7ec8a9"); x.fillRect(510, 238, 16, 11);
    } else {
      glow(440, 196, 88, 0.34);
      x.fillStyle = "#0d1119"; x.fillRect(372, 158, 118, 72);
      scr("#7ec8a9"); x.fillRect(376, 162, 110, 64);
      x.globalAlpha = 1; x.fillStyle = "#2b3854";
      x.fillRect(424, 230, 16, 16); x.fillRect(404, 246, 56, 6);
      x.fillStyle = "#7ec8a9"; x.fillRect(532, 152, 8, 8);
      if (st.dev >= 3) {
        x.fillStyle = "#0d1119"; x.fillRect(494, 164, 86, 62);
        scr("#a9e3cb"); x.fillRect(498, 168, 78, 54);
        x.globalAlpha = 1; x.fillStyle = "#2b3854";
        x.fillRect(528, 226, 14, 18);
        x.strokeStyle = "#4e6087"; x.lineWidth = 5;
        x.beginPath(); x.moveTo(560, 252); x.lineTo(560, 136); x.lineTo(520, 126); x.stroke();
        x.fillStyle = "#3a4a70"; x.beginPath(); x.arc(516, 126, 10, 0, Math.PI * 2); x.fill();
      }
    }
    // 机への照り返し / 床の光だまり
    const refl = st.dev >= 2 ? 1 : 0.55;
    x.fillStyle = `rgba(126,200,169,${(0.10 * dim * refl).toFixed(3)})`;
    x.fillRect(360, 250, 240, 10);
    const fg = x.createRadialGradient(450, 322, 6, 450, 322, 130);
    fg.addColorStop(0, `rgba(126,200,169,${(0.09 * dim * refl).toFixed(3)})`);
    fg.addColorStop(1, "rgba(126,200,169,0)");
    x.fillStyle = fg; x.beginPath(); x.ellipse(450, 322, 135, 26, 0, 0, Math.PI * 2); x.fill();
    x.globalAlpha = 1;
  }
  function bar(k, label, v, cls) {
    return `<div class="statrow"><span class="k">${label}</span><span class="bar"><i class="${cls || ""}" style="width:${Math.round(v)}%"></i></span><span class="v">${Math.round(v)}</span></div>`;
  }
  function renderStats() {
    const s = S.stats;
    $("statList").innerHTML = bar("hp", "体調", s.hp) + bar("happy", "幸福", s.happy) + bar("know", "学業/仕事", s.know) + bar("rel", "人間関係", s.rel) + bar("mental", "メンタル", s.mental, "m");
    $("statMoney").textContent = "¥" + fmt(S.money);
  }
  function renderHk() {
    const hk = S.hk;
    const fm = v => v >= 10000 ? (v / 10000).toFixed(1) + "万" : fmt(v);
    $("hkPanel").innerHTML = `
      <div class="statrow"><span class="k">フォロワー</span><span class="bigv">${fm(hk.followers)}</span></div>
      <div class="statrow"><span class="k">語録力</span><span class="bar"><i class="g" style="width:${hk.goroku}%"></i></span><span class="v">${hk.goroku}</span></div>
      <div class="statrow"><span class="k">技量</span><span class="bar"><i class="g" style="width:${hk.skill}%"></i></span><span class="v">${hk.skill}</span></div>
      <div class="statrow"><span class="k">特定リスク</span><span class="bar"><i class="r" style="width:${hk.fameRisk}%"></i></span><span class="v">${Math.round(hk.fameRisk)}</span></div>
      <div class="statrow"><span class="k">凍結リスク</span><span class="bar"><i class="r" style="width:${hk.banRisk}%"></i></span><span class="v">${Math.round(hk.banRisk)}</span></div>
      <div class="dim small">${S.era.year}年参入（${S.era.name}） ${S.faded ? "・冷めかけ" : ""} ${hk.freezes ? "・凍結" + hk.freezes + "回" : ""} ${S.flags.includes("doxxed") ? "・特定済み" : ""}</div>`;
  }
  function renderFocus() {
    const el = $("focusBox");
    el.innerHTML = D().focuses.map(f =>
      `<button class="focuschip ${S.focus === f.id ? "on" : ""}" data-focus="${f.id}" title="${f.desc}">${f.label}</button>`
    ).join("");
    el.querySelectorAll(".focuschip").forEach(b => {
      b.onclick = () => { S.focus = b.dataset.focus; renderFocus(); renderHk(); };
    });
  }
  function renderLog() {
    const box = $("logBox");
    const near = box.scrollHeight - box.scrollTop - box.clientHeight < 140;
    box.innerHTML = S.log.map((l, i) =>
      `<div class="logline k-${l.kind}" data-i="${i}"><span class="ly">D${l.day}</span><span class="star ${S.starred[i] ? "on" : ""}">★</span>${esc(l.text)}</div>`
    ).join("");
    box.querySelectorAll(".logline").forEach(row => {
      row.querySelector(".star").addEventListener("click", (ev) => {
        ev.stopPropagation();
        const i = row.dataset.i;
        if (S.starred[i]) delete S.starred[i]; else S.starred[i] = true;
        row.querySelector(".star").classList.toggle("on", !!S.starred[i]);
      });
    });
    if (near) box.scrollTop = box.scrollHeight;
  }
  const esc = s => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function renderComp() {
    $("compBox").innerHTML = S.companions.map(c => {
      const st = c.stage >= c.lines.length ? "消息わずか" : "活動中";
      return `<div class="comp"><b>${esc(c.name)}</b><span class="dim">${S.dayNum >= c.next - 40 ? st : "…"}・${fmt(c.followers)}人</span></div>`;
    }).join("");
  }
  function renderMap() {
    // 1マス=1週（7日）・濃いほど充実していた週
    const W = Math.max(1, Math.ceil(Math.max(S.dayNum, 1) / 7));
    const sum = new Array(W).fill(0), cnt = new Array(W).fill(0);
    for (const d of S.days) {
      const w = Math.floor((d.day - 1) / 7);
      if (w >= 0 && w < W) { sum[w] += d.happy; cnt[w]++; }
    }
    const med = Math.floor(550 / 7);
    let html = "";
    for (let w = 0; w < W; w++) {
      const avg = cnt[w] ? sum[w] / cnt[w] : null;
      const lvl = avg == null ? "m0" : avg >= 70 ? "m4" : avg >= 55 ? "m3" : avg >= 40 ? "m2" : avg >= 25 ? "m1" : "m0";
      html += `<i class="${lvl}${w === med ? " med" : ""}" title="第${w + 1}週${avg != null ? "・幸福 " + Math.round(avg) : ""}"></i>`;
    }
    $("mapBox").innerHTML = `<div class="mapgrid">${html}</div>
      <div class="dim small">1マス = 1週間・明るい色ほど充実していた週（色 = 幸福の平均）。枠付き = 界隈の期待活動寿命（約550日 ≒ 第79週）。</div>`;
  }
  function renderSurv() {
    const n = S.dayNum;
    const W = 300, H = 122, x0 = 36, x1 = 292, y0 = 12, y1 = 94;
    const maxN = Math.max(650, Math.ceil((n + 60) / 100) * 100);
    const X = t => x0 + (x1 - x0) * t / maxN;
    const Y = p => y1 - (y1 - y0) * p;
    const P = t => Math.exp(-t / 550);
    let g = "";
    for (const p of [0, .25, .5, .75, 1]) {
      g += `<line x1="${x0}" x2="${x1}" y1="${Y(p).toFixed(1)}" y2="${Y(p).toFixed(1)}" class="sv-grid"/>`;
      g += `<text x="${x0 - 5}" y="${(Y(p) + 3).toFixed(1)}" text-anchor="end" class="sv-tick">${p * 100}%</text>`;
    }
    const step = maxN <= 900 ? 150 : 300;
    for (let t = 0; t <= maxN; t += step) {
      g += `<text x="${X(t).toFixed(1)}" y="${H - 16}" text-anchor="middle" class="sv-tick">${t}</text>`;
    }
    g += `<text x="${x1}" y="${H - 3}" text-anchor="end" class="sv-tick">日数</text>`;
    let d = "";
    for (let t = 0; t <= maxN; t += 5) d += (t ? "L" : "M") + X(t).toFixed(1) + " " + Y(P(t)).toFixed(1);
    g += `<path d="${d}" class="sv-line"/>`;
    g += `<line x1="${X(550).toFixed(1)}" x2="${X(550).toFixed(1)}" y1="${y0}" y2="${y1}" class="sv-med"/>`;
    g += `<text x="${X(550).toFixed(1)}" y="${y0 + 8}" text-anchor="middle" class="sv-tick">期待活動寿命</text>`;
    const pct = Math.round(P(n) * 100);
    g += `<circle cx="${X(n).toFixed(1)}" cy="${Y(P(n)).toFixed(1)}" r="3.5" class="sv-you"/>`;
    g += `<text x="${Math.min(X(n) + 7, x1 - 78).toFixed(1)}" y="${Math.max(Y(P(n)) - 7, y0 + 10).toFixed(1)}" class="sv-lbl">あなた ${pct}%</text>`;
    $("survBox").innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="surv" role="img" aria-label="同時期参入組の継続率曲線">${g}</svg>
      <div class="dim small">同時期に参入した人が、いまも活動している割合のモデル（継続率 = e^(−日数/550)）。●があなた。550日 = 界隈の期待活動寿命（約1年半）。</div>`;
  }
  function toast(text, kind) {
    const box = $("toasts"); const el = document.createElement("div");
    el.className = "toast " + (kind || ""); el.textContent = text;
    box.appendChild(el);
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 300); }, 2400);
  }

  /* ---------- エンディング ---------- */
  function showEnding() {
    if (!S || !S.title) return;
    LS.remove(SAVE_KEY);
    const pb = $("btnPublish");
    if (pb) { pb.disabled = false; pb.textContent = "みんなのメモリアルに残す"; }
    const r = recordFromState(S);
    currentShownRecord = r;
    displayEnding(r);
    paintCard(r);
    show("ending");
  }

  /* 記録1件ぶんのエンディング表示（現在の人生 / 過去の記録 共通） */
  function displayEnding(r) {
    $("endTitle").textContent = r.title;
    $("endRank").textContent = r.rank;
    $("endRank").className = "rank r-" + r.rank;
    $("endDesc").textContent = r.desc;
    $("endWho").textContent = `${r.name}／${r.handle} ・ ${r.era}年参入 ・ ${r.startStr} → ${r.endStr}（${r.age0}歳 → ${r.ageEnd}歳）`;
    $("endTypeName").textContent = `終わり方: ${r.endingName}`;
    $("endTypeDesc").textContent = r.endingDesc;
    const rr = r.real || {};
    $("endReal").textContent = (rr.era || rr.age)
      ? `あなたの実際: ${rr.era ? rr.era + "年参入" : "参入時期不明"}${rr.age ? "・当時" + rr.age + "歳" : ""} ／ 今回: ${r.era}年参入・${r.age0}歳`
      : "";
    const rs = r.realStats || {};
    $("endStats").innerHTML = `
      <div class="secthead">― リアル側 ―</div>
      <div class="dstat"><span>体調 / 幸福</span><b>${Math.round(rs.hp || 0)} / ${Math.round(rs.happy || 0)}</b></div>
      <div class="dstat"><span>学業・仕事 / 人間関係</span><b>${Math.round(rs.know || 0)} / ${Math.round(rs.rel || 0)}</b></div>
      <div class="dstat"><span>メンタル</span><b>${Math.round(rs.mental || 0)}</b></div>
      <div class="dstat"><span>お金</span><b>¥${fmt(rs.money || 0)}</b></div>
      <div class="secthead">― ネット側 ―</div>
      <div class="dstat"><span>界隈歴</span><b>${fmt(r.days)}日</b></div>
      <div class="dstat"><span>最高フォロワー</span><b>${fmt(r.peak)}</b></div>
      <div class="dstat"><span>語録力 / 技量</span><b>${r.goroku} / ${r.skill}</b></div>
      <div class="dstat"><span>凍結 / 特定</span><b>${r.freezes}回 / ${r.doxxed ? "あり" : "なし"}</b></div>
      <div class="dstat"><span>引退宣言</span><b>${r.retires}回</b></div>`;
    $("endChain").innerHTML = r.chain.map(c =>
      `<div class="chainrow"><span>${c.label}</span><b>1 / ${formatInv(c.inv)}</b></div>`
    ).join("") + `<div class="chainrow total"><span>この界隈歴の希少度（モデル計算）</span><b>約 1 / ${fmt(1 / r.product)}</b></div>`;
    $("endMoments").innerHTML = (r.lines || []).map(l => `<div class="moment">${esc(l)}</div>`).join("") || `<div class="dim small">心に残る行は、記録の中にある。</div>`;
    const comps = r.comps || [];
    $("endComp").innerHTML = comps.length
      ? comps.map(c => `<div class="comp"><b>${esc(c.name)}</b><span class="dim">${esc(c.fate)}</span></div>`).join("")
      : `<div class="dim small">—</div>`;
  }

  function renderEndingScreen({ record, live }) {
    const r = record || recordFromState(S);
    $("endTitle").textContent = r.title;
    $("endRank").textContent = r.rank;
    $("endRank").className = "rank r-" + r.rank;
    $("endDesc").textContent = r.desc;
    $("endWho").textContent = `${r.name}／${r.handle} ・ ${r.era}年参入 ・ ${r.startStr} → ${r.endStr}（${r.age0}歳 → ${r.ageEnd}歳）`;
    $("endTypeName").textContent = `終わり方: ${r.endingName}`;
    $("endTypeDesc").textContent = r.endingDesc;
    $("endStats").innerHTML = `
      <div class="dstat"><span>界隈歴</span><b>${fmt(r.days)}日</b></div>
      <div class="dstat"><span>最高フォロワー</span><b>${fmt(r.peak)}</b></div>
      <div class="dstat"><span>凍結 / 特定</span><b>${r.freezes}回 / ${r.doxxed ? "あり" : "なし"}</b></div>
      <div class="dstat"><span>引退宣言</span><b>${r.retires}回</b></div>
      <div class="dstat"><span>語録力 / 技量</span><b>${r.goroku} / ${r.skill}</b></div>
      <div class="dstat"><span>参入した時代</span><b>${r.era}年（${r.eraName}）</b></div>`;
    $("endChain").innerHTML = r.chain.map(c =>
      `<div class="chainrow"><span>${c.label}</span><b>1 / ${formatInv(c.inv)}</b></div>`
    ).join("") + `<div class="chainrow total"><span>この界隈歴の希少度（モデル計算）</span><b>約 1 / ${fmt(1 / r.product)}</b></div>`;
    $("endMoments").innerHTML = (r.lines || []).map(l => `<div class="moment">${esc(l)}</div>`).join("") || `<div class="dim small">心に残る行は、記録の中にある。</div>`;
  }
  function formatInv(v) {
    if (v <= 1) return "1";
    if (v < 10) return (Math.round(v * 100) / 100).toString();
    if (v < 100) return (Math.round(v * 10) / 10).toString();
    return fmt(v);
  }
  function recordFromState(S) {
    const picks = [];
    const seen = new Set();
    Object.keys(S.starred).map(Number).sort((a, b) => a - b).forEach(i => {
      const l = S.log[i];
      if (l && !seen.has(l.text.slice(0, 40)) && picks.length < 16) {
        seen.add(l.text.slice(0, 40));
        picks.push({ day: l.day, text: l.text.slice(0, 90) });
      }
    });
    // 足りない分は印象的な行で補って、アルバムを最低12枚にする
    if (picks.length < 12) {
      const kinds = ["milestone", "decision", "freeze", "doxx", "ending", "debut", "revive", "comp", "hk", "cal"];
      const pool = S.log.filter(l => kinds.includes(l.kind) && !seen.has(l.text.slice(0, 40)));
      while (picks.length < 12 && pool.length) {
        const pick = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
        seen.add(pick.text.slice(0, 40));
        picks.push({ day: pick.day, text: pick.text.slice(0, 90) });
      }
    }
    picks.sort((a, b) => a.day - b.day);
    const starLines = picks.map(p => `「${p.text}」（${p.day}日目）`);
    return {
      name: S.name, handle: S.handle, sex: S.sex, era: S.era.year, eraName: S.era.name,
      startStr: HK.engine2.fmtDate(S.startDate), endStr: HK.engine2.fmtDate(S.date),
      days: S.dayNum, age0: S.startAge, ageEnd: S.age,
      peak: S.hk.peakFollowers, freezes: S.hk.freezes, doxxed: S.flags.includes("doxxed"),
      retires: S.hk.retireCount, goroku: S.hk.goroku, skill: S.hk.skill,
      title: S.title.name, rank: S.title.rank, desc: S.title.desc,
      endingId: S.ending.id, endingName: S.ending.name, endingDesc: S.ending.desc,
      chain: S.prob.chain, product: S.prob.product,
      real: S.real || null,
      realStats: { hp: S.stats.hp, happy: S.stats.happy, know: S.stats.know, rel: S.stats.rel, mental: S.stats.mental, money: S.money },
      comps: S.companions.map(c => ({ name: c.name, fate: (D().compFates && D().compFates[c.arc]) || "行方不明のまま" })),
      lines: starLines, ts: new Date().toISOString()
    };
  }

  /* ---------- カード ---------- */
  function paintCard(r) {
    const cv = $("cardCanvas"); const ctx = cv.getContext("2d");
    const W = 1080, H = 1350;
    ctx.fillStyle = "#0b0f14"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#233040"; ctx.lineWidth = 3; ctx.strokeRect(40, 40, W - 80, H - 80);
    ctx.fillStyle = "#ff8a3d"; ctx.font = "700 40px 'Noto Sans JP', sans-serif";
    ctx.fillText("2万分の1のヒカマー", 90, 145);
    ctx.fillStyle = "#7d8ea3"; ctx.font = "24px 'Noto Sans JP', sans-serif";
    ctx.fillText(`— ${r.era}年参入（${r.eraName}）・界隈歴 ${fmt(r.days)}日 —`, 90, 188);
    ctx.fillStyle = "#e8eef5"; ctx.font = "700 60px 'Noto Sans JP', sans-serif";
    ctx.fillText(r.handle, 90, 285);
    ctx.fillStyle = "#9fb0c3"; ctx.font = "28px 'Noto Sans JP', sans-serif";
    ctx.fillText(`${r.name} ・ ${r.startStr} → ${r.endStr}（${r.age0}→${r.ageEnd}歳）`, 90, 335);
    // 称号
    ctx.fillStyle = "#141b24"; roundRect(ctx, 80, 375, W - 160, 150, 16); ctx.fill();
    ctx.fillStyle = "#ffb877"; ctx.font = "700 54px 'Noto Sans JP', sans-serif";
    ctx.fillText(`【${r.rank}】${r.title}`, 110, 452);
    ctx.fillStyle = "#9fb0c3"; ctx.font = "25px 'Noto Sans JP', sans-serif";
    wrapText(ctx, r.desc, 110, 495, W - 220, 32, 2);
    // 統計
    const rows = [
      ["終わり方", r.endingName],
      ["最高フォロワー", fmt(r.peak)],
      ["凍結 / 特定", `${r.freezes}回 / ${r.doxxed ? "あり" : "なし"}`],
      ["語録力 / 技量", `${r.goroku} / ${r.skill}`]
    ];
    let y = 600;
    rows.forEach(([k, v]) => {
      ctx.fillStyle = "#7d8ea3"; ctx.font = "28px 'Noto Sans JP', sans-serif"; ctx.textAlign = "left";
      ctx.fillText(k, 90, y);
      ctx.fillStyle = "#e8eef5"; ctx.font = "700 30px 'Noto Sans JP', sans-serif"; ctx.textAlign = "right";
      ctx.fillText(v, W - 90, y); ctx.textAlign = "left";
      y += 56;
    });
    if (r.lines && r.lines[0]) {
      y += 14;
      ctx.fillStyle = "#7d8ea3"; ctx.font = "22px 'Noto Sans JP', sans-serif";
      ctx.fillText("心に残る行", 90, y); y += 38;
      ctx.fillStyle = "#c9d6e4"; ctx.font = "italic 25px 'Noto Sans JP', sans-serif";
      wrapText(ctx, r.lines[0], 90, y, W - 180, 34, 3); y += 100;
    }
    ctx.fillStyle = "#7d8ea3"; ctx.font = "22px 'Noto Sans JP', sans-serif";
    ctx.fillText("この界隈歴の希少度（モデル計算）", 90, y); y += 44;
    ctx.fillStyle = "#7ee787"; ctx.font = "700 42px 'Noto Sans JP', sans-serif";
    ctx.fillText(`約 1 / ${fmt(1 / r.product)}`, 90, y);
    ctx.fillStyle = "#54657a"; ctx.font = "20px 'Noto Sans JP', sans-serif";
    ctx.fillText("出典: ヒカマーWiki・Hikabooru・810ch・ヒカマーズ8values ほか（詳細はサイトの「しくみ」へ）", 90, H - 105);
    ctx.fillText("人口検査(2026-10): 名乗り調査より全ヒカマー ≈ 3,000〜8,000人 → 約2万分の1。この記録はフィクションです。", 90, H - 70);
  }
  function wrapText(ctx, text, x, y, maxW, lineH, maxLines) {
    const chars = text.split(""); let line = "", lines = [];
    for (const ch of chars) {
      if (ctx.measureText(line + ch).width > maxW) { lines.push(line); line = ch; } else line += ch;
    }
    if (line) lines.push(line);
    lines.slice(0, maxLines || 99).forEach((l, i) => ctx.fillText(l, x, y + i * lineH));
  }
  function roundRect(ctx, x, y, w, h, rr) {
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  /* ---------- メモリアル ---------- */
  function saveMemorial() {
    const list = LS.get(MEM_KEY, []);
    list.unshift(recordFromState(S));
    LS.set(MEM_KEY, list.slice(0, 12));
    toast("メモリアルに納めた。", "hk");
  }
  function showMemorial() {
    const list = LS.get(MEM_KEY, []);
    const tabs = `<div class="memtabs"><button class="chip ${memTab === "local" ? "on" : ""}" data-mtab="local">あなたの記録</button><button class="chip ${memTab === "public" ? "on" : ""}" data-mtab="public">みんなのメモリアル</button></div>`;
    if (memTab === "public") {
      $("memList").innerHTML = tabs + `<div class="pubbar"><button class="chip" id="btnRandMem">🎲 ランダムに見る</button><span class="dim small" id="memTotal"></span></div><div id="memPub" class="dim small">読み込み中…</div>`;
      $("memList").querySelectorAll("[data-mtab]").forEach(b => b.onclick = () => { memTab = b.dataset.mtab; showMemorial(); });
      renderPublicMemorial();
      show("memorial");
      return;
    }
    const sum = list.length ? `<div class="memsum">これまで: ${list.length}件 ・ 最長 ${fmt(Math.max(...list.map(m => m.days || 0)))}日 ・ 最高フォロワー ${fmt(Math.max(...list.map(m => m.peak || 0)))}</div>` : "";
    $("memList").innerHTML = tabs + sum + (list.length ? list.map((m, i) => {
      const msgs = (m.msgs || []).map(g => `<div class="memmsg"><span class="dim small">${esc(g.date)}</span> ${esc(g.text)}</div>`).join("");
      return `
      <div class="memcard">
        <div class="memhead"><span class="rank r-${m.rank} small">${m.rank}</span><b>${esc(m.handle)}</b><span class="dim small">${esc(m.name)}</span></div>
        <div class="dim small">${m.era}年参入 ・ 界隈歴 ${fmt(m.days)}日 ・ ${esc(m.endingName)}</div>
        <div class="memtitle">${esc(m.title)}</div>
        <div class="dim small">${esc(m.desc)}</div>
        <div class="membottom">
          <span class="dim small">希少度 約1/${fmt(1 / m.product)}</span>
          <span><button class="candle" data-idx="${i}" data-act="again">もう一度見る</button>
          <button class="candle" data-idx="${i}" data-act="candle">🕯 ${m.candles || 0}</button></span>
        </div>
        ${msgs ? `<div class="memmsgs">${msgs}</div>` : ""}
        <div class="memform"><input class="meminp" data-idx="${i}" maxlength="80" placeholder="ひとことを残す（80字まで）"><button class="candle" data-idx="${i}" data-act="msg">残す</button></div>
      </div>`;
    }).join("") : `<div class="dim">まだ、ここに界隈歴はない。</div>`);
    $("memList").querySelectorAll("[data-mtab]").forEach(b => b.onclick = () => { memTab = b.dataset.mtab; showMemorial(); });
    document.querySelectorAll("[data-act]").forEach(b => {
      b.onclick = () => {
        const list2 = LS.get(MEM_KEY, []);
        const m = list2[Number(b.dataset.idx)];
        if (!m) return;
        if (b.dataset.act === "candle") { m.candles = (m.candles || 0) + 1; LS.set(MEM_KEY, list2); b.textContent = "🕯 " + m.candles; }
        else if (b.dataset.act === "msg") {
          const inp = document.querySelector(`.meminp[data-idx="${b.dataset.idx}"]`);
          const text = ((inp && inp.value) || "").trim();
          if (!text) { if (inp) inp.focus(); return; }
          m.msgs = m.msgs || [];
          m.msgs.push({ date: new Date().toLocaleDateString("ja-JP"), text });
          LS.set(MEM_KEY, list2);
          showMemorial();
          return;
        }
        else { renderEndingRecord(m); }
      };
    });
    show("memorial");
  }
  /* ---------- みんなのメモリアル（公開・サーバー） ---------- */
  async function renderPublicMemorial() {
    const box = $("memPub");
    if (!box) return;
    try {
      const res = await fetch(MEM_API + "/mems");
      const data = await res.json();
      if (!data.list || !data.list.length) {
        box.innerHTML = `<div class="dim">まだ公開された界隈歴はない。エンディングで「みんなのメモリアルに残す」を押すと、ここに並ぶ。</div>`;
        return;
      }
      box.classList.remove("small", "dim");
      const lit = litSet();
      box.innerHTML = data.list.map(m => {
        const isLit = lit.includes(m.id);
        return `
        <div class="memcard" data-card="${esc(m.id)}">
          <div class="memhead"><span class="rank r-${esc(m.r)} small">${esc(m.r)}</span><b>@${esc(m.h)}</b><span class="dim small">${esc(m.n)}</span></div>
          <div class="dim small">${m.e}年参入 ・ 界隈歴 ${fmt(m.d)}日 ・ ${esc(m.g)}</div>
          <div class="memtitle">${esc(m.t)}</div>
          ${m.ds ? `<div class="dim small">${esc(m.ds)}</div>` : ""}
          <div class="membottom"><span class="dim small">${new Date(m.at).toLocaleDateString("ja-JP")}</span>
          <span><button class="candle" data-msgs="${esc(m.id)}">💬 ひとこと</button>
          ${isLit ? `<button class="candle" disabled>🕯 灯済み ${m.c || 0}</button>` : `<button class="candle" data-pub="${esc(m.id)}">🕯 ${m.c || 0}</button>`}</span></div>
          <div class="pubmsgs" data-box="${esc(m.id)}" hidden></div>
        </div>`;
      }).join("");
      const totEl = $("memTotal");
      if (totEl) totEl.textContent = `${data.total}件の記録`;
      box.querySelectorAll("[data-pub]").forEach(b => {
        b.onclick = async () => {
          b.disabled = true;
          try {
            const r2 = await fetch(MEM_API + "/candle", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: b.dataset.pub }) });
            const d2 = await r2.json();
            if (d2.ok) { markLit(b.dataset.pub); b.textContent = "🕯 灯済み " + d2.c; toast("ろうそくを灯した", "hk"); }
            else { b.disabled = false; toast("灯せなかった"); }
          } catch (e) { b.disabled = false; toast("通信に失敗した"); }
        };
      });
      box.querySelectorAll("[data-msgs]").forEach(b => b.onclick = () => openPubMsgs(b.dataset.msgs));
      const rb = $("btnRandMem");
      if (rb) rb.onclick = () => {
        const cards = box.querySelectorAll(".memcard");
        if (!cards.length) return;
        const c = cards[Math.floor(Math.random() * cards.length)];
        c.scrollIntoView({ behavior: "smooth", block: "center" });
        c.classList.add("flash");
        setTimeout(() => c.classList.remove("flash"), 1600);
      };
    } catch (e) {
      box.innerHTML = `<div class="dim">読み込めなかった（通信エラー）。もう一度開いてみて。</div>`;
    }
  }
  async function openPubMsgs(id) {
    const box = document.querySelector(`[data-box="${id}"]`);
    if (!box) return;
    if (!box.hidden) { box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = `<div class="dim small">読み込み中…</div>`;
    try {
      const res = await fetch(MEM_API + "/msgs?id=" + encodeURIComponent(id));
      const data = await res.json();
      renderMsgs(id, box, data.list || []);
    } catch (e) {
      box.innerHTML = `<div class="dim small">読み込めなかった</div>`;
    }
  }
  function renderMsgs(id, box, list) {
    box.innerHTML = (list.length
      ? list.map(m => `<div class="memmsg"><span class="dim small">${new Date(m.ts).toLocaleDateString("ja-JP")}</span> ${esc(m.t)}</div>`).join("")
      : `<div class="dim small">まだ、ひとことはない。</div>`) +
      `<div class="memform"><input class="meminp" maxlength="60" placeholder="ひとことを残す（60字まで）"><button class="candle" data-msend>残す</button></div>`;
    const send = box.querySelector("[data-msend]");
    const inp = box.querySelector(".meminp");
    send.onclick = async () => {
      const text = (inp.value || "").trim();
      if (!text) { inp.focus(); return; }
      send.disabled = true;
      try {
        const r = await fetch(MEM_API + "/msg", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, text }) });
        const d = await r.json();
        if (d.ok) {
          toast("ひとことを残した", "hk");
          const r2 = await fetch(MEM_API + "/msgs?id=" + encodeURIComponent(id));
          const dd = await r2.json();
          renderMsgs(id, box, dd.list || []);
        } else { send.disabled = false; toast(d.why === "rate" ? "少し時間をおいてから" : "残せなかった"); }
      } catch (e) { send.disabled = false; toast("通信に失敗した"); }
    };
  }
  async function publishRecord() {
    const r = currentShownRecord || (S ? recordFromState(S) : null);
    if (!r) return;
    const h = pubHash(r);
    if (pubSet().includes(h)) { toast("この記録はもう公開してある"); return; }
    if (!confirm("この界隈歴を公開メモリアルに残す？（@ハンドル・称号・日数などが誰でも見られる）")) return;
    const b = $("btnPublish");
    b.disabled = true;
    try {
      const res = await fetch(MEM_API + "/mem", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: r.handle, name: r.name, era: r.era, days: r.days, title: r.title, rank: r.rank, ending: r.endingName, desc: r.desc })
      });
      const data = await res.json();
      if (data.ok) {
        const s = pubSet(); s.push(h); LS.set("hk4m2.pub", s.slice(-200));
        b.textContent = "公開した 🕯"; toast("みんなのメモリアルに残した（反映に少し時間がかかることがある）", "hk");
      }
      else { b.disabled = false; toast("残せなかった"); }
    } catch (e) { b.disabled = false; toast("通信に失敗した"); }
  }
  /* ---------- アルバム / フィルム（keepx相当の簡易版） ---------- */
  let albumRec = null, filmIdx = 0, filmTimer = null;
  const ALBUM_ICONS = ["🎞", "📷", "🖥", "🎧", "📝", "🌙", "⚡", "🧃", "🧩", "📼"];
  function openAlbum() {
    const r = currentShownRecord || (S ? recordFromState(S) : null);
    if (!r) return;
    albumRec = r;
    $("albumTitle").textContent = "アルバム";
    $("albumWho").textContent = `${r.title} — ${r.name}／@${r.handle}・界隈歴 ${fmt(r.days)}日`;
    $("albumGrid").innerHTML = (r.lines || []).length
      ? r.lines.map((l, i) => `<div class="polacard"><div class="polapic">${ALBUM_ICONS[i % ALBUM_ICONS.length]}</div><div class="polatext">${esc(l)}</div></div>`).join("")
      : `<div class="dim">思い出はまだ空っぽだ。</div>`;
    $("albumOv").hidden = false;
  }
  function closeAlbum() { stopFilm(); $("albumOv").hidden = true; }
  function startFilm() {
    const r = albumRec;
    if (!r || !(r.lines || []).length) return;
    filmIdx = 0;
    $("filmOv").hidden = false;
    renderFilm();
    clearInterval(filmTimer);
    filmTimer = setInterval(() => { filmIdx = (filmIdx + 1) % r.lines.length; renderFilm(); }, 2600);
  }
  function renderFilm() {
    const r = albumRec;
    if (!r) return;
    const el = $("filmCard");
    el.textContent = r.lines[filmIdx] || "";
    el.classList.remove("on");
    void el.offsetWidth;
    el.classList.add("on");
    $("filmCount").textContent = `${filmIdx + 1} / ${r.lines.length}`;
  }
  function stopFilm() { clearInterval(filmTimer); filmTimer = null; $("filmOv").hidden = true; }
  /* ---------- 界隈研究室（まとめシミュレーション） ---------- */
  function labOpts() {
    const o = {};
    const era = $("labEra").value; if (era !== "random") o.era = parseInt(era, 10);
    const path = $("labPath").value; if (path !== "random") o.path = path;
    const age = $("labAge").value; if (age !== "random") o.age = parseInt(age, 10);
    return o;
  }
  function runLabLife(base) {
    const S = HK.engine2.newGame(Object.assign({}, base, { seed: Math.floor(Math.random() * 2147483000) }));
    let guard = 0;
    while (!S.ended && guard++ < 2400) {
      HK.engine2.step(S);
      if (S.ended) break;
      if (S.pending) HK.engine2.resolve(S, S.pending.kind === "decision" ? (S.rng.chance(0.7) ? 0 : 2) : 0);
    }
    return {
      days: S.dayNum, peak: S.hk.peakFollowers, handle: S.handle,
      title: S.title ? S.title.name : "—", rank: S.title ? S.title.rank : "-",
      ending: S.ending ? S.ending.name : "（未完）", freezes: S.hk.freezes,
      doxxed: S.flags.includes("doxxed")
    };
  }
  let labBusy = false;
  function startLab() {
    if (labBusy) return;
    labBusy = true;
    const N = parseInt($("labN").value, 10);
    const base = labOpts();
    const runs = [];
    const btn = $("btnLabRun");
    btn.disabled = true;
    $("labOut").innerHTML = `<div class="dim">走らせている…</div>`;
    const tickLab = () => {
      const t0 = performance.now();
      while (runs.length < N && performance.now() - t0 < 120) {
        try { runs.push(runLabLife(base)); } catch (e) { }
      }
      $("labProg").textContent = `${runs.length} / ${N} 本`;
      if (runs.length < N) { setTimeout(tickLab, 30); return; }
      $("labProg").textContent = `${N} 本 完了`;
      renderLabResults(runs);
      btn.disabled = false; labBusy = false;
    };
    setTimeout(tickLab, 50);
  }
  function labMedian(a) { const s = [...a].sort((x, y) => x - y); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2); }
  function renderLabResults(runs) {
    const days = runs.map(r => r.days), peaks = runs.map(r => r.peak);
    const doxxRate = Math.round(100 * runs.filter(r => r.doxxed).length / runs.length);
    const freezeRate = Math.round(100 * runs.filter(r => r.freezes > 0).length / runs.length);
    const endCount = {};
    runs.forEach(r => { endCount[r.ending] = (endCount[r.ending] || 0) + 1; });
    const endRows = Object.entries(endCount).sort((a, b) => b[1] - a[1]).map(([k, v]) =>
      `<div class="labbar"><span>${esc(k)}</span><i style="width:${(100 * v / runs.length).toFixed(1)}%"></i><b>${v}本</b></div>`).join("");
    const top = [...runs].sort((a, b) => b.peak - a.peak).slice(0, 5).map((r, i) =>
      `<div class="labrank"><span class="rank r-${esc(r.rank)} small">${esc(r.rank)}</span> ${i + 1}. ${esc(r.title)} — @${esc(r.handle)} <span class="dim small">（${fmt(r.days)}日・最高${fmt(r.peak)}）</span></div>`).join("");
    $("labOut").innerHTML = `
      <div class="labgrid">
        <div class="labstat"><b>${runs.length}</b><span>本の人生</span></div>
        <div class="labstat"><b>${fmt(labMedian(days))}日</b><span>界隈歴 中央値</span></div>
        <div class="labstat"><b>${fmt(labMedian(peaks))}</b><span>最高フォロワー 中央値</span></div>
        <div class="labstat"><b>${doxxRate}%</b><span>特定された割合</span></div>
        <div class="labstat"><b>${freezeRate}%</b><span>凍結された割合</span></div>
      </div>
      <div class="secthead">― 終わり方の内訳 ―</div>${endRows}
      <div class="secthead">― 輝いた人生トップ5 ―</div>${top}
      <div class="dim small" style="margin-top:8px">決定の場面は自動で選ばれる（おまかせと同じ: 7割は前向き・3割は慎重）。ここで走った人生は記録に残らない。</div>`;
  }

  function renderEndingRecord(m) {
    currentShownRecord = m;
    displayEnding(m);
    paintCard(m);
    show("ending");
  }
  function _legacyRecord(m) {
    // 過去の記録を再表示（カードは描き直し）
    const fake = {
      name: m.name, handle: m.handle, era: m.era, eraName: m.eraName,
      startStr: m.startStr, endStr: m.endStr, days: m.days, age0: m.age0, ageEnd: m.ageEnd,
      peak: m.peak, freezes: m.freezes, doxxed: m.doxxed, retires: m.retires,
      goroku: m.goroku, skill: m.skill, title: m.title, rank: m.rank, desc: m.desc,
      endingId: m.endingId, endingName: m.endingName, endingDesc: m.endingDesc,
      chain: m.chain, product: m.product, lines: m.lines
    };
    $("endTitle").textContent = fake.title;
    $("endRank").textContent = fake.rank; $("endRank").className = "rank r-" + fake.rank;
    $("endDesc").textContent = fake.desc;
    $("endWho").textContent = `${fake.name}／${fake.handle} ・ ${fake.era}年参入 ・ ${fake.startStr} → ${fake.endStr}（${fake.age0}歳 → ${fake.ageEnd}歳）`;
    $("endTypeName").textContent = `終わり方: ${fake.endingName}`;
    $("endTypeDesc").textContent = fake.endingDesc;
    $("endStats").innerHTML = `
      <div class="dstat"><span>界隈歴</span><b>${fmt(fake.days)}日</b></div>
      <div class="dstat"><span>最高フォロワー</span><b>${fmt(fake.peak)}</b></div>
      <div class="dstat"><span>凍結 / 特定</span><b>${fake.freezes}回 / ${fake.doxxed ? "あり" : "なし"}</b></div>
      <div class="dstat"><span>引退宣言</span><b>${fake.retires}回</b></div>
      <div class="dstat"><span>語録力 / 技量</span><b>${fake.goroku} / ${fake.skill}</b></div>
      <div class="dstat"><span>参入した時代</span><b>${fake.era}年（${fake.eraName}）</b></div>`;
    $("endChain").innerHTML = (fake.chain || []).map(c =>
      `<div class="chainrow"><span>${c.label}</span><b>1 / ${formatInv(c.inv)}</b></div>`
    ).join("") + `<div class="chainrow total"><span>希少度（モデル計算）</span><b>約 1 / ${fmt(1 / fake.product)}</b></div>`;
    $("endMoments").innerHTML = (fake.lines || []).map(l => `<div class="moment">${esc(l)}</div>`).join("");
    $("btnDownload").style.display = "none"; // 過去記録のカードは再生成しない
    show("ending");
  }

  /* ---------- 図鑑 ---------- */
  function showZukan() {
    const z = LS.get(ZUK_KEY, {});
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
    const tt = LS.get(TIT_KEY, {});
    $("titlesBody").innerHTML = D().titles.map(t => tt[t.id]
      ? `<div class="zitem on"><b>【${t.rank}】${esc(t.name)}</b><p>${esc(t.desc)}</p></div>`
      : `<div class="zitem"><b>???</b><p>まだ到達していない。</p></div>`).join("");
    show("zukan");
  }

  /* ---------- ナビ ---------- */
  function bindNav() {
    document.querySelectorAll("[data-nav]").forEach(b => {
      b.addEventListener("click", () => {
        const n = b.dataset.nav;
        if (n === "memorial") { showMemorial(); return; }
        if (n === "zukan") { showZukan(); return; }
        if (n === "about") { show("about"); return; }
        if (n === "lab") { show("lab"); return; }
        if (n === "start") { show("start"); return; }
      });
    });
    $("btnQuit").addEventListener("click", () => { if (confirm("この界隈歴を中断しますか？（記録は残りません）")) { S = null; clearTimeout(timer); show("start"); } });
  }

  function bindControls() {
    document.querySelectorAll(".spd").forEach(b => {
      b.addEventListener("click", () => {
        speed = parseInt(b.dataset.s, 10);
        LS.set(OPT_KEY, { speed, auto });
        document.querySelectorAll(".spd").forEach(x => x.classList.remove("on"));
        b.classList.add("on");
      });
      if (parseInt(b.dataset.s, 10) === speed) b.classList.add("on");
    });
    $("tglAuto").addEventListener("click", () => {
      auto = !auto;
      LS.set(OPT_KEY, { speed, auto });
      $("tglAuto").classList.toggle("on", auto);
      $("tglAuto").textContent = auto ? "おまかせ: ON" : "おまかせ: OFF";
      if (auto && S && S.pending) showPending();
    });
    $("tglAuto").classList.toggle("on", auto);
    $("tglAuto").textContent = auto ? "おまかせ: ON" : "おまかせ: OFF";
    $("btnSkip").addEventListener("click", skip);
    $("btnPause").addEventListener("click", () => {
      paused = !paused;
      $("btnPause").classList.toggle("on", paused);
      $("btnPause").textContent = paused ? "▶ 再開" : "⏸ 一時停止";
      if (paused) { clearTimeout(timer); saveLife(); }
      else schedule();
    });
    $("btnDownload").addEventListener("click", () => {
      const a = document.createElement("a");
      const r = currentShownRecord || (S ? recordFromState(S) : null);
      a.download = `2manbun_${r ? r.handle : "record"}_${r ? r.days : 0}day.png`;
      a.href = $("cardCanvas").toDataURL("image/png");
      a.click();
    });
    const copyText = r => `${r.handle}（${r.name}）\n${r.era}年参入 → ${r.endStr}・界隈歴 ${fmt(r.days)}日\n称号: ${r.title}（${r.rank}）／終わり方: ${r.endingName}\n最高フォロワー ${fmt(r.peak)}・希少度 約1/${fmt(1 / r.product)}\n#2万分の1のヒカマー https://hikamerlife.hikamers.app/`;
    $("btnCopy").addEventListener("click", async () => {
      const r = currentShownRecord || (S ? recordFromState(S) : null);
      if (!r) return;
      const t = copyText(r);
      try {
        await navigator.clipboard.writeText(t);
        toast("記録をコピーした", "hk");
      } catch (e) {
        const ta = document.createElement("textarea");
        ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); toast("記録をコピーした", "hk"); } catch (e2) { toast("コピーできなかった"); }
        ta.remove();
      }
    });
    if (navigator.share) {
      $("btnShare").style.display = "";
      $("btnShare").addEventListener("click", () => {
        const r = currentShownRecord || (S ? recordFromState(S) : null);
        if (!r) return;
        navigator.share({ text: copyText(r) }).catch(() => { });
      });
    }
    $("btnMemorial").addEventListener("click", () => { if (S && !S.ended) return; saveMemorial(); showMemorial(); });
    $("btnAlbum").addEventListener("click", openAlbum);
    $("albumClose").addEventListener("click", closeAlbum);
    $("btnFilm").addEventListener("click", startFilm);
    $("filmStop").addEventListener("click", stopFilm);
    $("filmNext").addEventListener("click", () => { if (!albumRec) return; filmIdx = (filmIdx + 1) % albumRec.lines.length; renderFilm(); });
    $("filmPrev").addEventListener("click", () => { if (!albumRec) return; filmIdx = (filmIdx - 1 + albumRec.lines.length) % albumRec.lines.length; renderFilm(); });
    $("btnPublish").addEventListener("click", publishRecord);
    $("btnLabRun").addEventListener("click", startLab);
    $("btnAgain").addEventListener("click", () => { S = null; currentShownRecord = null; show("start"); });
    $("btnAgain2").addEventListener("click", () => { S = null; currentShownRecord = null; show("start"); });
  }

  /* ---------- しくみ ---------- */
  function fillAbout() {
    const m = D().meta;
    $("aboutData").innerHTML = `
      <li>名乗り調査(2026-10-15): 界隈ネットワークの実測ハンドル1,152件のうち、<b>_mania等のマーカー付きは23.8%</b>（残り76.2%は無印名義）。ヒカマーの名乗りは「_mania」だけではない</li>
      <li>Wiki「ヒカマー一覧」を実測: <b>1,266件</b>（うちマーカー風 約46%・bot系49件）</li>
      <li>マーカー限定の捕獲再捕獲 ≈ 1,300〜4,300 → マーカー比率で割り戻した全ヒカマー ≈ <b>3,000〜8,000人（代表値5,000）</b></li>
      <li>日本のネット人口 約1億人 ÷ 5,000 ≒ <b>2万分の1</b>（幅を取ると1.3万〜3万分の1）＝ タイトルの根拠</li>
      <li>参考: ツイッタラ世論調査「ヒカマー」= 951票・総合2.97・肯定55.4%</li>
      <li>ヒカマーWiki 記事${m.wikiArticles}・利用者187（2026-08）／Hikabooru 投稿${fmt(m.booruPosts)}件・タグ${fmt(m.booruTags)}件／ニコニコ「Hikakin_mania」${fmt(m.nicoHikamani)}本／8values ${m.f8values}件</li>
      <li>時代・事件の記述は、ヒカマーWiki（ヒカマー史・炎上一覧・内戦一覧・Handbooks）と810chの実データに基づく</li>`;
  }

  function init() {
    bindStart(); bindNav(); bindControls(); bindLive(); fillAbout();
    const labEra = $("labEra");
    D().eras.forEach(e => { const o = document.createElement("option"); o.value = e.year; o.textContent = `${e.year}年（${e.name}）`; labEra.appendChild(o); });
    const labPath = $("labPath");
    D().paths.forEach(p => { const o = document.createElement("option"); o.value = p.id; o.textContent = p.label; labPath.appendChild(o); });
    const labAge = $("labAge");
    for (let a = 10; a <= 32; a++) { const o = document.createElement("option"); o.value = a; o.textContent = a + "歳"; labAge.appendChild(o); }
    window.addEventListener("pagehide", saveLife);
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") saveLife(); });
    refreshResumeBtn();
    show("start");
  }
  document.addEventListener("DOMContentLoaded", init);
})();
