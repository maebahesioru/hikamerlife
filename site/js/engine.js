/* =========================================================
   4万分の1のヒカマー — ゲームエンジン
   ========================================================= */
window.HK = window.HK || {};

(function () {
  "use strict";
  const D = () => HK.DATA;

  /* ---------- RNG (seeded) ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  class RNG {
    constructor(seed) { this.f = mulberry32(seed); }
    next() { return this.f(); }
    range(a, b) { return a + this.next() * (b - a); }
    int(a, b) { return Math.floor(this.range(a, b + 1)); }
    pick(arr) { return arr[Math.floor(this.next() * arr.length)]; }
    wpick(arr, wf) {
      const ws = arr.map(wf);
      const sum = ws.reduce((x, y) => x + y, 0);
      let r = this.next() * sum;
      for (let i = 0; i < arr.length; i++) { r -= ws[i]; if (r <= 0) return arr[i]; }
      return arr[arr.length - 1];
    }
    chance(p) { return this.next() < p; }
  }

  /* ---------- Clamp / helpers ---------- */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function renderText(t, S) {
    return t
      .replaceAll("{h}", S.handle)
      .replaceAll("{n}", S.name)
      .replaceAll("{age}", String(S.age))
      .replaceAll("{year}", String(S.year))
      .replaceAll("{pref}", S.pref);
  }

  /* ---------- 生涯生成 ---------- */
  function newGame(opts) {
    opts = opts || {};
    const seed = opts.seed != null ? opts.seed : (Date.now() % 2147483647);
    const rng = new RNG(seed);
    // 生年: 2005〜2014（今日12〜21歳になる世代）にやや山を作る
    const birthYear = opts.birthYear != null ? opts.birthYear : 2005 + Math.floor(Math.pow(rng.next(), 0.85) * 10);
    const pref = rng.wpick(D().prefs, p => p[1])[0];
    const sex = opts.sex || (rng.chance(0.92) ? "m" : "f");
    const family = rng.wpick(D().families, f => f.w);
    const net = rng.wpick(D().nets, n => n.w);
    const sibling = rng.pick(D().siblings);
    const qualities = {
      draw: rng.int(5, 95),      // 画力素質
      beat: rng.int(5, 95),      // 音感・技術
      word: rng.int(5, 95),      // 語彙・文章
      social: rng.int(5, 95),    // コミュ強
      grit: rng.int(5, 95),      // 図太さ
      luck: rng.int(5, 95)       // 運
    };
    const given = D().givenNamesM ? (sex === "m" ? rng.pick(D().givenNamesM) : rng.pick(D().givenNamesF)) : "名無し";
    const familyName = rng.pick(D().familyNames);
    const name = opts.name || (familyName + " " + given);
    const handle = opts.handle || makeHandle(rng);

    const S = {
      seed, rng, sex, birthYear, pref,
      citySize: D().regionClass[pref] || (rng.chance(0.55) ? "郊外" : "田舎"),
      family, net: { tier: net.id === "late" ? 0 : net.id === "restricted" ? 1 : net.id === "share" ? 1 : 2, item: net },
      sibling, qualities, name, handle,
      age: 0, year: birthYear,
      stats: { hp: rng.int(58, 82), happy: rng.int(50, 75), know: rng.int(30, 55), rel: rng.int(45, 70), mental: rng.int(55, 85) },
      hk: { joined: false, joinAge: null, followers: 0, goroku: 0, skill: 0, fameRisk: 0, banRisk: 0, nareai: 0, edge: 0, dev: 0, retired: false, retireCount: 0, peakFollowers: 0, freezes: 0, doxxed: false },
      money: family.money0,
      flags: [],
      log: [],
      years: [],
      notes: [],
      pending: null,
      dead: false,
      encounterP: 0,
      companions: [],
      cohort: [],
      breatherDone: {},
      _usedOnce: {},
      _noEventYears: 0
    };
    // 出会い確率（この人生のパラメータ）: 生年・ネット環境・運で決まる
    S.encounterP = clamp(
      0.22
      + (S.net.tier * 0.06)
      + (birthYear >= 2006 && birthYear <= 2012 ? 0.10 : 0)
      + (qualities.luck - 50) / 400,
      0.08, 0.6);

    pushLog(S, "birth", `君が生まれたのは${birthYear}年、${pref}。${family.label}、${net.label}。名前は${name}。この人生が、ここから始まる。`);
    pushLog(S, "life", "両親は君を抱っこして、「この子はどんな大人になるかな」と言った。君はまだ何も分からない。");
    genCompanions(S);
    return S;
  }

  function makeHandle(rng) {
    const n = rng.pick(D().handleNouns);
    const m = rng.pick(D().handleMods);
    return n + m + "_mania";
  }

  /* ---------- 仲間（同じ時期に参入した人たち） ---------- */
  const COMP_NAMES = ["カフェオレ_mania", "さんぽ_mania", "クロワッサン_mania", "しおむすび_mania", "まめしば_mania", "夕焼け_mania", "ちくわ_mania", "こたつ_mania", "メロンソーダ_mania", "ふうせん_mania", "すずめ_mania", "こおり_mania", "ペンギン_mania", "うどん_mania", "きなこ_mania"];
  const COMP_ARCS = [
    { id: "legend", lines: ["がフォロワー1万人を超えたらしい。同じ時期に挨拶しただけの他人なのに、少し誇らしい。", "の作った曲が界隈の外まで流れている。", "は「伝説」になり、あなたのことは誰も覚えていない。"] },
    { id: "mid", lines: ["は今日も普通にタイムラインにいる。そういう人が一番強い。", "は1000人を超えた。お互い、気づいたら中堅になっていた。"] },
    { id: "freeze", lines: ["が突然凍結された。垢の痕跡だけがRTに残っている。", "は新垢で戻ってきた。名前の語尾に小文字が増えた。"] },
    { id: "vanish", lines: ["のポストが、この1週間見えない。「また今度」が最後の言葉だった。", "はアカウントごと消えていた。突然の終わりは、この界隈では日常だ。"] },
    { id: "yami", lines: ["は病み垢になった。構文の端々に、疲れが見える。", "が戻ってきた。前より少しだけ、優しい言葉を使うようになった。"] },
    { id: "alq", lines: ["がアルカイダ系で一気に名前を上げた。すごいのか、まずいのか。", "はコンプライアンス的にまずいことになり、また消えた。", "は何度目かの復活をした。彼がいる限り、TLは賑やかだ。"] },
    { id: "hikakou", lines: ["はもう滅多に浮上しない。だが垢は消していない。"] }
  ];
  function genCompanions(S) {
    const rng = S.rng;
    const names = COMP_NAMES.slice();
    for (let i = 0; i < 4; i++) {
      const idx = rng.int(0, names.length - 1);
      const nm = names.splice(idx, 1)[0];
      const arc = rng.pick(COMP_ARCS);
      S.companions.push({ name: nm, arc: arc.id, lines: arc.lines, stage: 0, next: rng.int(1, 3), followers: rng.int(20, 300) });
    }
    // 同時代コホート（生存曲線用・指数分布 mean 2.5年）
    S.cohort = [];
    for (let i = 0; i < 30; i++) {
      const life = Math.min(12, -Math.log(1 - S.rng.next()) * 2.5 + 0.5);
      S.cohort.push(life);
    }
  }

  /* ---------- ログ ---------- */
  function pushLog(S, kind, text) {
    S.log.push({ age: S.age, year: S.year, kind, text });
  }

  /* ---------- ステータス自然変動 ---------- */
  function drift(S) {
    const a = S.age, st = S.stats;
    if (a <= 18) { st.know = clamp(st.know + 2, 0, 100); st.hp = clamp(st.hp + 1, 0, 100); }
    if (a >= 30) { st.hp = clamp(st.hp - 1, 0, 100); }
    if (a >= 45) { st.hp = clamp(st.hp - (a >= 70 ? 3 : 1), 0, 100); }
    if (a >= 60) { st.know = clamp(st.know + 1, 0, 100); }
    st.happy = clamp(st.happy - (a >= 20 ? 1 : 0), 0, 100);
    if (S.flags.includes("married")) st.happy = clamp(st.happy + 1, 0, 100);
    st.rel = clamp(st.rel - (a >= 30 ? 1 : 0), 0, 100);
    // お金: 社会人収入・年金
    if (a >= 22 && a < 65) S.money += 1200000;
    else if (a >= 65) S.money -= 300000;
    // メンタル: 幸福・人間関係・健康に引っ張られる
    const m = (st.happy + st.rel + st.hp) / 3;
    if (m < 40) st.mental = clamp(st.mental - 2, 0, 100);
    else if (m > 65) st.mental = clamp(st.mental + 1, 0, 100);
    if (S.hk.joined && !S.hk.retired) st.happy = clamp(st.happy + (S.hk.followers > 500 ? 1 : 0), 0, 100);
  }

  /* ---------- イベント抽選 ---------- */
  function eligible(S, ev) {
    if (ev.once && S._usedOnce[ev.id]) return false;
    if (S.age < (ev.ages ? ev.ages[0] : 0)) return false;
    if (ev.ages && S.age > ev.ages[1]) return false;
    if (ev.max != null && S.age > ev.max) return false;
    if (ev.min != null && S.age < ev.min) return false;
    if (ev.year) { if (S.year < ev.year[0] || S.year > ev.year[1]) return false; }
    if (ev.phase === "pre" && S.hk.joined) return false;
    if (ev.phase === "hk" && !S.hk.joined) return false;
    if (ev.cond && !ev.cond(S)) return false;
    if (ev.id === "h_buzz_viral" && S.hk.peakFollowers > 8000) return false;
    return true;
  }

  function rollEvents(S) {
    const n = S.rng.int(2, 4);
    const out = [];
    for (let i = 0; i < n; i++) {
      const pool = HK.EVENTS.filter(e => eligible(S, e));
      if (!pool.length) break;
      const ev = S.rng.wpick(pool, e => e.w || 1);
      if (ev.once) S._usedOnce[ev.id] = true;
      out.push(ev);
    }
    return out;
  }

  /* ---------- 決断抽選 ---------- */
  function pickDecision(S) {
    // 冷めたアカウントには、たいてい何も起こらない
    if (S.hk.joined && S.hk.faded && S.rng.chance(0.85)) return null;
    const pool = HK.DECISIONS.filter(d => {
      if (d.once && S._usedOnce[d.id]) return false;
      if (S.age < (d.ages ? d.ages[0] : 0)) return false;
      if (d.ages && S.age > d.ages[1]) return false;
      if (d.phase === "pre" && S.hk.joined) return false;
      if (d.phase === "hk" && !S.hk.joined) return false;
      if (d.cond && !d.cond(S)) return false;
      return true;
    });
    if (!pool.length) return null;
    // すでに最近決断したなら出さない（年2回まで）
    if (S._decYear === S.year) return null;
    if (S.rng.chance(0.55) || S.forceDecision) return S.rng.wpick(pool, d => d.w || 1);
    return null;
  }

  /* ---------- 効果適用 ---------- */
  function applyFx(S, fx, logText) {
    if (!fx) return;
    const st = S.stats, hk = S.hk;
    const add = (k, v) => { if (st[k] != null) st[k] = clamp(st[k] + v, 0, 100); };
    if (fx.hp) add("hp", fx.hp);
    if (fx.happy) add("happy", fx.happy);
    if (fx.know) add("know", fx.know);
    if (fx.rel) add("rel", fx.rel);
    if (fx.mental) add("mental", fx.mental);
    if (fx.money) S.money += fx.money;
    if (fx.fame) { hk.followers = Math.max(0, hk.followers + fx.fame); }
    if (fx.goroku) hk.goroku = clamp(hk.goroku + fx.goroku, 0, 100);
    if (fx.skill) hk.skill = clamp(hk.skill + fx.skill, 0, 100);
    if (fx.fameRisk) hk.fameRisk = clamp(hk.fameRisk + fx.fameRisk, 0, 100);
    if (fx.banRisk) hk.banRisk = clamp(hk.banRisk + fx.banRisk, 0, 100);
    if (fx.nareai) hk.nareai = clamp(hk.nareai + fx.nareai, -100, 100);
    if (fx.edge) hk.edge = clamp(hk.edge + fx.edge, 0, 100);
    if (fx.dev) hk.dev = clamp(hk.dev + fx.dev, 0, 100);
    if (fx.flags) fx.flags.forEach(f => { if (!S.flags.includes(f)) S.flags.push(f); });
    if (fx.zukan) fx.zukan.forEach(id => unlockZukan(S, id));
    if (fx.join) doJoin(S);
    if (fx.retire) doRetire(S);
    hk.peakFollowers = Math.max(hk.peakFollowers, hk.followers);
    if (S.money < -5000000) S.money = -5000000;
  }

  function doJoin(S) {
    if (S.hk.joined) return;
    S.hk.joined = true;
    S.hk.joinAge = S.age;
    S.hk.followers = S.rng.int(2, 9);
    S.hk.goroku = 5;
    S.hk.skill = Math.round((S.qualities.draw + S.qualities.beat + S.qualities.word) / 12);
    unlockZukan(S, "c6");
    pushLog(S, "debut", `あなたは「${S.handle}」として活動を始めた。初投稿の挨拶に、いくつかのいいねと、「とりあえずフォローしとくゾ」が届いた。`);
  }

  function doRetire(S) {
    S.hk.retired = true;
    S.hk.retireCount++;
    pushLog(S, "retire", "あなたは引退の投稿をした。これで" + S.hk.retireCount + "回目。界隈は「またか」とも「寂しい」とも言わなかった。ただ、静かになった。");
  }

  /* ---------- フォロワー成長 ---------- */
  function growth(S) {
    const hk = S.hk;
    if (!hk.joined) return;
    const ysj = S.age - (hk.joinAge || 15);
    if (hk.retired) {
      hk.followers = Math.round(hk.followers * 0.975);
      if (S.age < 40 && S.rng.chance(0.05)) hk.followers += S.rng.int(0, 3);
      return;
    }
    hk.activeYears = (hk.activeYears || 0) + 1;
    // 自然消滅: 数年活動すると、多くのアカウントは静かに冷えていく
    const ysjN = S.age - (hk.joinAge || 15);
    if (!hk.faded && ysjN >= 3 && S.rng.chance(Math.min(0.30, 0.05 * (ysjN - 2)))) {
      hk.faded = true;
      if (!S.flags.includes("gliding")) S.flags.push("gliding");
      pushLog(S, "retire", "あなたの活動量は、静かに減っていった。忙しさ、飽き、あるいは言葉にできない何か。垢は消していない。消せなかっただけだ。");
    }
    if (hk.faded) {
      hk.followers += S.rng.int(0, 2);
      const grow0 = hk.followers; // 微増
      hk.peakFollowers = Math.max(hk.peakFollowers, grow0);
      return;
    }
    // 受動スキル成長
    if (hk.skill < 95 && S.rng.chance(0.45)) hk.skill++;
    if (hk.skill >= 30 && hk.skill < 90 && S.rng.chance(0.6)) hk.skill++;
    if (ysj < 4) hk.goroku = clamp(hk.goroku + 1, 0, 100);
    const ageK = 1 + Math.max(0, (16 - S.age)) / 30 - Math.max(0, (S.age - 24)) / 60;
    const base = hk.skill * 0.55 + hk.goroku * 0.35 + (hk.nareai + 100) / 14;
    const eraK = S.year <= 2027 ? 1 : Math.max(0.30, 1 - (S.year - 2027) * 0.05);
    const actK = clamp(1 - ysj * 0.055, 0.08, 1);   // 活動年数とともに伸びは鈍る
    const luckK = 0.6 + S.qualities.luck / 100 * 0.9;
    let g = Math.round(base * ageK * eraK * actK * luckK * S.rng.range(0.6, 1.5));
    if (S.age > 35 && !S.flags.includes("legend")) g = Math.round(g * 0.4);
    if (S.flags.includes("monetized")) g = Math.round(g * 0.85);
    if (hk.edge > 60 && S.year <= 2026) g = Math.round(g * 1.15); // 露悪は伸びる時代
    if (S.stats.mental < 25) g = Math.round(g * 0.5);
    hk.followers = Math.max(0, hk.followers + g);
    if (S.stats.mental < 20) hk.followers = Math.round(hk.followers * 0.99);
    if (hk.followers >= 10000 && !S.flags.includes("legend")) S.flags.push("legend");
    // 大きく育つと、興味を持たれる
    if (hk.followers >= 2000) hk.fameRisk = clamp(hk.fameRisk + 2, 0, 100);
    hk.peakFollowers = Math.max(hk.peakFollowers, hk.followers);
  }

  /* ---------- リスク処理 ---------- */
  function risks(S) {
    const hk = S.hk;
    if (!hk.joined) return;
    // 炎上・特定
    if (hk.fameRisk >= 70 && !S._usedOnce["doxx_event"]) {
      if (S.rng.chance(0.4)) {
        S._usedOnce["doxx_event"] = true;
        hk.doxxed = true;
        S.flags.push("doxxed");
        S.stats.mental = clamp(S.stats.mental - 22, 0, 100);
        S.stats.happy = clamp(S.stats.happy - 12, 0, 100);
        S.stats.hp = clamp(S.stats.hp - 4, 0, 100);
        hk.fameRisk = clamp(hk.fameRisk - 45, 0, 100);
        pushLog(S, "doxx", "住所特定祭りが、あなたに届いた。「自分語り」「自撮り」「位置情報」——積み上げてきたものが全部、ひとつのツリーにまとめられていた。あなたはその夜、カーテンを閉めて、部屋の電気を消した。 ／ これはゲームです。現実で怖い思いをしたら、ひとりで抱えないで。");
      }
    }
    // 凍結
    const wave = (S.year === 2025 || S.year === 2026 || S.year === 2028);
    const fp = (hk.banRisk >= 80 ? 0.30 : hk.banRisk >= 60 ? 0.10 : 0.02) * (wave ? 1.8 : 1);
    if (S.rng.chance(fp)) {
      hk.freezes++;
      hk.banRisk = clamp(hk.banRisk - 40, 0, 100);
      hk.followers = Math.round(hk.followers * (0.1 + S.rng.range(0, 0.2)));
      S.stats.mental = clamp(S.stats.mental - 12, 0, 100);
      pushLog(S, "freeze", `あなたのアカウントは凍結された。フォロワー${hk.followers}人規模の「あなた」が、一晩で消えた。通知欄は、からっぽになった。${hk.freezes > 1 ? "（" + hk.freezes + "回目）" : ""}`);
      if (S.age < 45 && S.rng.chance(0.75)) {
        S.pending = { kind: "revive" };
        pushLog(S, "freeze", "転生するか、このまま去るか。指が動かない。");
      }
    }
  }

  /* ---------- 仲間の近況 ---------- */
  function companionsTick(S) {
    if (!S.hk.joined) return;
    S.companions.forEach((c, i) => {
      if (S.age >= (S.hk.joinAge || 14) + c.next) {
        const line = c.lines[Math.min(c.stage, c.lines.length - 1)];
        pushLog(S, "comp", `同じ時期に参入した ${c.name} ${line}`);
        c.stage++;
        c.next += S.rng.int(2, 5);
        if (c.stage >= c.lines.length) c.next = 999;
      }
    });
  }

  /* ---------- ひと息 ---------- */
  function breatherCheck(S) {
    if (S.pending) return;
    const b = D().breathers[S.age];
    if (b && !S.breatherDone[S.age]) {
      S.breatherDone[S.age] = true;
      S.pending = { kind: "breather", age: S.age, q: b.q };
    }
  }

  /* ---------- 死亡 ---------- */
  function mortality(S) {
    const a = S.age, sex = S.sex;
    let p;
    if (a <= 0) p = 0.0019;
    else if (a < 5) p = 0.0002;
    else if (a < 15) p = 0.0001;
    else if (a < 30) p = 0.0004;
    else if (a < 40) p = 0.0008;
    else if (a < 50) p = 0.0016;
    else if (a < 60) p = 0.0035;
    else if (a < 70) p = 0.008;
    else if (a < 75) p = 0.014;
    else if (a < 80) p = 0.024;
    else if (a < 85) p = 0.042;
    else if (a < 90) p = 0.075;
    else if (a < 95) p = 0.13;
    else if (a < 100) p = 0.22;
    else p = 0.4;
    if (sex === "f") p *= 0.82;
    if (S.stats.hp < 30) p *= 1.9;
    if (S.stats.mental < 22) p *= 1.45;
    if (S.flags.includes("doxxed")) p *= 1.1;
    if (S.age >= 100) p = 0.5;
    return p;
  }

  function pickDeathCause(S) {
    const pool = D().deathCauses.filter(c =>
      (c.min == null || S.age >= c.min) && (c.max == null || S.age <= c.max));
    if (!pool.length) return "老衰。静かな最期だった。";
    return (S.rng.wpick(pool, c => c.w)).text;
  }

  /* ---------- 称号 ---------- */
  function evalTitle(S) {
    for (const t of D().titles) {
      try {
        // cond は同梱の data.js に手書きされた固定文字列のみ（外部入力は到達しない）。
        // 念のため安全な文字種だけの式に限定してから評価する。
        if (!/^[\w\s<>=!&|().+*\[\]"'%,-]+$/.test(t.cond)) continue;
        const f = new Function("S", "fame", "joinAge", "nareai", "skill", "goroku", "mental", "age", "retireCount", "flags",
          `return (${t.cond});`);
        if (f(S, S.hk.followers, S.hk.joinAge, S.hk.nareai, S.hk.skill, S.hk.goroku, S.stats.mental, S.age, S.hk.retireCount, S.flags)) {
          return t;
        }
      } catch (e) { /* ignore */ }
    }
    return D().titles[D().titles.length - 1];
  }

  /* ---------- 確率チェーン（この人生の希少度） ---------- */
  function probChain(S) {
    const chain = [];
    chain.push({ label: "世界に生まれる", p: 1 });
    chain.push({ label: "日本に生まれる", p: D().meta.japanPop / D().meta.worldPop });
    if (S.flags.includes("pre_hooked") || S.hk.joined) {
      chain.push({ label: "ヒカマニに出会う", p: S.encounterP });
    } else {
      chain.push({ label: "ヒカマニに出会わない人生を生きる", p: 1 - S.encounterP });
    }
    if (S.hk.joined) {
      chain.push({ label: "#新参ヒカマー をする", p: 0.45 });
      const act = Math.min(Math.max(1, S.hk.activeYears || (S.hk.retired ? 1 : 0)), 8);
      const survP = Math.exp(-act / 2.5) * (S.hk.retired ? 0.6 : 1);
      chain.push({ label: `${act}年以上活動を続ける`, p: clamp(survP, 0.002, 1) });
      if (S.hk.peakFollowers >= 1000) chain.push({ label: "フォロワー1,000人を超える", p: 0.07 });
      if (S.hk.peakFollowers >= 10000) chain.push({ label: "フォロワー10,000人を超える", p: 0.008 });
      if (S.flags.includes("doxxed")) chain.push({ label: "特定される", p: 0.30 });
    }
    // 表示用の逆数に丸め、合計は「表示された数字の積」と完全に一致させる
    let prod = 1;
    chain.forEach(c => {
      const inv = c.p >= 1 ? 1 : 1 / Math.max(c.p, 1e-9);
      c.inv = inv >= 100 ? Math.round(inv) : (inv >= 10 ? Math.round(inv * 10) / 10 : Math.round(inv * 100) / 100);
      prod *= (1 / c.inv);
    });
    return { chain, product: prod };
  }

  /* ---------- 図鑑 ---------- */
  function unlockZukan(S, id) {
    if (!S._zukan) S._zukan = {};
    if (!S._zukan[id]) {
      S._zukan[id] = true;
      S._newZukan = S._newZukan || [];
      S._newZukan.push(id);
      const entry = D().zukan.find(z => z.id === id);
      if (entry) pushLog(S, "zukan", `図鑑に追記: 〔${entry.cat}〕${entry.name}`);
      // 即時永続化（人生の途中でも図鑑で見られる）
      try {
        const z = JSON.parse(localStorage.getItem("hk4m.zukan.v1") || "{}");
        z[id] = true;
        localStorage.setItem("hk4m.zukan.v1", JSON.stringify(z));
      } catch (e) { /* file:// 等で localStorage 不可の場合は無視 */ }
    }
  }
  function unlockFromText(S, text) {
    // キーワード → 図鑑エントリの対応表
    const MAP = [
      [["制裁"], ["c1"]],
      [["アルカイダ"], ["c2"]],
      [["おもちゃ"], ["c3"]],
      [["ノリチガ"], ["c4"]],
      [["自治厨"], ["c5"]],
      [["新参"], ["c6"]],
      [["馴れ合い"], ["c7"]],
      [["ROM", "ロム"], ["c8"]],
      [["泡沫"], ["c10"]],
      [["有産"], ["c11"]],
      [["嫌儲", "収益化"], ["c12"]],
      [["開発", "発掘"], ["c13"]],
      [["顔", "自撮り"], ["c14"]],
      [["エンカ", "オフ会"], ["c15"]],
      [["開示"], ["c16", "p9"]],
      [["レスバ"], ["c17"]],
      [["5.11", "凍結"], ["c18"]],
      [["内戦"], ["c19"]],
      [["810", "掲示板"], ["p1"]],
      [["Wiki", "wiki"], ["p2"]],
      [["野獣"], ["p3"]],
      [["開発邸"], ["p4"]],
      [["サンサン", "スペース"], ["p5"]],
      [["Hikabooru", "booru", "素材"], ["p6"]],
      [["新聞"], ["p7"]],
      [["8values"], ["p8"]],
      [["お台場"], ["e1"]],
      [["デモ"], ["e2"]],
      [["ONICHA", "麦茶"], ["e3", "g2"]],
      [["ザビャン"], ["e4"]],
      [["wplace"], ["e6"]],
      [["諸岡", "老坂"], ["e7"]],
      [["ニコチン"], ["h1"]],
      [["唯一神"], ["h2"]],
      [["アルカイダ帝国"], ["c2"]],
      [["スギィ"], ["g3"]],
      [["クソムーブ"], ["g4"]],
      [["死人に口なし"], ["g5"]],
      [["存在しない病気", "病み"], ["g6"]],
      [["故人部"], ["g7"]],
      [["魚介"], ["g8"]],
      [["構文"], ["k2"]],
      [["引退"], ["k2"]],
      [["例のアレ"], ["c0"]],
      [["ヒカマニ", "Hikakin"], ["c21"]],
      [["ニコニコ"], ["c21"]]
    ];
    for (const [keys, ids] of MAP) {
      if (keys.some(k => text.includes(k))) ids.forEach(id => unlockZukan(S, id));
    }
  }

  /* ---------- 1年進める ---------- */
  function step(S) {
    if (S.dead) return { status: "dead" };
    if (S.pending) return { status: "waiting", pending: S.pending };

    S.age++; S.year++;
    drift(S);

    const events = rollEvents(S);
    events.forEach(ev => {
      const text = renderText(ev.t, S);
      applyFx(S, ev.fx, text);
      pushLog(S, ev.phase === "hk" ? "hk" : "life", text);
      unlockFromText(S, text);
    });

    // 決断（最大1件）
    const d = pickDecision(S);
    if (d) {
      if (d.once) S._usedOnce[d.id] = true;
      S._decYear = S.year;
      S.pending = { kind: "decision", id: d.id };
      return { status: "decision", decision: d };
    }

    growth(S);
    risks(S);
    companionsTick(S);

    // 生涯サマリ
    S.years.push({ age: S.age, year: S.year, happy: S.stats.happy, hp: S.stats.hp, followers: S.hk.followers });

    breatherCheck(S);

    // 死亡判定
    if (S.rng.chance(mortality(S)) || S.age >= 105) {
      finish(S);
      return { status: "dead" };
    }
    if (S.hk.joined && S.hk.followers > 0 && !S.flags.includes("final_age_active")) S.flags.push("final_age_active");
    return { status: "ok" };
  }

  /* ---------- 決断解決 ---------- */
  function resolve(S, choiceIndex) {
    if (!S.pending) return;
    const p = S.pending;
    if (p.kind === "decision") {
      const d = HK.DECISIONS.find(x => x.id === p.id);
      const ch = d.choices[choiceIndex] || d.choices[0];
      const t = renderText(ch.t, S);
      applyFx(S, ch.fx, t);
      pushLog(S, "decision", t);
      unlockFromText(S, t);
      if (ch.fx && ch.fx.join) {
        // 参入の記念ログはdoJoinが担当
      }
    } else if (p.kind === "breather") {
      // ノートに一言残せる（UI側）
    } else if (p.kind === "revive") {
      if (choiceIndex === 0) {
        S.handle = makeHandle(S.rng);
        S.hk.followers = Math.max(S.hk.followers, S.rng.int(3, 20));
        S.stats.mental = clamp(S.stats.mental + 8, 0, 100);
        pushLog(S, "revive", `あなたは転生した。新しい名前は「${S.handle}」。ゼロから、もう一度。`);
      } else {
        doRetire(S);
      }
    }
    S.pending = null;
  }

  /* ---------- 人生の終わり ---------- */
  function finish(S) {
    S.dead = true;
    S.deathCause = pickDeathCause(S);
    S.title = evalTitle(S);
    S.prob = probChain(S);
    pushLog(S, "death", `あなたは${S.age}歳で亡くなった。${S.deathCause}`);
  }

  /* ---------- エクスポート ---------- */
  HK.engine = {
    newGame, step, resolve, finish,
    renderText, unlockZukan,
    RNG, clamp,
    makeHandle
  };
})();
