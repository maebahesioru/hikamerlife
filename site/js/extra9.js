/* =========================================================
   10万分の1のヒカマー v3.15 — リプ追補パック（新着5件）
   ・アフォカス→ヒカマーズ制裁→制裁の雨エンド
   ・万引き → 防犯カメラ拡散リスク
   ・反ネオナチグループ結成 → 抗争
   ・二重言葉使い（勝手に解釈される）
   ・女マー生まれ: 性別を隠すか、囲われるか
   ========================================================= */
window.HK = window.HK || {};

(function () {
  const D = HK.DATA2;
  const X8 = HK.EXTRA8;

  /* タイプ追加: 二重言葉使い */
  X8.archetypes.push({ id: "nijuu", label: "二重言葉使い", w: 5, fx: { know: 4, edge: 3 } });

  /* ================= イベント ================= */
  HK.EVENTS2.push(
    { id: "x9_arch_nijuu", w: 2, d: [30, 2000], cond: S => S.archId === "nijuu", t: "自分の投稿を読み返したら、二通りに読めた。それから、二重言葉だけで喋るようになった。", fx: { know: 2, edge: 2 } },
    { id: "x9_double_misread", w: 2, d: [100, 2000], cond: S => S.archId === "nijuu", t: "あなたの投稿が、別の誰かへの当てつけとして解釈され始めた。二重言葉は、読む人の数だけ増える。", fx: { fame: 80, fameRisk: 8 } },
    { id: "x9_seisai_over", w: 3, d: [200, 2000], once: true, cond: S => S.flags.includes("seisai_endure"), t: "制裁は三日で終わるはずだった。三週間目に入っても、通知は鳴り続けている。祭囃子は、遠くから聞くと音楽に似ている。", fx: { end: "seisai_end" } },
    { id: "x9_anti_war", w: 2, d: [180, 2000], once: true, cond: S => S.flags.includes("antinazi_leader"), t: "反ネオナチグループとネオナチ軍の抗争が、日を跨いで続いている。「どっちに付く?」の引用が、あなたにも届く。", fx: { fame: 100, fameRisk: 10, heat: 10 } },
    { id: "x9_manbiki_seen", w: 2, d: [160, 2000], once: true, cond: S => S.flags.includes("manbiki") && S.flags.includes("manbiki_stay"), t: "あの夜の防犯カメラの映像が、SNSで拡散され始めた。「これ、ヒカマーの◯◯じゃね?」——夜のコンビニの灯りが、思い出される。", fx: { fameRisk: 15, mental: -6 } }
  );

  /* ================= 決断 ================= */
  HK.DECISIONS2.push(
    /* アフォカス → 制裁 */
    { id: "x9_afokasu", w: 2, d: [100, 2000], once: true, prompt: "勢いで、TLで一番イジられている話題に乗っかった。朝には「アフォカス」の引用が、あなたの名前ごと並んでいた。", choices: [
      { label: "撤回して謝る", t: "投稿を消して、頭を下げた。祭りは、次の生贄を探しに行った。", fx: { mental: -2, fame: -20 } },
      { label: "突っぱねる", t: "「何が悪い」——言い切った。空気が、一段冷たくなった。", fx: { flags: ["seisai_target"], edge: 4 } },
      { label: "ネタにして笑う", t: "自分からミーム化した。笑いが取れた分だけ、矢面は丸くなった。", fx: { edge: 3, happy: 2, fame: 30 } }
    ] },
    { id: "x9_seisai_rain", w: 3, d: [120, 2000], once: true, cond: S => S.flags.includes("seisai_target"), prompt: "ヒカマーズ制裁が始まった。リプ欄が祭囃子になり、あなたの過去ログまで掘られ始めた。", choices: [
      { label: "公開で土下座する", t: "長文の謝罪を投稿した。傷は深いが、雨は上がり始めた。", fx: { mental: -8, fameRisk: -10 } },
      { label: "黙殺して耐える", t: "何も言わずに耐えた。TLは、忘れるより先に飽きる。……はずだった。", fx: { flags: ["seisai_endure"], mental: -6 } },
      { label: "燃やし返す", t: "引用の雨に、油を注いだ。火事は、お互いの家まで燃える。", fx: { edge: 8, banRisk: 22, mental: -4 } }
    ] },

    /* 万引き */
    { id: "x9_manbiki", w: 2, d: [150, 2000], once: true, prompt: "深夜のコンビニ。棚の前で、魔が差した。", choices: [
      { label: "何もせず出る", t: "何も買わずに出た。外の空気が、やけに冷たくて気持ちいい。", fx: { mental: 1 } },
      { label: "やらかす", t: "警報は鳴らなかった。家までの道が、いつもより長く感じた。", fx: { flags: ["manbiki"], mental: -5, fameRisk: 10 } }
    ] },
    { id: "x9_manbiki_caught", w: 4, d: [170, 2000], once: true, cond: S => S.flags.includes("manbiki"), prompt: "防犯カメラの映像が、SNSに流れている。切り抜きが回り、あなたの特徴が特定されつつある。", choices: [
      { label: "店に弁済して謝る", t: "店に足を運び、頭を下げて払った。店主は静かに「もう来るな」と言った。", fx: { money: -30000, mental: -5, fameRisk: -12 } },
      { label: "逃げ続ける", t: "見つからないことを祈った。ネットの検索は、祈りより強い。", fx: { flags: ["manbiki_stay"], mental: -4 } }
    ] },
    { id: "x9_manbiki_end", w: 5, d: [240, 2000], once: true, cond: S => S.flags.includes("manbiki_stay") && S.hk.fameRisk >= 50, prompt: "実名で報道された。「ネットで特定された男」——あなたの界隈歴は、ここで詰んだ。", choices: [
      { label: "現実に向き合う", t: "ネットの速さは、法律より速く、人生より重い。", fx: { end: "doxxing" } }
    ] },

    /* 反ネオナチグループ */
    { id: "x9_antinazi", w: 1, d: [150, 2000], once: true, prompt: "ネオナチ軍のノリがTLを埋めている。対抗して、反ネオナチグループでも立ち上げるか。", choices: [
      { label: "立ち上げる", t: "グループ名を決め、募集の投稿をした。一晩で、三十人が集まった。", fx: { flags: ["antinazi_leader"], fame: 150, edge: 4, nareai: 2 } },
      { label: "静観する", t: "眺めていることにした。TLの戦争に、野次馬の席はある。", fx: { know: 1 } }
    ] },

    /* 女マー */
    { id: "x9_fem", w: 3, d: [40, 2000], once: true, cond: S => S.sex === "f", prompt: "この界隈では、女は珍しい。TLでは、性別を隠すか、女マーとして囲われるかの二択を迫られる。", choices: [
      { label: "性別を隠す", t: "プロフィールに性別は置かない。言葉だけが、あなたの輪郭になった。", fx: { flags: ["fem_hidden"], mental: 3 } },
      { label: "女マーとして振る舞う", t: "隠さないことにした。TLの扱いが、次の日から明らかに変わった。", fx: { flags: ["fem_public"], fame: 120, rel: 4 } }
    ] },
    { id: "x9_enclosure", w: 2, d: [120, 2000], once: true, cond: S => S.flags.includes("fem_public"), prompt: "「女マー囲い」の輪が、あなたを中心にできつつある。守るという言葉で、出口が塞がっていく。", choices: [
      { label: "線を引く", t: "「私は誰のものでもない」——その一言で、輪は半分になった。半分で、ちょうどいい。", fx: { mental: 3, nareai: -2 } },
      { label: "ノリに乗る", t: "囲われることは、寂しくない。寂しくないことが、少しだけ怖い。", fx: { fame: 200, edge: 5, mental: -2 } }
    ] }
  );

  /* ================= 終わり方追加 ================= */
  D.endings.push(
    { id: "seisai_end", name: "制裁の雨", desc: "ヒカマーズ制裁に晒され続け、傘を探しているうちに界隈歴が終わった。" }
  );

  /* ================= 図鑑追加 ================= */
  D.zukan.push(
    { id: "n35", cat: "用語", name: "アフォカス", desc: "イジられ続ける側に貼られるタグ。一度貼られると、剥がすには時間が要る。" },
    { id: "n36", cat: "文化", name: "反ネオナチグループ", desc: "ネオナチ軍に対抗して結成される集まり。大抵、抗争で両方疲弊して終わる。" },
    { id: "n37", cat: "用語", name: "二重言葉", desc: "リプでもDMでも読める文章術。意味は、読む人の数だけ増える。" },
    { id: "n38", cat: "用語", name: "女マー", desc: "界隈では珍しい存在。隠すか、公表して囲われるかの二択を迫られる。" }
  );
})();
