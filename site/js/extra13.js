/* =========================================================
   10万分の1のヒカマー v3.25 — リプ追補パック4（新着2件）
   ・開發本人になる（超レア開始・2024年〜）→ 福島に謝罪するかを選択
   ・大量の囲い持ちアカウントと戦争
   ========================================================= */
window.HK = window.HK || {};

(function () {
  const D = HK.DATA2;

  /* ================= イベント ================= */
  HK.EVENTS2.push(
    /* 開發本人ライン */
    { id: "x13_develop_hunted", w: 2, d: [40, 2000], once: true, cond: S => S.flags.includes("develop_self"), t: "あなたの過去の投稿が、全部掘り返されている。一つ一つが、燃料になっていく。", fx: { fameRisk: 12, mental: -6, zukan: ["n43"] } },
    { id: "x13_develop_support", w: 2, d: [80, 2000], cond: S => S.flags.includes("develop_self"), t: "擁護する少数の声が、実は大きかった。「全部本人が悪いわけじゃない」——その一言が、今日は効いた。", fx: { rel: 2, mental: 2 } },

    /* 囲い持ちとの戦争ライン */
    { id: "x13_enclosure_war2", w: 3, d: [240, 2000], once: true, cond: S => S.flags.includes("enclosure_war"), t: "囲い持ちの連合が、あなたに宣戦布告した。TLが、丸ごと戦場になっている。", fx: { fame: 120, mental: -6, heat: 8, zukan: ["n10"] } }
  );

  /* ================= 決断 ================= */
  HK.DECISIONS2.push(
    /* 福島に謝罪するか（開發本人） */
    { id: "x13_fukushima_apology", w: 3, d: [20, 2000], once: true, cond: S => S.flags.includes("develop_self"), prompt: "TLが、あなたの返事を待っている。福島への謝罪——するか。", choices: [
      { label: "謝罪する", t: "謝罪文を貼った。テンプレ化されて、ミームとして回り始めた。それでも、送った言葉は残る。", fx: { fame: 50, rel: 3, fameRisk: -10, mental: -3 } },
      { label: "謝罪しない", t: "「謝る気はない」——引用が、倍になった。", fx: { fame: 150, edge: 5, fameRisk: 15 } },
      { label: "黙る", t: "何も言わなかった。沈黙は、いちばん増幅される返事だ。", fx: { mental: -2, fameRisk: 8, know: 1 } }
    ] },

    /* 囲い持ちとの戦争 */
    { id: "x13_enclosure_war", w: 2, d: [200, 2000], once: true, cond: S => S.hk.followers >= 300, prompt: "囲いを大量に抱えたアカウントたちが、TLで幅を利かせている。あなたは——。", choices: [
      { label: "戦争する", t: "宣戦布告の投稿をした。返り血の分だけ、あなたの名前が広まる。", fx: { fame: 150, edge: 4, fameRisk: 8, flags: ["enclosure_war"] } },
      { label: "静観する", t: "戦場を、少し離れたところから眺めた。歴史は、いつも傍観者も焼く。", fx: { know: 2 } },
      { label: "和解を試みる", t: "DMで、両陣営に同じ文面を送った。和解は、時間がかかる分だけ安い。", fx: { rel: 3, mental: 2, nareai: 2 } }
    ] }
  );

  /* ================= 図鑑追加 ================= */
  D.zukan.push(
    { id: "n43", cat: "用語", name: "開發", desc: "界隈で最も燃やされた名前。本人が選ぶのは、謝罪か、徹底抗戦か、沈黙か。" }
  );

  /* ================= newGameラップ（開發本人になる・1/400・2024年〜） ================= */
  const _orig = HK.engine2.newGame;
  HK.engine2.newGame = function (opts) {
    const S = _orig(opts);
    const rng = S.rng;

    if (S.era.year >= 2024 && rng.chance(0.0025)) {
      S.flags.push("develop_self");
      S.hk.followers += rng.int(500, 1500);
      S.hk.fameRisk = HK.engine2.clamp(S.hk.fameRisk + 25, 0, 100);
      S.hk.banRisk = HK.engine2.clamp(S.hk.banRisk + 8, 0, 100);
      HK.engine2.pushLog(S, "birth", "あなたには、別の名前がある。界隈が最も燃やした、あの名前だ。");
    }

    return S;
  };
})();
