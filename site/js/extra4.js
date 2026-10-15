/* =========================================================
   2万分の1のヒカマー v3 — 増量パック3
   名乗りパターン実測・参入経緯3種・きっかけ8種(実調査)・家/ネット拡張
   人口再検査(2026-10-15):
   - roster 1,152ハンドル中マーカー付き23.8%（mania20.3/manil等）
   - Wiki名簿1,266件中マーカー約46%
   - マーカーLP≈1,300〜4,300 → 全ヒカマー≈3,000〜8,000(代表~5,000)
   - 1億人÷5,000≒2万分の1
   ========================================================= */
window.HK = window.HK || {};

(function () {
  const D = HK.DATA2;

  /* ---------- 人口メタ更新 ---------- */
  D.meta.hikamersActive = 5000;
  D.meta.activeLo = 3000; D.meta.activeHi = 8000;
  D.meta.allHuman = "2万分の1";
  D.meta.ratioRange = "1.3万〜3万分の1";
  D.meta.markerShareRoster = "23.8%";   // roster実測
  D.meta.markerShareWiki = "46%";       // Wiki名簿実測
  D.meta.wikiRegistry = 1266;           // 2026-10-15実測
  D.meta.sukikira = "ヒカマー: 951票 / 総合2.97 / 肯定55.4%（ツイッタラ世論調査）";

  /* ---------- 家（+5種） ---------- */
  D.families.push(
    { id: "single", w: 10, label: "一人親家庭", desc: "帰宅すると静か。夕飯は自分の分を自分で温める。", money0: 0, monitor: 3 },
    { id: "grand", w: 8, label: "祖父母と同居", desc: "家にWi-Fiはあるが、祖父が「何を見てるんじゃ」と後ろに立つ。", money0: 100000, monitor: 5 },
    { id: "tenkin", w: 5, label: "転勤族", desc: "三年ごとに転校。ネットの友達だけが、ずっと同じ場所にいる。", money0: 200000, monitor: 3 },
    { id: "kenkyo", w: 8, label: "教育熱心な家", desc: "スマホの利用時間は毎週確認される。通知は全部、親の目つきの先にある。", money0: 400000, monitor: 8 },
    { id: "houchi", w: 6, label: "放任主義の家", desc: "何も言われない。それは自由で、少しだけ、さみしい。", money0: 0, monitor: 0 },
    { id: "daikazoku", w: 4, label: "大家族", desc: "兄弟が多く、スマホは常に誰かの手の中。自分の時間は奪い合いだ。", money0: -100000, monitor: 2 },
    { id: "anikyo", w: 6, label: "兄がネット中毒", desc: "兄のPCから、この界隈の空気を先に嗅いでいた。", money0: 100000, monitor: 2, tech: 2 },
    { id: "kaigai", w: 2, label: "海外在住", desc: "時差の向こう側からTLを覗く。日本語の速度に、いつも半日遅れて着く。", money0: 500000, monitor: 6 }
  );

  /* ---------- ネット環境（+7種） ---------- */
  D.nets.push(
    { id: "jippc", w: 6, label: "自作PCがある", desc: "メモリは増設済み。深夜の作業が捗る。", tier: 2, tech: 3 },
    { id: "hikari", w: 6, label: "自分の部屋に光回線", desc: "遅延ゼロの環境は、それ自体が才能になる。", tier: 2, tech: 1 },
    { id: "ipad", w: 6, label: "古いiPadのお下がり", desc: "画面はひび割れている。動作は、気持ちの問題で速い。", tier: 1, tech: 0 },
    { id: "gamekiki", w: 5, label: "携帯ゲーム機から", desc: "ブラウザの狭い画面が、最初の海だった。", tier: 1, tech: 1 },
    { id: "galake", w: 3, label: "ガラケーからの移民", desc: "絵文字の打ち方だけは、誰よりも早い。", tier: 0, tech: 0 },
    { id: "tethering", w: 4, label: "テザリング生活", desc: "ギガの残量と相談しながら、文字を打つ。", tier: 1, tech: 0 },
    { id: "nitai", w: 3, label: "スマホ2台持ち（親バレ用）", desc: "見せる用と、本物。二つの画面を使い分ける。", tier: 2, tech: 1 }
  );

  /* ---------- 参入の経緯（3パターン） ---------- */
  D.paths = [
    { id: "newbie", w: 60, label: "完全新規参入", desc: "ゼロからの一歩。名前も、フォロワーも、まっさらだ。", fx: {} },
    { id: "reinc", w: 20, label: "転生復活", desc: "前の垢を畳んで（あるいは凍結されて）戻ってきた。語録と身内の一部は、まだ手元にある。", fx: { goroku: 8, followers: 25, retireCount: 1, heat: 10 } },
    { id: "transfer", w: 20, label: "他界隈からの合流", desc: "元いたのは別の海。ノリの違いを、体で覚えながら泳ぎ始める。", fx: { followers: 40, edge: 6, dev: 4, nareai: -8, flags: ["transfer"] } }
  ];

  /* ---------- 参入のきっかけ（8種・実調査ベース 2026-10-16）
     出典: ヒカマーWiki「Handbooks/新規さんでも分かるヒカマー界隈」「音マー」「ノリチガ」「ヒカマー史/2019年」ほか
     ・界隈はX中心（本拠地はX・垢名/語録/タグ文化がTLで拡散）
     ・2019年の形成期は「音MAD界隈からの流入が多かった」とWikiに明記
     ・起源はYouTube発ヒカマニ×例のアレ（ヒカ淫）
     ※「まとめサイト経由」「botに拾われた」は証拠なしのため削除（実調査で否定） ---------- */
  D.triggers = [
    { id: "tl", w: 22, label: "XのTLに流れてきた", desc: "タイムラインの端で、見知らぬ語録が踊っていた。", fx: { know: 1 } },
    { id: "nico", w: 20, label: "ニコニコで掘り当てた", desc: "ランキングの奥で、見つけてしまった。", fx: { goroku: 2 } },
    { id: "yt", w: 15, label: "YouTubeのおすすめ", desc: "アルゴリズムは、あなたの人生を変えた。", fx: { happy: 1 } },
    { id: "inmu", w: 14, label: "淫夢界隈から流れてきた", desc: "元はホモガキの側だった。言葉の半分は、向こうで覚えた。", fx: { dev: 3, know: 1 } },
    { id: "friend", w: 10, label: "友達の布教", desc: "教室の隅か、通話の向こうか。気づいたら語録を喋っていた。", fx: { rel: 2 } },
    { id: "wiki", w: 7, label: "ヒカマーWikiを読み込んで", desc: "気づけばHandbooksを端から端まで読んでいた。", fx: { know: 2, goroku: 1 } },
    { id: "discord", w: 6, label: "Discordサーバーで見つけて", desc: "サーバー一覧から、最初の部屋の扉を叩いた。", fx: { skill: 1 } },
    { id: "stream", w: 6, label: "配信の生放送で流れた", desc: "見ていた配信の雑談中に、何度も同じ語録が流れてきた。", fx: { happy: 1, know: 1 } }
  ];

  /* ---------- 名乗りパターン（実測ベース） ---------- */
  D.romaji = ["hikari", "sakura", "kumo", "tori", "sigma", "meron", "milk", "kohaku", "zero", "nine", "kome", "kagu", "sora", "kaze", "yuki", "hoshi", "mori", "komei", "tema", "torikku"];
  D.extendWords = ["jaywalk", "plasticlove", "osakana", "gasoe", "desktop", "monkey", "clarinet", "oyster", "subdirt", "ninniku", "saboten", "kappa", "tengu", "komainu"];
  D.handlePatterns = [
    // [id, weight, 生成用]
    { id: "mania_u", w: 18 },   // [noun][mod]_mania
    { id: "mania", w: 8 },      // [extend]mania
    { id: "mania_end", w: 4 },  // [noun]mania
    { id: "manila", w: 2 },     // [noun]_manila / Manira風
    { id: "mani", w: 6 },       // [noun]_mani / [noun]mani
    { id: "mani_jp", w: 6 },    // [noun]マニ / [noun]まに
    { id: "mania_jp", w: 5 },   // [noun]マニア
    { id: "kin", w: 5 },        // [noun]キン / [noun]kin / キン[noun]
    { id: "tv", w: 4 },         // [noun]TV / [noun]キンTV
    { id: "bot", w: 4 },        // [noun]bot / [noun]名言bot
    { id: "dotted", w: 1 },     // ネ.オ.ナ.チ.風ドット連結
    { id: "plain", w: 37 }      // 無印: [romaji][digits] / [noun][digits] / [romaji]
  ];

  /* ---------- 人口検査メモ（しくみ表示用） ---------- */
  D.populationNotes = [
    "名乗り調査(2026-10-15): 界隈ネットワーク1,152ハンドル中、_mania等のマーカー付きは23.8%（残り76.2%は無印名義）",
    "Wiki「ヒカマー一覧」実測1,266件（うちマーカー風 約46%）",
    "マーカー限定の捕獲再捕獲≈1,300〜4,300 → マーカー比率で割り戻すと全ヒカマー≈3,000〜8,000（代表値5,000）",
    "1億人(日本のネット人口) ÷ 5,000 ≒ 2万分の1（幅: 1.3万〜3万分の1）",
    "参考: ツイッタラ世論調査「ヒカマー」= 951票・総合2.97・肯定55.4%"
  ];

  /* ---------- 図鑑: 名乗り文化 ---------- */
  D.zukan.push(
    { id: "n1", cat: "文化", name: "名乗りの掟", desc: "「_mania」が主流だが、マニ・キン・TV・マニア・bot・無印まで幅がある。実測ではマーカー付きは約4分の1。" },
    { id: "n2", cat: "文化", name: "ネ.オ.ナ.チ.式", desc: "ドットで区切った挑発的な名乗り。由来は特定の人物のハンドルから。数は少ないが忘れられない。" },
    { id: "n3", cat: "文化", name: "転生垢", desc: "凍結・引退の後に戻ってきた垢。名前に「2」がついたり、小文字が増えたりする。" },
    { id: "n4", cat: "文化", name: "無印ヒカマー", desc: "マーカーなしで界隈にいる人々。実測でマジョリティ。見た目では分からない。" },
    { id: "n5", cat: "文化", name: "参入の道", desc: "入り口は主にニコニコの音MAD界隈とXのTL。2019年ごろは音MAD界隈からの流入が主流で、いまはXで文化に触れて入る人が多い。Wikiを読み込んでから来る人も。" },
    { id: "n6", cat: "文化", name: "ノリチガ", desc: "他所の界隈のノリを持ち込んだまま馴染めない人を指す言葉（「ノリが違う」の略）。嫌われるのはノリ自体より、指摘されても固執する姿勢から。過度な認定は自治厨とされる。" }
  );

  /* 既存称号に名乗り系条件はないが、フラグ用にtransferを記録済み */
})();
