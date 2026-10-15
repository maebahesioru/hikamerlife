/* =========================================================
   4万分の1のヒカマー v2 — UI（日単位・時代くじ・引退エンド）
   ========================================================= */
window.HK = window.HK || {};

(function () {
  "use strict";
  const D = () => HK.DATA2;
  const $ = id => document.getElementById(id);
  const fmt = n => Math.round(n).toLocaleString("ja-JP");

  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  };
  const MEM_KEY = "hk4m2.memorial";
  const ZUK_KEY = "hk4m2.zukan";
  const TIT_KEY = "hk4m2.titles";
  const OPT_KEY = "hk4m2.opts";

  let S = null;
  let timer = null;
  let paused = false;
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
      startGame(opts);
    });
  }

  function startGame(opts) {
    S = HK.engine2.newGame(opts);
    window.__S = S;
    $("lifeTitleSub").textContent = `第${LS.get("hk4m2.plays", 0) + 1}回の界隈歴`;
    LS.set("hk4m2.plays", LS.get("hk4m2.plays", 0) + 1);
    hideModal();
    renderAll();
    show("life");
    schedule(300);
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
    renderHeader(); renderStats(); renderHk(); renderFocus(); renderLog(); renderComp(); renderMap(); renderSurv();
  }
  function renderHeader() {
    $("lifeHandle").textContent = S.handle;
    $("lifeAge").textContent = S.age + "歳";
    $("lifeYear").textContent = HK.engine2.fmtDate(S.date);
    $("lifeDay").textContent = "Day " + S.dayNum;
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
      return `<div class="comp"><b>${esc(c.name)}</b><span class="dim">${S.dayNum >= c.next - 40 ? st : "…"}</span></div>`;
    }).join("");
  }
  function renderMap() {
    // 1マス=1週（7日）
    const weeks = [];
    for (let w = 0; w * 7 < Math.max(S.dayNum, 1); w++) {
      const slice = S.days.filter(d => d.day >= w * 7 && d.day < (w + 1) * 7);
      const avg = slice.length ? slice.reduce((a, b) => a + b.happy, 0) / slice.length : null;
      weeks.push(avg == null ? "m0" : avg >= 66 ? "m3" : avg >= 44 ? "m2" : avg >= 25 ? "m1" : "m0");
    }
    $("mapBox").innerHTML = `<div class="mapgrid">${weeks.map(w => `<i class="${w}"></i>`).join("") || "<span class='dim small'>—</span>"}</div><div class="dim small">1マス=1週（色=幸福）</div>`;
  }
  function renderSurv() {
    const n = S.dayNum;
    const W = 260, H = 90, maxN = Math.max(90, Math.ceil((n + 30) / 30) * 30);
    const pts = [], ypts = [];
    for (let i = 0; i <= maxN; i += 5) {
      const x = 8 + (W - 16) * i / maxN;
      const p = Math.exp(-i / 550);
      pts.push(`${x.toFixed(1)},${(H - 12 - (H - 24) * p).toFixed(1)}`);
      ypts.push(`${x.toFixed(1)},${H - 12}`);
    }
    const xYou = 8 + (W - 16) * n / maxN;
    $("survBox").innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" class="surv">
        <polyline points="${pts.join(" ")}" class="surv-line" />
        <circle cx="${xYou.toFixed(1)}" cy="${(H - 12 - (H - 24) * (S.faded ? 0.2 : 1)).toFixed(1)}" r="3.5" class="surv-you" />
      </svg>
      <div class="dim small">モデル: 継続率=e^(−日数/550)。界隈の平均寿命「2〜3年」を近似。●があなた。</div>`;
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
    const starLines = [];
    const seen = new Set();
    Object.keys(S.starred).forEach(i => {
      const l = S.log[Number(i)];
      if (l && !seen.has(l.text.slice(0, 40))) {
        seen.add(l.text.slice(0, 40));
        starLines.push(`「${l.text.slice(0, 90)}」（${l.day}日目）`);
      }
    });
    if (!starLines.length) {
      const mem = S.log.filter(l => ["hk", "decision", "doxx", "debut", "milestone", "ending", "freeze"].includes(l.kind));
      for (let i = 0; i < 3 && mem.length; i++) {
        const pick = mem.splice(Math.floor(Math.random() * mem.length), 1)[0];
        const key = pick.text.slice(0, 40);
        if (seen.has(key)) continue;
        seen.add(key);
        starLines.push(`「${pick.text.slice(0, 90)}」（${pick.day}日目）`);
      }
    }
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
    $("memList").innerHTML = list.length ? list.map((m, i) => `
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
      </div>`).join("") : `<div class="dim">まだ、ここに界隈歴はない。</div>`;
    document.querySelectorAll("[data-act]").forEach(b => {
      b.onclick = () => {
        const list = LS.get(MEM_KEY, []);
        const m = list[Number(b.dataset.idx)];
        if (!m) return;
        if (b.dataset.act === "candle") { m.candles = (m.candles || 0) + 1; LS.set(MEM_KEY, list); b.textContent = "🕯 " + m.candles; }
        else { renderEndingRecord(m); }
      };
    });
    show("memorial");
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
      if (paused) clearTimeout(timer);
      else schedule();
    });
    $("btnDownload").addEventListener("click", () => {
      const a = document.createElement("a");
      const r = currentShownRecord || (S ? recordFromState(S) : null);
      a.download = `4manbun_${r ? r.handle : "record"}_${r ? r.days : 0}day.png`;
      a.href = $("cardCanvas").toDataURL("image/png");
      a.click();
    });
    $("btnMemorial").addEventListener("click", () => { if (S && !S.ended) return; saveMemorial(); showMemorial(); });
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
    show("start");
  }
  document.addEventListener("DOMContentLoaded", init);
})();
