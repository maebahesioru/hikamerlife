/* =========================================================
   10万分の1のヒカマー v3.20 — リプ追補パック2（新着10件から8アイデア）
   ・途中からネオナチになる / ネオナチ族に生まれる(超レア)
   ・顔出し著名化の賭け（成功/失敗） / 親衛隊の入隊面接（成功/失敗）
   ・不法侵入→児相エンド / 反ヒカキンデモ / ヒカマーズ制裁に加わる / アンチに対抗
   ・アフィで村八分 / 静かな一週間（メンタル低下）
   ・才覚ガチャ割り振り（ランダムな数字を自分で振り分ける）
   ========================================================= */
window.HK = window.HK || {};

(function () {
  const D = HK.DATA2;

  /* ================= イベント ================= */
  HK.EVENTS2.push(
    { id: "x10_neptunia", w: 2, d: [40, 2000], t: "ネプテューヌの話を振ったら、界隈の三人が食いついてきた。「お前ら、いたのか」", fx: { happy: 2 } },
    { id: "x10_afi_purge", w: 2, d: [200, 2000], once: true, cond: S => S.flags.includes("afi") && S.hk.nareai <= -20, t: "アフィの片棒を担いだことがバレた。「金の匂いがする」——TLの扉が、静かに閉まっていく。", fx: { end: "expelled" } },
    { id: "x10_facewin", w: 3, d: [160, 2000], once: true, cond: S => S.flags.includes("face_bet") && !S.flags.includes("face_out"), t: "顔出しが当たった。写真がTLを巡り、界隈の名簿に載った。今日からあなたは、時の人だ。", fx: { fame: 800, happy: 3, flags: ["face_win", "face_out"] } },
    { id: "x10_facelose", w: 3, d: [160, 2000], once: true, cond: S => S.flags.includes("face_bet") && !S.flags.includes("face_out"), t: "顔出しは滑った。代わりに、「住所の候補」スレが立ったらしい。", fx: { fameRisk: 30, mental: -10, flags: ["face_lose", "face_out"] } },
    { id: "x10_ss_win", w: 3, d: [220, 2000], once: true, cond: S => S.flags.includes("ss_try") && !S.flags.includes("ss_out"), t: "親衛隊の結束は固い。肩書きが、少しだけ盾になる。", fx: { edge: 6, rel: 2, flags: ["ss_out", "ss_win"] } },
    { id: "x10_ss_lose", w: 2, d: [220, 2000], once: true, cond: S => S.flags.includes("ss_try") && !S.flags.includes("ss_out"), t: "親衛隊の名簿が流出した。あなたの情報も、一緒に。仲間は、誰も責任を取らない。", fx: { fameRisk: 25, mental: -8, flags: ["ss_out", "ss_lose"] } },
    { id: "x10_hogo", w: 3, d: [170, 2000], once: true, cond: S => S.flags.includes("trespass_done"), t: "通報され、保護された。児相と警察の記録に、あなたの名前が残る。", fx: { end: "hogo" } }
  );

  /* ================= 決断 ================= */
  HK.DECISIONS2.push(
    { id: "x10_nazi_late", w: 2, d: [280, 2000], once: true, cond: S => S.fac && S.fac !== "neonazi" && S.fac !== "ss", prompt: "TLの空気が荒れてきた。ネオナチ軍から、二度目の誘いが来た。「途中からでも、歓迎する」", choices: [
      { label: "途中からでも入る", t: "後から来た者にも門は開いているらしい。色が、ひとつ増えた。", fx: { fac: "neonazi", edge: 5, fame: 40, nareai: -3 } },
      { label: "断る", t: "二度目も断った。噂は、まもなく別の名前を探しに行った。", fx: { know: 1, mental: 1 } }
    ] },
    { id: "x10_trespass", w: 1, d: [150, 2000], once: true, prompt: "気になるヒカマーの家の前まで来てしまった。チャイムの前で、指が止まっている。", choices: [
      { label: "帰る", t: "引き返した。帰り道、我に返って、少しだけ怖くなった。", fx: { mental: 1, know: 1 } },
      { label: "ピンポンだけ押す", t: "応答はなかった。インターホンの録画に、あなたの後ろ姿が残っている。", fx: { happy: 1, fameRisk: 5 } },
      { label: "不法侵入する", t: "門を越えた瞬間、世界が変わった。全部、自分のせいだ。", fx: { flags: ["trespass_done"], mental: -8 } }
    ] },
    { id: "x10_facebet", w: 2, d: [150, 2000], once: true, prompt: "顔を晒して、著名化を一気に狙う。成功すれば時の人。失敗すれば、住所の候補。", choices: [
      { label: "賭ける", t: "写真を上げた。あとは、界隈が決めることだ。", fx: { flags: ["face_bet"], happy: 2 } },
      { label: "やめておく", t: "顔は、見せない。見せない強さもある。", fx: { mental: 2 } }
    ] },
    { id: "x10_ss_join", w: 1, d: [200, 2000], once: true, cond: S => !S.fac || S.fac === "neonazi", prompt: "ネオナチ親衛隊の「入隊面接」なるものが来た。所要時間は、三十分。", choices: [
      { label: "入隊する", t: "面接は、ほぼ雑談だった。腕章の代わりに、アイコンの色が一つ増えた。", fx: { flags: ["ss_try"], edge: 4, fame: 30 } },
      { label: "断る", t: "「遠慮しておきます」——面接官は、少し褒めてくれた。", fx: { mental: 1, know: 1 } }
    ] },
    { id: "x10_demo", w: 2, d: [100, 2000], era: [2025, 2026], prompt: "反ヒカキンデモの参加を誘われた。集合は、週末の昼。", choices: [
      { label: "参加する", t: "現地で、顔見知りのハンドルがいくつも見えた。名前を呼び合う声が、少し嬉しかった。", fx: { rel: 3, happy: 1, fameRisk: 5, edge: 1 } },
      { label: "参加しない", t: "週末は、家でTLを見ていた。デモのレポは、あとで全部読んだ。", fx: { know: 1 } }
    ] },
    { id: "x10_sanction_join", w: 2, d: [120, 2000], prompt: "制裁の祭りが始まった。あなたのタイムラインも、加わるかどうかを聞いている。", choices: [
      { label: "加わる", t: "引用の輪に加わった。祭りは暖かく、火は誰かの家で燃えていた。", fx: { happy: 2, rel: 2, edge: 2 } },
      { label: "加わらない", t: "静かにスクロールして通り過ぎた。聖人と呼ばれるほどでもない。ただ、夜はよく眠れた。", fx: { know: 1, mental: 2, flags: ["saint_like"] } }
    ] },
    { id: "x10_anti_anti", w: 2, d: [150, 2000], prompt: "ヒカマーアンチの投稿が流れてきた。噛みつくか、流すか。", choices: [
      { label: "対抗する", t: "引用で打ち返した。返り血の分だけ、ヒカマー度が上がった。", fx: { fame: 80, edge: 3, happy: 1 } },
      { label: "流す", t: "薬指のスクロールは止まらなかった。忍耐は、いつか武器になる。", fx: { mental: 2, know: 1 } }
    ] },
    { id: "x10_silent_week", w: 2, d: [100, 2000], once: true, cond: S => S.stats.mental <= 15, prompt: "一週間、誰の投稿にも反応できなかった。既読だけが、増えていく。", choices: [
      { label: "誰かに話す", t: "一人にだけ、全部話した。既読は、その日から普通の速度に戻った。", fx: { mental: 8, rel: 3 } },
      { label: "静かに閉じる", t: "画面を閉じた。通知は、二度と鳴らなかった。", fx: { end: "burnout" } }
    ] }
  );

  /* ================= 終わり方追加 ================= */
  D.endings.push(
    { id: "hogo", name: "保護された", desc: "家宅侵入が通報され、児相と警察の間に記録が残った。現実は、どんな裏垢より厳しい。" }
  );

  /* ================= 図鑑追加 ================= */
  D.zukan.push(
    { id: "n39", cat: "用語", name: "ネオナチ族", desc: "生まれながらにTLの色が決まっている家系。挨拶の語尾が、どこか違うらしい。" },
    { id: "n40", cat: "用語", name: "聖人", desc: "制裁の祭りに加わらない者の俗称。損をするが、夜はよく眠れる。" }
  );

  /* ================= 超レア: ネオナチ族に生まれる（1/667） ================= */
  const _orig = HK.engine2.newGame;
  HK.engine2.newGame = function (opts) {
    const S = _orig(opts);
    if (S.rng.chance(0.0015)) {
      S.flags.push("nazi_born");
      S.fac = "neonazi";
      S.hk.edge = HK.engine2.clamp(S.hk.edge + 8, 0, 100);
      S.hk.nareai = HK.engine2.clamp(S.hk.nareai + 4, -100, 100);
    }
    return S;
  };

  /* ================= 才覚ガチャ割り振り ================= */
  HK.EXTRA10 = {
    rollNums() {
      const a = [];
      for (let i = 0; i < 6; i++) a.push(25 + Math.floor(Math.random() * 71));   // 25〜95
      return a;
    },
    applyQualities(S, q) {
      const cl = HK.engine2.clamp;
      const old = S.qualities;
      S.stats.know = cl(S.stats.know + Math.round((q.intel - old.intel) / 10), 0, 100);
      S.stats.mental = cl(S.stats.mental + Math.round((q.mental - old.mental) / 10), 0, 100);
      S.hk.skill = cl(S.hk.skill + Math.round((q.action + q.intel + q.stamina - old.action - old.intel - old.stamina) / 15), 0, 100);
      S.heat = cl(S.heat + Math.round((q.stamina - old.stamina) / 10), 0, 100);
      const dInf = Math.max(0, Math.round((q.influence - 50) / 25)) - Math.max(0, Math.round((old.influence - 50) / 25));
      S.hk.followers = Math.max(0, S.hk.followers + dInf);
      S.encounterP = cl(0.25 + (((S.net && S.net.tier != null ? S.net.tier : 1) - 1) * 0.08) + (q.luck - 50) / 400, 0.1, 0.55);
      S.qualities = Object.assign({}, q);
    }
  };
})();
