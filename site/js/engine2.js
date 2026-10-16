/* =========================================================
   10万分の1のヒカマー v3 — エンジン（日単位・時代くじ・引退エンド）
   ========================================================= */
window.HK = window.HK || {};

(function () {
  "use strict";
  const D = () => HK.DATA2;
  const DAY = 86400000;

  /* ---------- RNG ---------- */
  class RNG {
    constructor(seed) { this._a = seed | 0; }   // _a = 現在の内部状態（保存/復元に使う）
    next() {
      let a = (this._a + 0x6D2B79F5) | 0;
      this._a = a;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    range(a, b) { return a + this.next() * (b - a); }
    int(a, b) { return Math.floor(this.range(a, b + 1)); }
    pick(arr) { return arr[Math.floor(this.next() * arr.length)]; }
    wpick(arr, wf) {
      const ws = arr.map(wf); const sum = ws.reduce((x, y) => x + y, 0);
      let r = this.next() * sum;
      for (let i = 0; i < arr.length; i++) { r -= ws[i]; if (r <= 0) return arr[i]; }
      return arr[arr.length - 1];
    }
    chance(p) { return this.next() < p; }
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmtDate = d => `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;

  function renderText(t, S) {
    return t.replaceAll("{h}", S.handle).replaceAll("{n}", S.name)
      .replaceAll("{era}", String(S.era.year)).replaceAll("{day}", String(S.dayNum))
      .replaceAll("{pref}", S.pref).replaceAll("{cat}", S.catName || "猫");
  }

  /* ---------- 参入くじ ---------- */
  function newGame(opts) {
    opts = opts || {};
    const seed = opts.seed != null ? opts.seed : (Date.now() % 2147483647);
    const rng = new RNG(seed);
    const era = opts.era != null ? D().eras.find(e => e.year === opts.era) || D().eras[7] : rng.pick(D().eras);
    const startAge = opts.age != null ? opts.age
      : (rng.chance(0.72) ? rng.int(10, 18) : rng.chance(0.68) ? rng.int(19, 24) : rng.int(25, 32));
    const sex = opts.sex || (rng.chance(0.92) ? "m" : "f");
    const pref = rng.wpick(D().prefs, p => p[1])[0];
    const family = rng.wpick(D().families, f => f.w);
    const net = rng.wpick(D().nets, n => n.w);
    const sibling = rng.pick(D().siblings);
    const qualities = { action: rng.int(5, 95), intel: rng.int(5, 95), influence: rng.int(5, 95), stamina: rng.int(5, 95), mental: rng.int(5, 95), luck: rng.int(5, 95) };
    const given = sex === "m" ? rng.pick(D().givenNamesM) : rng.pick(D().givenNamesF);
    const name = opts.name || (rng.pick(D().familyNames) + " " + given);
    const handle = opts.handle || makeHandle(rng);
    const startDate = new Date(era.year, rng.int(0, 11), rng.int(1, 28));
    const real = (opts.realEra || opts.realAge) ? { era: opts.realEra || null, age: opts.realAge || null } : null;
    const path = opts.path ? (D().paths.find(p => p.id === opts.path) || D().paths[0])
      : rng.wpick(D().paths, p => p.w);
    const trigger = opts.trigger ? (D().triggers.find(t => t.id === opts.trigger) || D().triggers[0])
      : rng.wpick(D().triggers, t => t.w);

    const S = {
      seed, rng, sex, pref, family, net, sibling, qualities, name, handle, startAge,
      pathId: path.id, triggerId: trigger.id,
      era, startDate, date: startDate, dayNum: 0, age: startAge, real,
      stats: { hp: rng.int(60, 85), happy: rng.int(55, 80), know: clamp(rng.int(35, 60) + Math.round((qualities.intel - 50) / 10), 0, 100), rel: rng.int(50, 75), mental: clamp(rng.int(55, 85) + Math.round((qualities.mental - 50) / 10), 0, 100) },
      hk: {
        followers: rng.int(1, 4) + (path.fx.followers || 0) + Math.max(0, Math.round((qualities.influence - 50) / 25)), peakFollowers: 0, goroku: rng.int(1, 5) + (path.fx.goroku || 0),
        skill: Math.round((qualities.action + qualities.intel + qualities.stamina) / 15) + (net.tech || 0),
        fameRisk: family.monitor || 4, banRisk: 0, nareai: 0, edge: 0, dev: 0, freezes: 0,
        retireCount: (path.fx.retireCount || 0), doxxed: false
      },
      money: family.money0,
      focus: "none",
      heat: clamp(55 + Math.round((qualities.stamina - 50) / 10), 40, 70),
      faded: false,
      lowHeatDays: 0,
      flags: [],
      log: [],
      days: [],
      notes: [],
      starred: {},
      pending: null,
      ended: false,
      encounterP: clamp(0.25 + ((net.tier != null ? net.tier : 1) - 1) * 0.08 + (qualities.luck - 50) / 400, 0.1, 0.55),
      companions: [],
      _once: {},
      _lastEv: {},
      _calDone: {},
      _decDay: -99,
      _milestones: {},
      _zukan: {},
      _bought: {}
    };
    // 生きる範囲（界隈歴 / 0歳から）
    if (opts.mode === "life") { S.mode = "life"; S.child = true; S.entryAge = 13; S.startAge = 0; S.age = 0; }
    else S.mode = "kaimai";
    // 参入の経緯・きっかけの残りを適用
    if (path.fx.heat) S.heat = clamp(S.heat + path.fx.heat, 0, 100);
    if (path.fx.edge) S.hk.edge = clamp(S.hk.edge + path.fx.edge, 0, 100);
    if (path.fx.dev) S.hk.dev = clamp(S.hk.dev + path.fx.dev, 0, 100);
    if (path.fx.nareai) S.hk.nareai = clamp(S.hk.nareai + path.fx.nareai, -100, 100);
    if (path.fx.flags) path.fx.flags.forEach(f => S.flags.push(f));
    if (trigger.fx) {
      const t = trigger.fx;
      if (t.goroku) S.hk.goroku = clamp(S.hk.goroku + t.goroku, 0, 100);
      if (t.happy) S.stats.happy = clamp(S.stats.happy + t.happy, 0, 100);
      if (t.rel) S.stats.rel = clamp(S.stats.rel + t.rel, 0, 100);
      if (t.know) S.stats.know = clamp(S.stats.know + t.know, 0, 100);
      if (t.dev) S.hk.dev = clamp(S.hk.dev + t.dev, 0, 100);
      if (t.skill) S.hk.skill = clamp(S.hk.skill + t.skill, 0, 100);
    }
    // 仲間（人数ランダム・名乗りも多様）
    const nComp = rng.int(1, 12);
    const used = new Set();
    for (let i = 0; i < nComp; i++) {
      let nm = makeHandle(rng), guard = 0;
      while (used.has(nm) && guard++ < 30) nm = makeHandle(rng);
      used.add(nm);
      const arc = rng.pick(D().compArcs);
      S.companions.push({ name: nm, arc: arc.id, lines: arc.lines, stage: 0, next: rng.int(2, 20), followers: rng.int(3, 100) });
    }
    if (S.mode === "life") {
      pushLog(S, "birth", `${era.year}年、${pref}。${family.label}の家に、あなたは生まれた。まだ、ネットの「ネ」の字も知らない。`);
    } else {
      pushLog(S, "birth", `${era.year}年（${era.name}）、${fmtDate(startDate)}。${pref}、${family.label}、${net.label}。${startAge}歳のあなたは「${handle}」として、#新参ヒカマー で挨拶した。参入のきっかけは、${trigger.label}。`);
      if (path.id === "reinc") pushLog(S, "debut", "この垢は転生垢だ。前の名前を覚えている人は、もうほとんどいない。");
      if (path.id === "transfer") pushLog(S, "debut", "元いた界隈のノリが、まだ少し残っている。この海の言葉を、ひとつずつ覚え直す。");
      pushLog(S, "debut", "数分後、通知がついた。「はじめまして、そ決」。界隈の扉が、静かに開いた。");
      unlockZukan(S, "c6");
    }
    unlockZukan(S, eraId(era.year));
    return S;
  }

  function eraId(y) { return "t" + y; }
  function makeHandle(rng) {
    const noun = rng.pick(D().handleNouns);
    const mod = rng.pick(D().handleMods);
    const romaji = rng.pick(D().romaji || ["hikari", "sakura", "kumo"]);
    const ext = rng.pick(D().extendWords || ["jaywalk", "osakana"]);
    const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
    const num = () => String(rng.int(1, 9999));
    const pats = D().handlePatterns || [];
    const pat = pats.length ? rng.wpick(pats, p => p.w).id : "mania_u";
    switch (pat) {
      case "mania_u": return noun + mod + "_mania";
      case "mania": return ext + "mania";
      case "mania_end": return noun + "mania";
      case "manila": return noun + "_manila";
      case "mani": return rng.chance(0.5) ? noun + "_mani" : noun + "mani";
      case "mani_jp": return noun + (rng.chance(0.5) ? "マニ" : "まに");
      case "mania_jp": return noun + "マニア";
      case "kin": return rng.pick([noun + "キン", cap(romaji) + "kin", "キン" + noun]);
      case "tv": return rng.pick([noun + "TV", noun + "キンTV", cap(romaji) + "KinTV"]);
      case "bot": return rng.pick([noun + "bot", noun + "名言bot", noun + "_bot"]);
      case "dotted": {
        const K = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワ";
        let out = "";
        const len = rng.int(4, 6);
        for (let i = 0; i < len; i++) out += K[rng.int(0, K.length - 1)] + (i < len - 1 ? "." : ".");
        return out;
      }
      default: {
        let r2 = rng.pick(D().romaji);
        if (r2 === romaji) {
          const alt = D().romaji.filter(x => x !== romaji);
          r2 = alt.length ? rng.pick(alt) : romaji;
        }
        return rng.pick([romaji + num(), romaji + "_" + r2, noun + num(), cap(romaji)]);
      }
    }
  }

  /* ---------- ログ ---------- */
  function pushLog(S, kind, text) {
    S.log.push({ day: S.dayNum, date: fmtDate(S.date), age: S.age, era: S.era.year, kind, text });
  }

  /* ---------- 図鑑 ---------- */
  function unlockZukan(S, id) {
    if (!S._zukan) S._zukan = {};
    if (!S._zukan[id]) {
      S._zukan[id] = true;
      const entry = D().zukan.find(z => z.id === id);
      if (entry) pushLog(S, "zukan", `図鑑に追記: 〔${entry.cat}〕${entry.name}`);
      try {
        const z = JSON.parse(localStorage.getItem("hk4m2.zukan") || "{}");
        z[id] = true;
        localStorage.setItem("hk4m2.zukan", JSON.stringify(z));
      } catch (e) { }
    }
  }
  const UMAP = [
    [["制裁"], ["c1"]], [["アルカイダ"], ["c2"]], [["おもちゃ"], ["c3"]], [["ノリチガ"], ["c4"]], [["自治厨"], ["c5"]],
    [["新参"], ["c6"]], [["馴れ合い"], ["c7"]], [["ROM", "ロム"], ["c8"]], [["泡沫"], ["c10"]], [["有産"], ["c11"]],
    [["嫌儲", "収益化"], ["c12"]], [["開発", "発掘"], ["c13"]], [["顔", "自撮り"], ["c14"]], [["エンカ", "オフ会"], ["c15"]],
    [["開示"], ["c16", "p9"]], [["レスバ"], ["c17"]], [["5.11", "凍結"], ["c18"]], [["内戦"], ["c19"]],
    [["デジ凸", "凸"], ["c20"]], [["810", "掲示板"], ["p1"]], [["Wiki", "wiki"], ["p2"]], [["野獣"], ["p3"]], [["開発邸"], ["p4"]],
    [["サンサン", "スペース"], ["p5"]], [["Hikabooru", "booru", "素材"], ["p6"]], [["新聞"], ["p7"]], [["8values"], ["p8"]],
    [["お台場"], ["e1"]], [["デモ"], ["e2"]], [["ONICHA", "麦茶"], ["e3", "g2"]], [["ザビャン"], ["e4"]], [["wplace"], ["e5"]],
    [["諸岡", "老坂"], ["e7"]], [["野獣の日"], ["e8"]], [["レコード"], ["e9"]], [["ニコチン"], ["h1"]], [["唯一神"], ["h2"]],
    [["さくれい"], ["h4"]], [["開発光"], ["h5"]], [["エッチキン"], ["h6"]], [["小川泰平"], ["h7"]], [["クラウド"], ["h9"]],
    [["例のアレ"], ["c0"]], [["ヒカマニ", "Hikakin"], ["c21"]], [["名無し"], ["c22"]], [["ツイフィール"], ["p10"]],
    [["効率", "x"], [""]]
  ];
  function unlockFromText(S, text) {
    for (const [keys, ids] of UMAP) {
      if (ids[0] === "") continue;
      if (keys.some(k => k !== "x" && text.includes(k))) ids.forEach(id => id && unlockZukan(S, id));
    }
  }

  /* ---------- 効果適用 ---------- */
  function applyFx(S, fx) {
    if (!fx) return;
    const st = S.stats, hk = S.hk;
    const add = (k, v) => { if (st[k] != null) st[k] = clamp(st[k] + v, 0, 100); };
    ["hp", "happy", "know", "rel", "mental"].forEach(k => { if (fx[k]) add(k, fx[k]); });
    if (fx.money) S.money += fx.money;
    if (fx.fame) hk.followers = Math.max(0, hk.followers + fx.fame);
    if (fx.goroku) hk.goroku = clamp(hk.goroku + fx.goroku, 0, 100);
    if (fx.skill) hk.skill = clamp(hk.skill + fx.skill, 0, 100);
    if (fx.fameRisk) hk.fameRisk = clamp(hk.fameRisk + fx.fameRisk, 0, 100);
    if (fx.banRisk) hk.banRisk = clamp(hk.banRisk + fx.banRisk, 0, 100);
    if (fx.nareai) hk.nareai = clamp(hk.nareai + fx.nareai, -100, 100);
    if (fx.edge) hk.edge = clamp(hk.edge + fx.edge, 0, 100);
    if (fx.dev) hk.dev = clamp(hk.dev + fx.dev, 0, 100);
    if (fx.heat) S.heat = clamp(S.heat + fx.heat, 0, 100);
    if (fx.flags) fx.flags.forEach(f => { if (!S.flags.includes(f)) S.flags.push(f); });
    if (fx.zukan) fx.zukan.forEach(id => unlockZukan(S, id));
    if (fx.fac !== undefined) S.fac = fx.fac === "auto" ? ["masuma", "ozeu", "neonazi", "ss"][Math.floor(S.rng.next() * 4)] : (fx.fac || null);
    if (fx.catName !== undefined) S.catName = fx.catName;
    if (fx.viral) S._virals = (S._virals || 0) + 1;
    if (fx.end) endGame(S, fx.end);
    hk.peakFollowers = Math.max(hk.peakFollowers, hk.followers);
  }

  /* ---------- 日次更新 ---------- */
  function dailyUpdate(S) {
    const hk = S.hk;
    const focus = D().focuses.find(f => f.id === S.focus) || D().focuses[0];
    // 熱量（重点によって回復量が変わる）
    const regen = { none: 0.45, nareai: 0.65, sakusei: 0.6, seisai: 0.65, rom: 0.12, real: 0.08, politics: 0.5, alqaeda: 0.6, factdev: 0.55, toolwork: 0.55, sales: 0.6, offline: 0.55 }[S.focus] || 0.3;
    S.heat = clamp(S.heat - 0.55 + regen, 0, 100);
    if (S.heat < 6) {
      S.lowHeatDays++;
      if (!S.faded && S.lowHeatDays > 10) {
        S.faded = true;
        pushLog(S, "fade", "投稿が数日空いた。指が、少しずつ重くなっていく。垢は消していない。消せなかっただけだ。");
      }
    } else { S.lowHeatDays = 0; if (S.faded && S.heat > 25) { S.faded = false; pushLog(S, "hk", "また指が動くようになった。TLは待っていてくれた。"); } }

    // フォロワー成長
    if (!S.faded) {
      const ysj = S.dayNum;
      const ageK = S.age <= 17 ? 1.15 : S.age <= 22 ? 1.0 : 0.7;
      const base = 0.08 + hk.skill * 0.006 + hk.goroku * 0.005 + Math.max(0, hk.nareai) / 180;
      const activity = clamp(S.heat / 60, 0.3, 1.2);
      const fresh = 1 + Math.max(0, (60 - ysj)) / 120;      // 参入直後は伸びやすい
      const eraK = S.era.popK;
      const luckK = 0.7 + S.qualities.luck / 100 * 0.7;
      let g = base * focus.followK * activity * fresh * eraK * luckK * ageK * S.rng.range(0.5, 1.8);
      // 実力由来の天井（バズ以外では越えにくい）
      const ceil = 100 + hk.skill * 30 + hk.goroku * 18 + Math.max(0, hk.nareai) * 3;
      g *= clamp(1 - hk.followers / Math.max(ceil, 60), 0.03, 1);
      if (S.dayNum > 900) g *= Math.max(0.25, 1 - (S.dayNum - 900) / 1500);
      hk.followers = Math.max(0, Math.round(hk.followers + g));
      // スキル・語録のmicro成長
      if (S.rng.chance(0.02 * focus.skillK)) hk.skill = clamp(hk.skill + 1, 0, 100);
      if (S.dayNum < 120 && S.rng.chance(0.05 * focus.nareaiK)) hk.goroku = clamp(hk.goroku + 1, 0, 100);
      hk.nareai = clamp(hk.nareai + (focus.id === "nareai" ? 0.06 : 0.01), -100, 100);
      hk.edge = clamp(hk.edge + (focus.id === "seisai" ? 0.04 : 0.005), 0, 100);
    } else {
      hk.followers = Math.max(0, Math.round(hk.followers * 0.998));
    }
    // リスク
    let riskK = focus.riskK * (S.era.riskK || 1);
    // 季節: 5.11前後と7月中旬は凍結の風が吹く
    const mo = S.date.getMonth() + 1, dd = S.date.getDate();
    if ((mo === 5 && dd >= 5 && dd <= 18) || (mo === 7 && dd >= 12 && dd <= 22)) riskK *= 1.7;
    hk.banRisk = clamp(hk.banRisk + (hk.edge > 45 ? 0.05 : 0.015) * riskK, 0, 100);
    if (hk.followers > 3000) hk.fameRisk = clamp(hk.fameRisk + 0.02 * riskK, 0, 100);
    hk.peakFollowers = Math.max(hk.peakFollowers, hk.followers);

    // 週次ドリフト
    if (S.dayNum % 7 === 0) {
      S.stats.happy = clamp(S.stats.happy - (S.heat > 35 ? 0 : 1) + (S.stats.rel >= 60 ? 1 : 0), 0, 100);
      S.stats.rel = clamp(S.stats.rel - 0.5, 0, 100);
      S.stats.mental = clamp(S.stats.mental + (S.stats.happy > 65 ? 1 : S.stats.happy < 40 ? -1 : 0), 0, 100);
      if (S.age >= 15 && S.dayNum % 28 === 0 && S.rng.chance(0.5)) S.stats.hp = clamp(S.stats.hp - 1, 0, 100);
      if (S.focus === "real") S.stats.know = clamp(S.stats.know + 1, 0, 100);
    }
    // 月次お金
    if (S.dayNum % 30 === 0) {
      if (S.age >= 16 && S.flags.includes("baito")) S.money += 30000;
      else if (S.age >= 18) S.money += 120000;
      if (S.flags.includes("afi")) S.money += 40000;
      S.money -= 15000 + S.rng.int(0, 20000);
    }
  }

  /* ---------- イベント抽選 ---------- */
  const arrOf = v => Array.isArray(v) ? v : (v == null ? null : [v]);
  function eligible(S, ev) {
    if (ev.once && S._once[ev.id]) return false;
    if (S._lastEv && S.dayNum - (S._lastEv[ev.id] || -9999) < (ev.cool || 14)) return false;
    const [a, b] = ev.d || [0, 99999];
    if (S.dayNum < a || S.dayNum > b) return false;
    if (ev.era && (S.era.year < ev.era[0] || S.era.year > ev.era[1])) return false;
    const mo = arrOf(ev.m);
    if (mo && !mo.includes(S.date.getMonth() + 1)) return false;
    if (ev.cond && !ev.cond(S)) return false;
    return true;
  }
  function rollEvents(S) {
    const out = [];
    // 暦イベント
    const curM = S.date.getMonth() + 1, curD = S.date.getDate();
    for (const ev of HK.CAL_EVENTS) {
      const mo = arrOf(ev.m), dd = arrOf(ev.d);
      if (mo && mo.includes(curM) && dd && dd.includes(curD)) {
        const key = `${S.date.getFullYear()}:${ev.id}`;
        if (S._calDone[key]) continue;
        if (ev.era && (S.era.year < ev.era[0] || S.era.year > ev.era[1])) continue;
        S._calDone[key] = true;
        out.push(ev);
      }
    }
    // 通常
    const heatK = S.heat > 40 ? 1 : S.heat > 15 ? 0.6 : 0.25;
    const n = (S.rng.chance(0.5 * heatK) ? 1 : 0) + (S.rng.chance(0.16 * heatK) ? 1 : 0);
    for (let i = 0; i < n; i++) {
      const pool = HK.EVENTS2.filter(e => eligible(S, e));
      if (!pool.length) break;
      const ev = S.rng.wpick(pool, e => e.w || 1);
      S._lastEv[ev.id] = S.dayNum;
      if (ev.once) S._once[ev.id] = true;
      out.push(ev);
    }
    return out.slice(0, 3);
  }
  function pickDecision(S) {
    if (S.dayNum - S._decDay < 9) return null;
    const pool = HK.DECISIONS2.filter(d => eligible(S, d));
    if (!pool.length) return null;
    if (S.rng.chance(0.05)) {
      const dec = S.rng.wpick(pool, d => d.w || 1);
      S._lastEv[dec.id] = S.dayNum;
      if (dec.once) S._once[dec.id] = true;
      S._decDay = S.dayNum;
      return dec;
    }
    return null;
  }

  /* ---------- 節目 ---------- */
  function milestones(S) {
    const B = D().breaths;
    if (B[S.dayNum] && !S._milestones["b" + S.dayNum]) {
      S._milestones["b" + S.dayNum] = true;
      S.pending = { kind: "breather", q: B[S.dayNum], day: S.dayNum };
    }
    // フォロワー節目
    const ths = [100, 500, 1000, 5000, 10000, 20000];
    for (const t of ths) {
      const key = "f" + t;
      if (!S._milestones[key] && S.hk.followers >= t) {
        S._milestones[key] = true;
        pushLog(S, "milestone", `フォロワー${t.toLocaleString()}人を超えた。`);
      }
    }
  }

  /* ---------- 死亡しない世界の「終わり」 ---------- */
  function endGame(S, type) {
    if (S.ended) return;
    S.ended = true;
    S.ending = D().endings.find(e => e.id === type) || D().endings[0];
    // 称号
    S.title = evalTitle(S);
    S.prob = probChain(S);
    const endLine = {
      retire: "あなたは引退の投稿をした。「今までありがとうございました」。構文通りであることを、誰より自分が分かっていた。",
      fade: "ある日を境に、あなたの投稿は止まった。喧嘩もなく、卒業式もなく、泡は静かに消えた。",
      graduated: "スマホを引き出しにしまった。勉強、部活、進路。現実が本業になった。",
      expelled: "居場所がなくなった。TLを去るボタンはないから、あなたはただ、開かなくなった。",
      burned: "凍結と疲れが積もって、あなたは画面を閉じた。垢は残っている。それだけのことが、少しだけ救いだった。",
      veteran_end: "5年。もはや界隈の化石だ。あなたは静かに画面を閉じ、長すぎた界隈歴に自分で幕を引いた。",
      account_delete: "ポストを一つずつ消した。消し終えた画面は、生まれたてのアカウントみたいに真っ白だった。",
      immigrate: "別の界隈の空気は、最初だけ匂いが違った。すぐに慣れる。ネットはどこも同じ海だ。",
      ghost: "垢は残した。フォローも残した。ただ、話さなくなった。たまに、いいねだけがつく。",
      rest: "「しばらくお休みします」。その「しばらく」の時計は、まだ動いている。",
      burnout: "燃え尽きたのは、ある朝だった。理由はなく、ただ、火がなかった。薪はあったのに。",
      quake: "夜中、大きな地震が来た。界隈は動き続けていて、あなただけが、動けなくなった。",
      bear: "クマの目撃情報は、出ていたらしい。あなたの最後の投稿は、山の写真だった。",
      doxxing: "開示され、静かに消えた。ネットの履歴は、現実の住所より速く人に届く。",
      nori_chigai: "「ノリ違」——たった三文字の烙印で、あなたの言葉は誰にも届かなくなった。",
      afiliend: "収益は増え続けた。界隈の友達は、もう誰もDMを返さない。",
      face: "顔が晒された。界隈歴は、そこで強制的に終わった。",
      ban: "凍結の嵐が吹いた日、あなたの垢もまとめて持って行かれた。抵抗の手段は、なかった。",
      tsuiwaste: "気づけば、TLが人生そのものになっていた。あなたの一日は、通知欄から始まる。",
      lawsuit: "法廷は、句読点まで読み込む場所だった。ネットの言葉が、紙になって返ってきた。",
      seisai_end: "制裁の雨は、三日で止まらなかった。傘を探しているうちに、あなたの界隈歴は終わっていた。"
    }[type] || "あなたの界隈歴は、ここで一区切りついた。";
    pushLog(S, "ending", endLine);
  }

  function evalTitle(S) {
    const check = (t) => {
      try {
        if (!/^[\w\s<>=!&|().+*\[\]"'%,-]+$/.test(t.cond)) return false;
        const f = new Function("S", "fame", "nareai", "skill", "goroku", "edge", "mental", "days", "era", "freezes", "retireCount", "flags",
          `return (${t.cond});`);
        return f(S, S.hk.peakFollowers, S.hk.nareai, S.hk.skill, S.hk.goroku, S.hk.edge, S.stats.mental, S.dayNum, S.era.year, S.hk.freezes, S.hk.retireCount, S.flags);
      } catch (e) { return false; }
    };
    for (const t of D().titles) { if (check(t)) return t; }
    return D().titles[D().titles.length - 1];
  }

  function probChain(S) {
    const chain = [];
    chain.push({ label: "世界に生まれる", p: 1 });
    chain.push({ label: "日本に生まれる", p: 1.23e8 / 8.2e9 });
    chain.push({ label: "ネットでヒカマニに出会う", p: S.encounterP });
    chain.push({ label: "#新参ヒカマー をする", p: 0.45 });
    const surv = Math.exp(-S.dayNum / 550);
    chain.push({ label: `${S.dayNum}日続ける`, p: clamp(surv, 0.002, 1) });
    if (S.hk.peakFollowers >= 1000) chain.push({ label: "フォロワー1,000人を超える", p: 0.07 });
    if (S.hk.peakFollowers >= 10000) chain.push({ label: "フォロワー10,000人を超える", p: 0.008 });
    if (S.flags.includes("doxxed")) chain.push({ label: "特定される", p: 0.30 });
    let prod = 1;
    chain.forEach(c => {
      const inv = c.p >= 1 ? 1 : 1 / Math.max(c.p, 1e-9);
      c.inv = inv >= 100 ? Math.round(inv) : (inv >= 10 ? Math.round(inv * 10) / 10 : Math.round(inv * 100) / 100);
      prod *= (1 / c.inv);
    });
    return { chain, product: prod };
  }

  /* ---------- 凍結・特定 ---------- */
  function risks(S) {
    const hk = S.hk;
    // 特定（住所特定祭りの季節だけ発生する）
    const doxxSeason = [3, 4, 9, 10].includes(S.date.getMonth() + 1);
    if (hk.fameRisk >= 75 && doxxSeason && !S._once["doxx_event"]) {
      if (S.rng.chance(0.004)) {
        S._once["doxx_event"] = true;
        hk.doxxed = true;
        S.flags.push("doxxed");
        S.stats.mental = clamp(S.stats.mental - 20, 0, 100);
        S.stats.happy = clamp(S.stats.happy - 10, 0, 100);
        hk.fameRisk = clamp(hk.fameRisk - 45, 0, 100);
        pushLog(S, "doxx", "住所特定祭りが、あなたに届いた。「自分語り」「自撮り」「位置情報」——積み上げが、ひとつのツリーにまとめられていた。夜、カーテンを閉めて、部屋の電気を消した。 ／ これはゲームです。現実で怖い思いをしたら、ひとりで抱えないで。");
        unlockZukan(S, "c14");
      }
    }
    // 凍結
    const wave = (S.date.getMonth() + 1 === 5 && S.date.getDate() >= 9 && S.date.getDate() <= 13)
      || (S.date.getMonth() + 1 === 7 && S.date.getDate() >= 15 && S.date.getDate() <= 19);
    const fp = (hk.banRisk >= 80 ? 0.012 : hk.banRisk >= 55 ? 0.004 : 0.0006) * (wave ? 2.2 : 1);
    if (S.rng.chance(fp)) {
      hk.freezes++;
      hk.banRisk = clamp(hk.banRisk - 40, 0, 100);
      hk.followers = Math.round(hk.followers * (0.1 + S.rng.range(0, 0.2)));
      S.stats.mental = clamp(S.stats.mental - 10, 0, 100);
      S.heat = clamp(S.heat - 15, 0, 100);
      pushLog(S, "freeze", `あなたのアカウントは凍結された。${hk.freezes}回目。一晩で「あなた」が消えた。通知欄は、からっぽになった。`);
      unlockZukan(S, "c18");
      if (hk.freezes >= 4 && S.stats.mental < 30) { endGame(S, "burned"); return; }
      if (S.rng.chance(0.8)) S.pending = { kind: "revive" };
    }
  }

  /* ---------- 0歳からの参入（13歳で界隈デビュー） ---------- */
  function entryLife(S) {
    const p = D().paths.find(x => x.id === S.pathId) || { label: "—" };
    const t = D().triggers.find(x => x.id === S.triggerId) || { label: "—" };
    pushLog(S, "birth", `${fmtDate(S.date)}。${S.entryAge}歳になったあなたは「${S.handle}」として、#新参ヒカマー で挨拶した。参入のきっかけは、${t.label}。`);
    if (p.id === "reinc") pushLog(S, "debut", "この垢は転生垢だ。前の名前を覚えている人は、もうほとんどいない。");
    if (p.id === "transfer") pushLog(S, "debut", "元いた界隈のノリが、まだ少し残っている。この海の言葉を、ひとつずつ覚え直す。");
    pushLog(S, "debut", "数分後、通知がついた。「はじめまして、そ決」。界隈の扉が、静かに開いた。");
    S.heat = clamp(S.heat + 10, 0, 100);
    unlockZukan(S, "c6");
  }

  /* ---------- 1日進める ---------- */
  function step(S) {
    if (S.ended) return { status: "ended" };
    if (S.pending) return { status: "waiting", pending: S.pending };

    S.dayNum++;
    S.date = new Date(S.startDate.getTime() + S.dayNum * DAY);

    // 0歳からの人生：幼少期フェーズ（220日かけて13歳になる）
    if (S.mode === "life" && S.child) {
      S.age = Math.min(S.entryAge, Math.floor(S.dayNum / 220 * S.entryAge));
      if (HK.CHILD_EVENTS && HK.CHILD_EVENTS.length && S.rng.chance(0.5)) {
        const pool = HK.CHILD_EVENTS.filter(e => eligible(S, e));
        if (pool.length) {
          const ev = S.rng.wpick(pool, e => e.w || 1);
          S._lastEv[ev.id] = S.dayNum;
          if (ev.once) S._once[ev.id] = true;
          const text = renderText(ev.t, S);
          applyFx(S, ev.fx);
          pushLog(S, "child", text);
        }
      }
      if (S.dayNum >= 220) { S.child = false; S.age = S.entryAge; entryLife(S); }
      S.days.push({ day: S.dayNum, happy: S.stats.happy, followers: 0 });
      return { status: "ok" };
    }

    S.age = S.mode === "life" ? S.entryAge + Math.floor((S.dayNum - 220) / 365) : S.startAge + Math.floor(S.dayNum / 365);

    dailyUpdate(S);

    const events = rollEvents(S);
    events.forEach(ev => {
      const text = renderText(ev.t, S);
      applyFx(S, ev.fx);
      pushLog(S, ev.kind || (ev.id.startsWith("cal") ? "cal" : "hk"), text);
      unlockFromText(S, text);
    });

    // 仲間の近況
    S.companions.forEach(c => {
      if (S.dayNum >= c.next && c.next < 9999) {
        const line = c.lines[Math.min(c.stage, c.lines.length - 1)];
        pushLog(S, "comp", `同じ頃に参入した ${c.name} ${line}`);
        c.stage++; c.next += S.rng.int(10, 40);
        if (c.stage >= c.lines.length) c.next = 9999;
      }
    });

    risks(S);
    if (S.ended) return { status: "ended" };

    // 決断
    const d = pickDecision(S);
    if (d && !S.pending) {
      S.pending = { kind: "decision", id: d.id };
      S.days.push({ day: S.dayNum, happy: S.stats.happy, followers: S.hk.followers });
      return { status: "decision", decision: d };
    }

    // 節目
    milestones(S);

    // 静かな消滅（ROMとして残った場合は「幽霊」）
    if (S.faded && S.lowHeatDays > 45) {
      endGame(S, (S.flags.includes("rom") || S.focus === "rom") ? "ghost" : "fade");
      return { status: "ended" };
    }
    // 上限（5年を超えたら、長すぎる界隈歴として幕）
    if (S.dayNum >= 1826) { endGame(S, "veteran_end"); return { status: "ended" }; }

    S.days.push({ day: S.dayNum, happy: S.stats.happy, followers: S.hk.followers });
    return { status: "ok" };
  }

  /* ---------- 決断解決 ---------- */
  function resolve(S, idx) {
    if (!S.pending) return;
    const p = S.pending;
    if (p.kind === "decision") {
      const d = HK.DECISIONS2.find(x => x.id === p.id);
      const ch = d.choices[idx] || d.choices[0];
      const t = renderText(ch.t, S);
      pushLog(S, "decision", t);
      applyFx(S, ch.fx);
      unlockFromText(S, t);
      if (ch.fx && ch.fx.retire) { S.hk.retireCount++; S.heat = clamp(S.heat + 20, 0, 100); S.pending = null; return; }
    } else if (p.kind === "breather") {
      // UI側でノート
    } else if (p.kind === "revive") {
      if (idx === 0) {
        S.handle = makeHandle(S.rng);
        S.hk.followers = Math.max(S.hk.followers, S.rng.int(2, 15));
        S.stats.mental = clamp(S.stats.mental + 6, 0, 100);
        S.heat = clamp(S.heat + 10, 0, 100);
        pushLog(S, "revive", `あなたは転生した。新しい名前は「${S.handle}」。ゼロから、もう一度。`);
      } else if (idx === 1) {
        endGame(S, "burned");
      } else {
        S.heat = clamp(S.heat - 10, 0, 100);
        pushLog(S, "hk", "しばらく休んでから、また戻ることにした。");
      }
    }
    S.pending = null;
  }

  HK.engine2 = { newGame, step, resolve, renderText, unlockZukan, fmtDate, endGame, makeHandle, RNG, clamp, applyFx, pushLog };
})();
