/* =========================================================
   10万分の1のヒカマー v3.24 — リプ追補パック3（新着4件）
   ・過激な事しすぎ→開示→ステータス大幅ダウン（famePct）
   ・アラブ人/インド人が激レア＋吉川市生まれ（中学晒し→特定）
   ・参入と同時に派閥が決まる（まずどの派閥に入るか）
   ・5%くらいの確率で👄🍐する（界隈語で「死」・実ツイートで確認済み）
   ========================================================= */
window.HK = window.HK || {};

(function () {
  const D = HK.DATA2;

  /* ================= イベント ================= */
  HK.EVENTS2.push(
    /* [11] 開示後のステータス大幅ダウン */
    { id: "x12_doxx_aftermath", w: 3, d: [60, 2000], once: true, cond: S => S.flags.includes("doxxed"), t: "特定のあと、あなたの数字は総崩れしていた。フォロワー、熱量、メンタル——垢の寿命が縮む音がした。", fx: { famePct: -35, mental: -8, heat: -12, flags: ["doxx_aftermath"] } },

    /* [12] 激レア出身イベント */
    { id: "x12_arab", w: 3, d: [40, 2000], cond: S => S.flags.includes("arab"), t: "アラビア語と日本語を混ぜた投稿が、なぜかTLでウケた。言葉は、ノリがあれば通じる。", fx: { fame: 150, happy: 2 } },
    { id: "x12_india", w: 3, d: [40, 2000], cond: S => S.flags.includes("india"), t: "ヒンディー語のミームを投げたら、界隈が「本場」と呼び始めた。", fx: { fame: 150, know: 2 } },

    /* [12] 吉川市生まれ（中学晒し→特定） */
    { id: "x12_yoshikawa", w: 2, d: [60, 2000], once: true, cond: S => S.pref.indexOf("吉川") >= 0, t: "地元トークで盛り上がり、出身中学の名前をうっかり晒してしまった。", fx: { fameRisk: 18, mental: -8, flags: ["yoshikawa_leak"] } },
    { id: "x12_yoshikawa2", w: 2, d: [90, 2000], once: true, cond: S => S.flags.includes("yoshikawa_leak"), t: "中学名から芋づる式に、あなたの生活範囲がTLに並び始めた。地元の特定は、こうして完成する。", fx: { mental: -12, fameRisk: 10 } },

    /* [14] 👄🍐（5%の人生） */
    { id: "x12_kuchinashi", w: 8, d: [120, 2000], once: true, cond: S => S.flags.includes("mortality") && !S.flags.includes("kuchinashi_done"), t: "その日は、なんの前触れもなかった。あなたのTLはそこで止まり、界隈はあなたの名前を、静かに呼んだ。", fx: { zukan: ["n42"], flags: ["kuchinashi_done"], end: "kuchinashi" } }
  );

  /* ================= 決断 ================= */
  HK.DECISIONS2.push(
    /* [11] 過激な一発 */
    { id: "x12_extreme", w: 2, d: [150, 2000], cond: S => S.hk.edge >= 50, prompt: "炎上覚悟の一発を投げるか。TLの視線が、あなたの指先を見ている。", choices: [
      { label: "投げる", t: "投げた。反応は一瞬で、通報も同じ速さで来る。", fx: { edge: 8, banRisk: 15, fameRisk: 12, happy: 2 } },
      { label: "やめておく", t: "指を止めた。抑えた分だけ、明日の燃料になる。", fx: { mental: 2 } }
    ] }
  );

  /* ================= 終わり方・図鑑 ================= */
  D.endings.push(
    { id: "kuchinashi", name: "👄🍐（くちなし）", desc: "界隈の語彙で、死はこう書かれる。あなたのTLは、生涯の途中で止まった。" }
  );
  D.zukan.push(
    { id: "n42", cat: "用語", name: "👄🍐（くちなし）", desc: "界隈の語彙では、死はこう書かれる。直接書くと、届かないことがあるから。" }
  );

  /* ================= newGameラップ（派閥ガチャ・激レア出身・5%） ================= */
  const _orig = HK.engine2.newGame;
  HK.engine2.newGame = function (opts) {
    const S = _orig(opts);
    const rng = S.rng;

    /* [13] まずどの派閥に入るか決まる（35%） */
    if (!S.fac && rng.chance(0.35)) {
      S.fac = rng.wpick([{ id: "masuma", w: 35 }, { id: "ozeu", w: 30 }, { id: "neonazi", w: 20 }, { id: "ss", w: 15 }], f => f.w).id;
      S.hk.nareai = HK.engine2.clamp(S.hk.nareai + 5, -100, 100);
    }

    /* [12] 激レア出身: アラブ / インド（各1/1100）・吉川市（埼玉の10%） */
    if (rng.chance(0.0009)) {
      S.pref = "海外（アラブ首長国連邦）";
      S.flags.push("arab");
      S.hk.edge = HK.engine2.clamp(S.hk.edge + 3, 0, 100);
    } else if (rng.chance(0.0009)) {
      S.pref = "海外（インド）";
      S.flags.push("india");
      S.stats.know = HK.engine2.clamp(S.stats.know + 3, 0, 100);
    } else if (S.pref === "埼玉県" && rng.chance(0.10)) {
      S.pref = "埼玉県吉川市";
    }

    /* [14] 5%くらいの確率で👄🍐する人生 */
    if (rng.chance(0.05)) S.flags.push("mortality");

    return S;
  };
})();
