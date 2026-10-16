/* =========================================================
   10万分の1のヒカマー v3 — イベント（日単位） / 決断 / 暦イベント
   d: [最小日, 最大日]（参入からの経過日数）
   m: 対象月のリスト / era: [最小年, 最大年]
   fx: {happy,mental,hp,know,rel,fame,goroku,skill,fameRisk,banRisk,money,nareai,edge,dev,heat,flags,zukan,viral}
   ========================================================= */
window.HK = window.HK || {};

/* ================= 暦イベント（毎年巡ってくる日） ================= */
HK.CAL_EVENTS = [
  { id: "cal_ny", m: 1, d: [1], t: "新年。TLは「あけましておめでとう」の語録ローテーションで埋まった。あなたも便乗した。", fx: { happy: 2, nareai: 1, zukan: ["t2019"] } },
  { id: "cal_anniv_year", m: 1, d: [2, 5], t: "年間最優秀ヒカマーの投票が始まった。TLが「誰に入れた」で埋まる季節。", fx: { happy: 1, know: 1, zukan: ["c23"] } },
  { id: "cal_valentine", m: 2, d: [14], t: "バレンタイン。界隈の誰かがチョコの画像を貼り、誰かが「関係ない」と引用した。", fx: { happy: 1 } },
  { id: "cal_giw", m: 5, d: [1, 6], t: "GW。TLが一日中フル稼働している。休みの日のネットは、少しだけ優しい。", fx: { happy: 2, heat: 3 } },
  { id: "cal_511", m: 5, d: [11], t: "5.11。一斉凍結の日から一年。TLは「あの日」の思い出と、消えた垢の名前で静かに賑わった。", fx: { mental: -1, know: 1, zukan: ["c18", "e6"] } },
  { id: "cal_demo516", m: 5, d: [16], t: "五・一六。デモの話、行った人の報告、行かない理由。「現実でやるべきか」の議論がまた始まる。", fx: { know: 1, edge: 1, zukan: ["e2"] } },
  { id: "cal_summer", m: 7, d: [20, 31], t: "夏休みに入った。TLの滞在時間が全員倍になっている。", fx: { happy: 2, heat: 2 } },
  { id: "cal_obon", m: 8, d: [13, 16], t: "お盆。帰省の報告、「田舎の電波が死んでる」の報告。", fx: { happy: 1 } },
  { id: "cal_beastday", m: 8, d: [10], t: "野獣の日。聖地の報告が流れ、今年も何かが起きたらしい。", fx: { happy: 2, heat: 3, zukan: ["e8", "p3"] } },
  { id: "cal_freeze_season", m: 7, d: [14, 20], t: "7月中旬。凍結の噂がまた流れ始めた季節。強い垢が静かに消えていく。", fx: { mental: -1, banRisk: 1, zukan: ["c18"] } },
  { id: "cal_harvest", m: 9, d: [1, 10], t: "新学期。夏の間の滞在型から、学校の合間型に切り替わる。TLが少し速くなる。", fx: { know: 1 } },
  { id: "cal_sports", m: 9, d: [10, 30], t: "体育祭・文化祭の季節。学校の写真を上げるなという注意が毎年流れる。", fx: { happy: 1, fameRisk: 1 } },
  { id: "cal_oning", m: 10, d: [31], t: "ハロウィン。仮装アイコンがTLに並ぶ。", fx: { happy: 1 } },
  { id: "cal_xmas", m: 12, d: [24, 25], t: "クリスマス。界隈の恋愛事情が露出する日。恒例の「一人ではない」報告合戦。", fx: { happy: 1, mental: -1 } },
  { id: "cal_omisoka", m: 12, d: [31], t: "大晦日。年越しスペースが開かれ、みんなでカウントダウンした。", fx: { happy: 2, nareai: 2, heat: 2 } },
  { id: "cal_fuku", m: 12, d: [3], t: "12月3日。開発光のあの投稿の日付を、界隈の誰かが黙って引用していた。", fx: { dev: 1, zukan: ["c13", "h5"] } },
  { id: "cal_waseda", m: 11, d: [10, 25], t: "模試の結果が返ってきた。判定より、TLの未読の方が気になる。", fx: { know: 1, happy: -1 } },
  { id: "cal_testweek", m: 6, d: [10, 25], t: "期末テスト一週間前。TLを閉じる決意をして、三時間後に開いた。", fx: { know: 2, happy: -2 } },
  { id: "cal_april", m: 4, d: [1], t: "エイプリルフール。垢名を偽って遊ぶ者が続出し、誰が誰だか分からない一日。", fx: { happy: 1, nareai: 1 } },
  { id: "cal_newterm", m: 4, d: [2, 12], t: "新年度。クラス替え・進級の報告がTLを流れる。", fx: { know: 1, rel: 1 } },
  /* 時代固有（参入年と同年のみ発火） */
  { id: "cal_2020_lockdown", m: 4, d: [7, 30], era: [2020, 2020], t: "緊急事態宣言。学校が休みになり、ネットが生活の全部になった。", fx: { happy: 1, know: 1, heat: 3 } },
  { id: "cal_2021_olympics", m: 7, d: [23, 31], era: [2021, 2021], t: "オリンピック開幕（無観客）。みんなで画面越しに盛り上がった。", fx: { happy: 2 } },
  { id: "cal_2023_mania_exit", m: 2, d: [15, 28], era: [2023, 2023], t: "ヒカマニ本家引退の報。界隈に「これからどうするんだ」の空気が流れた。", fx: { mental: -2, know: 1, zukan: ["t2023"] } },
  { id: "cal_2026_onicha", m: 4, d: [5, 30], era: [2026, 2026], t: "ONICHA騒動の渦の中。TLがかつてない速度で流れている。", fx: { heat: 3, dev: 2, zukan: ["e3", "g2"] } },
  { id: "cal_2026_present", m: 10, d: [1, 15], era: [2026, 2026], t: "10月。コーン茶が発売され、TLがまた一色になった。", fx: { dev: 1, happy: 1 } }
];

/* ================= 通常イベント ================= */
HK.EVENTS2 = [
  /* ---- 参入期（1〜30日） ---- */
  { id: "n_first_followers", w: 8, d: [1, 5], once: true, t: "参入から数日。フォローしてくれた人が10人を超えた。名前を一人ずつ覚えようとした。", fx: { happy: 2, nareai: 1 } },
  { id: "n_first_reply", w: 8, d: [1, 7], once: true, t: "初めてのリプが来た。「はじめまして」。心臓が少し跳ねて、返信に10分かけた。", fx: { happy: 3, rel: 1 } },
  { id: "n_goroku_try1", w: 8, d: [2, 14], once: true, t: "初めて語録を自力で使った。文脈が合っていたかどうか、一晩考えた。", fx: { goroku: 3, happy: 1 } },
  { id: "n_scroll_hell", w: 7, d: [1, 10], t: "タイムラインを三時間スクロールした。何を見たかは覚えていない。", fx: { happy: -1, know: 1, heat: 1 } },
  { id: "n_followback", w: 6, d: [1, 20], t: "フォロバが返ってきた。APIの制限と戦いながら、指で数えて管理した。", fx: { happy: 1, rel: 1 } },
  { id: "n_icon", w: 5, d: [1, 10], once: true, t: "アイコンを決めるのに一晩かけた。三日後に変えた。", fx: { happy: 1 } },
  { id: "n_profile", w: 5, d: [1, 10], once: true, t: "プロフィールを書いた。語録を三つ詰め込んだ。翌日一つ減らした。", fx: { goroku: 1, happy: 1 } },
  { id: "n_nightfall", w: 6, d: [1, 30], t: "気づけば深夜2時。明日の朝のことを考えるのを、今日はやめた。", fx: { hp: -1, happy: 1, flags: ["nightowl"] } },
  { id: "n_nareai_circle", w: 6, d: [3, 30], t: "同世代の新参と相互になった。「同じ日に参入した」というだけで連帯感がある。", fx: { rel: 2, nareai: 2 } },
  { id: "n_watch_toys", w: 4, d: [5, 40], t: "おもちゃの存在を初めて知った。いじる側の気持ちと、いじられる側の気持ちを、両方想像した。", fx: { know: 1, zukan: ["c3"] } },

  /* ---- 日常（いつでも） ---- */
  { id: "d_tl_morning", w: 9, d: [2, 2000], t: "朝のTL。「おはよう」の語録が並ぶ、界隈で一番穏やかな時間帯。", fx: { happy: 1, nareai: 1 } },
  { id: "d_tl_kaigi", w: 8, d: [2, 2000], t: "タイムラインで朝会が始まっていた。あなたはひとつ語録を置いて、コーヒーを飲んだ。", fx: { happy: 1, nareai: 1 } },
  { id: "d_keyboard_war", w: 6, d: [5, 2000], t: "知らない者同士の言い争いが始まっていた。誰が正しいかは、もう誰も覚えていない。", fx: { know: 1, mental: -1, zukan: ["c17"] } },
  { id: "d_good_post", w: 6, d: [3, 2000], cond: S => S.hk.goroku >= 40, t: "あなたのポストに「うまい」のリプがついた。小さな、確かな手応え。", fx: { happy: 2, fame: 40 } },
  { id: "d_quote_memo", w: 6, d: [2, 120], once: true, t: "新参の語録メモを投稿した。先輩から補足の引用RTが来た。それが授業だった。", fx: { goroku: 2, nareai: 1 } },
  { id: "d_oldpost", w: 4, d: [30, 2000], t: "自分の昔のポストが引用されていた。三か月前の自分は、今の自分より元気だった。", fx: { happy: 1 } },
  { id: "d_kaigai", w: 3, d: [10, 2000], t: "海外のヒカマーから英語でリプが来た。「Hikamer?」とだけ書いてあった。", fx: { happy: 1, know: 1 } },
  { id: "d_goroku_miss", w: 5, d: [5, 300], cond: S => S.hk.goroku < 60, t: "語録の使い方を間違えた。先輩から「それ、こう使うゾ」と公開添削された。", fx: { goroku: 2, happy: -1 } },
  { id: "d_nareai_win", w: 5, d: [10, 2000], t: "相互とのリプが弾んだ。意味のない会話が、意味のある時間だった。", fx: { happy: 2, rel: 1, nareai: 2 } },
  { id: "d_spaced", w: 4, d: [20, 2000], t: "スペースをながら聴きした。誰かが熱弁する声を、あなたは作業しながら聞いていた。", fx: { know: 1, zukan: ["p5"] } },
  { id: "d_screenshot", w: 4, d: [15, 2000], t: "TLの面白いやりとりをスクショした。フォルダにはもう200枚ある。", fx: { happy: 1 } },
  { id: "d_word_new", w: 4, d: [30, 2000], t: "新しい語録が生まれる瞬間を見た。あなたは少し、歴史の目撃者だった。", fx: { goroku: 1, know: 1 } },
  { id: "d_fav_100", w: 4, d: [10, 2000], cond: S => S.hk.followers >= 100, t: "いいねが100を超えた投稿ができた。通知欄が赤くなっているのを見て、笑った。", fx: { happy: 2, fame: 30 } },
  { id: "d_komaru", w: 3, d: [20, 2000], t: "界隈の誰かが困っていた。あなたはリプでなくDMを送った。返事は三行だった。", fx: { rel: 1, happy: 1 } },
  { id: "d_gakko", w: 7, d: [10, 900], t: "学校。授業中、ノートの端に語録を書いて消した。", fx: { know: 1, happy: 1 } },
  { id: "d_test", w: 6, d: [10, 900], m: [5, 6, 11, 12], t: "テスト期間。一夜漬けの割に、いつもより手応えがあった。", fx: { know: 3, happy: -2 } },
  { id: "d_test_fail", w: 4, d: [10, 900], m: [6, 7, 12, 1], t: "テストの結果が返ってきた。順位表の真ん中より、少し下だった。", fx: { know: 1, happy: -2 } },
  { id: "d_club", w: 4, d: [10, 900], t: "部活のあと、汗を流してからスマホを開いた。TLは一日分の速さで進んでいた。", fx: { hp: 1, rel: 1 } },
  { id: "d_rain", w: 4, d: [10, 2000], t: "雨の日。外に出る予定が消えて、ネット時間が増えた。", fx: { happy: 1, heat: 1 } },
  { id: "d_rust", w: 3, d: [10, 2000], t: "自転車がパンクした。修理代をTLで愚痴ったら、予想外に伸びた。", fx: { happy: -1, fame: 20 } },
  { id: "d_food", w: 5, d: [5, 2000], t: "新作のコンビニスイーツを食べた。包装を捨てる前に写真を撮った。ヒカマー飯。", fx: { happy: 1 } },
  { id: "d_game_night", w: 5, d: [10, 900], t: "夜、ゲームのランクが上がった。TLに報告したら、誰かが「おめ」と言ってくれた。", fx: { happy: 2, rel: 1 } },
  { id: "d_sleep_fail", w: 4, d: [30, 2000], t: "寝落ちして朝を迎えた。通知が400件。指が勝手にスクロールを始める。", fx: { hp: -2, happy: 1 } },
  { id: "d_delivery", w: 3, d: [20, 2000], t: "深夜にラーメンを作って食べた。写真を上げたら「飯テロ」のリプが並んだ。", fx: { happy: 1, hp: -1 } },

  /* ---- 成長・バズ ---- */
  { id: "g_buzz_small", w: 6, d: [30, 2000], cond: S => S.hk.skill >= 12 || S.hk.goroku >= 45, t: "まあまあ伸びた。通知が止まらない二時間だった。", fx: { fame: 60, happy: 3 } },
  { id: "g_buzz_mid", w: 3, d: [60, 2000], cond: S => S.hk.skill >= 30 || S.hk.goroku >= 60, t: "バズった。見知らぬ大物の引用が並び、あなたは半日TLの主役だった。", fx: { fame: 350, happy: 4, mental: 1 } },
  { id: "g_buzz_big", w: 2, d: [90, 2000], once: true, cond: S => S.hk.skill >= 45 || S.hk.goroku >= 70, t: "大きめのバズ。フォロワーが一晩で数百増えた。数字が怖くなって、アプリを閉じた。", fx: { fame: 2000, happy: 5, fameRisk: 2 } },
  { id: "g_buzz_viral", w: 2, d: [150, 2000], cond: S => (S.hk.skill >= 60 || S.hk.goroku >= 80) && (S._virals || 0) < 2, t: "大バズ。あなたの投稿が界隈の外まで流れた。フォロワー通知が止まらない夜は、少し怖かった。", fx: { fame: 9000, happy: 6, fameRisk: 5, viral: true } },
  { id: "g_quote_famous", w: 3, d: [60, 2000], cond: S => S.hk.followers >= 300, t: "あなたのポストが界隈の定番構文として使われ始めた。嬉しさと、少しの責任。", fx: { happy: 3, goroku: 1, fame: 80 } },
  { id: "g_fanart", w: 2, d: [90, 2000], cond: S => S.hk.followers >= 800, t: "あなたのアイコンを描いた人が現れた。これは絶対に保存しておくべきものだ。", fx: { happy: 4, fame: 100 } },
  { id: "g_paper", w: 2, d: [120, 2000], cond: S => S.hk.followers >= 1500, t: "ヒカマー新聞にあなたの活動が載った。切り抜いてスクショした。", fx: { happy: 4, fame: 200, zukan: ["p7"] } },
  { id: "g_wiki_page", w: 2, d: [150, 2000], cond: S => S.hk.followers >= 2000, once: true, t: "ヒカマーWikiにあなたの項目が立った。読み方が一文字間違っていた。でも嬉しかった。", fx: { happy: 5, fame: 300, zukan: ["p2"] } },
  { id: "g_collab_invite", w: 3, d: [60, 800], cond: S => S.hk.skill >= 40, once: true, t: "合作の誘いが来た。名義がエンドロールに並ぶ。あなたの名前は、誰かの隣にあった。", fx: { fame: 300, skill: 4, rel: 2, happy: 2 } },
  { id: "g_senior", w: 3, d: [90, 2000], cond: S => S.hk.followers >= 1000, t: "新参があなたに語録の使い方を聞いてきた。教える側に回っていた。", fx: { happy: 2, nareai: 2, rel: 1 } },

  /* ---- 制作 ---- */
  { id: "s_draw", w: 4, d: [10, 900], cond: S => S.focus === "sakusei", t: "線画が一枚仕上がった。投稿した。いいねが三つ。それが嬉しい。", fx: { skill: 3, happy: 1 } },
  { id: "s_draw2", w: 3, d: [30, 900], cond: S => S.hk.skill >= 30 && S.focus === "sakusei", t: "色を塗り直したら、見違えた。上達は階段ではなく、たまにエレベーターだ。", fx: { skill: 4, happy: 2 } },
  { id: "s_video", w: 3, d: [30, 900], cond: S => S.hk.skill >= 35 && S.focus === "sakusei", t: "初めての編集作品が50再生を超えた。数字は小さいが、沼の入り口だった。", fx: { skill: 4, fame: 30 } },
  { id: "s_ai", w: 3, d: [90, 2000], era: [2023, 2026], cond: S => S.focus === "sakusei", t: "AI生成で作品を作った。速い。楽しい。少し、白々しい。", fx: { skill: 3, fame: 100, know: 1 } },
  { id: "s_bot", w: 2, d: [60, 2000], cond: S => S.hk.skill >= 50, once: true, t: "botを作って公開した。誰かのタイムラインで、あなたの作ったものが動いている。", fx: { skill: 5, fame: 150, flags: ["builder"] } },
  { id: "s_site", w: 1, d: [120, 2000], cond: S => S.hk.skill >= 65, once: true, t: "界隈向けの小さなサイトを作って公開した。数人が使ってくれた。それで十分だ。", fx: { skill: 6, fame: 250, flags: ["builder"] } },
  { id: "s_mad", w: 2, d: [60, 900], cond: S => S.flags.includes("mad"), t: "作業机の音素材が溜まっていく。誰も見ていない作業が、作品の大半だ。", fx: { skill: 3 } },
  { id: "s_burnout", w: 3, d: [60, 2000], cond: S => S.focus === "sakusei" && S.stats.mental < 55, t: "制作が義務になってきた。楽しいはずのものが、ノルマになっていく。", fx: { mental: -3, skill: 1 } },

  /* ---- リアルとの両立 ---- */
  { id: "r_exam_push", w: 5, d: [180, 1200], m: [1, 2, 11, 12], cond: S => S.focus === "real", t: "受験直前。あなたはスマホを引き出しに入れた。勉強の合間に、一回だけ開いた。", fx: { know: 6, happy: -2, heat: -2 } },
  { id: "r_baito", w: 4, d: [300, 1500], cond: S => S.age >= 16, t: "バイトを始めた。初給料でフルーツパーラーに行き、TLに報告した。", fx: { money: 40000, happy: 2, rel: 1, hp: -1 } },
  { id: "r_school_bare", w: 3, d: [30, 900], t: "クラスメイトに、あなたがヒカマーであることがバレた。「趣味悪くない?」と言われた。", fx: { happy: -2, rel: -1 } },
  { id: "r_family", w: 3, d: [30, 900], t: "家族にスマホの画面を見られた。スクロールの指が止まる。あの0.5秒の恐怖。", fx: { happy: -2, mental: -1 } },
  { id: "r_friend", w: 3, d: [30, 900], t: "リアルの友達が、実は例のアレに詳しかった。二人で顔を見合わせて笑った。", fx: { rel: 3, happy: 2 } },
  { id: "r_love", w: 3, d: [200, 1500], cond: S => S.age >= 15, t: "好きな人ができた。名前は言える。でも、あなたの垢名は言えない。", fx: { happy: 2, mental: 1 } },
  { id: "r_move", w: 2, d: [200, 1500], once: true, t: "引っ越しをした。新しい部屋で最初にしたのは、TLの位置情報をオフにすることだった。", fx: { happy: -1, know: 1, fameRisk: -5 } },
  { id: "r_kenko", w: 3, d: [300, 2000], t: "健康診断。視力が落ちていた。画面のせいだと、医者に釘を刺された。", fx: { hp: -1, know: 1 } },

  /* ---- トラブル ---- */
  { id: "t_kusomove", w: 5, d: [20, 2000], t: "クソムーブをやらかした。勢いで書いたポストの通知が、朝には赤くなっていた。", fx: { happy: -2, mental: -2, fame: -30, zukan: ["g4"] } },
  { id: "t_sticky", w: 4, d: [60, 2000], cond: S => S.hk.followers >= 200, t: "見知らぬアカウントから粘着された。毎朝、過去のポストに一つずつ、いいねが付く。", fx: { mental: -2, happy: -1 } },
  { id: "t_kyoei", w: 3, d: [30, 2000], t: "あなたの発言が切り取られて、界隈の外に拡散された。文脈はどこにも書かれていなかった。", fx: { mental: -3, fame: 60, fameRisk: 3 } },
  { id: "t_kaiji_dm", w: 3, d: [60, 2000], cond: S => S.hk.fameRisk >= 35, t: "「開示します」というDM。定型文だ。だが、あなたは一時間調べものをした。", fx: { mental: -2, zukan: ["c16", "p9"] } },
  { id: "t_utor", w: 3, d: [60, 2000], t: "あなたの名義を使った偽垢を見つけた。通報した。三日後に消えた。", fx: { know: 1, zukan: ["c25"] } },
  { id: "t_null", w: 3, d: [30, 2000], t: "誤爆した。消す前にスクショが誰かに撮られていた。界隈の速度はそういうものだ。", fx: { happy: -2, mental: -2 } },
  { id: "t_inmu_tension", w: 3, d: [30, 2000], t: "淫夢厨とヒカマーの小競り合いがTLの端で起きていた。あなたは距離を測った。", fx: { know: 1, dev: 1 } },
  { id: "t_slandered", w: 2, d: [90, 2000], t: "あなたについての嘘が拡散した。反論するか、黙るか。時間が解決した部分と、しなかった部分がある。", fx: { mental: -3, fame: 40 } },
  { id: "t_freeze_notice", w: 3, d: [60, 2000], cond: S => S.hk.banRisk >= 30, t: "アカウントに制限がかかった。「しばらく投稿できません」。心臓が跳ねた。", fx: { mental: -2, banRisk: -5 } },
  { id: "t_frozen_other", w: 4, d: [30, 2000], t: "仲の良い相互が凍結された。復活を祈るポストがTLに並んだ。", fx: { mental: -2, rel: -1, zukan: ["c18"] } },
  { id: "t_offline_threat", w: 1, d: [120, 2000], cond: S => S.hk.fameRisk >= 40, t: "「お前の学校の近くまで来た」というリプが届いた。冗談だと信じた。信じるしかなかった。", fx: { mental: -4, happy: -2, fameRisk: 3 } },

  /* ---- 界隈ドラマ ---- */
  { id: "k_naisen", w: 4, d: [60, 2000], cond: S => S.era >= 2023, t: "内戦が始まった。TLが二つに割れて、どちらも正論を言っている。仲裁は誰もしない。", fx: { know: 1, mental: -1, zukan: ["c19"] } },
  { id: "k_seisai_call", w: 4, d: [30, 2000], t: "「こいつだけ制裁しない?」の空気ができていた。あなたのRT一つが、波を作る。", fx: { edge: 2, zukan: ["c1"] } },
  { id: "k_toy_new", w: 3, d: [60, 2000], t: "新しいおもちゃが認定された。当人も、いじる側も、どこか楽しそうだった。", fx: { know: 1, zukan: ["c3"] } },
  { id: "k_goroku_war", w: 3, d: [30, 2000], t: "語録の元ネタ論争が起きた。正しいのは誰かではなく、面白いのはどれかで決着した。", fx: { goroku: 1, know: 1 } },
  { id: "k_ponytail", w: 2, d: [90, 2000], t: "古参の一人が静かに消えた。最後のポストは、いつも通りの朝の挨拶だった。", fx: { mental: -1, know: 1 } },
  { id: "k_rehab", w: 3, d: [60, 2000], t: "活動休止していた人が復帰した。「おかえり」のリプが並ぶ。あなたも送った。", fx: { happy: 2, rel: 1, zukan: ["c24"] } },

  /* ---- 病み・心 ---- */
  { id: "m_yami", w: 3, d: [90, 2000], cond: S => S.stats.mental < 45, t: "あなたのポストの温度が、少しずつ下がっていった。誰も気づかない速度で。", fx: { mental: -4, zukan: ["g6"] } },
  { id: "m_yami_ret", w: 3, d: [120, 2000], cond: S => S.stats.mental < 50, t: "明け方のTLに、誰かが「しんどい」と書いていた。誰も引用せず、いいねだけがついていた。", fx: { mental: -2, rel: 1 } },
  { id: "m_kind_dm", w: 3, d: [60, 2000], cond: S => S.stats.mental < 60, t: "知らないヒカマーからDMが来た。「大丈夫? 昔、あなたのポストで笑った者です」と。", fx: { mental: 6, happy: 3 } },
  { id: "m_recharge", w: 4, d: [60, 2000], cond: S => S.stats.mental >= 60, t: "一日ネットを休んだ。戻ってきたら、TLは変わらず在那里にあった。それは安心だった。", fx: { hp: 2, mental: 4, heat: -2 } },
  { id: "m_realize", w: 2, d: [200, 2000], t: "ふと、自分が何のためにTLを見ているのか分からなくなった。五分後にはスクロールしていた。", fx: { know: 2, mental: -1 } },

  /* ---- アルカイダ・過激 ---- */
  { id: "a_tl_alq", w: 4, d: [30, 2000], era: [2025, 2026], t: "TLの端で、アルカイダ系の投稿が流れてきた。目を逸らす者、通報する者、笑ってる者。", fx: { edge: 1, mental: -1, zukan: ["c2"] } },
  { id: "a_alq_wave", w: 2, d: [90, 2000], era: [2025, 2026], t: "アルカイダの波が来ている。正直なところ、TLが一番賑やかなのはこういう時だ。", fx: { edge: 2, happy: 1, zukan: ["c2"] } },
  { id: "a_wplace", w: 2, d: [120, 2000], era: [2025, 2026], t: "wplaceの領土争いに参加した。ピクセルのために、見知らぬ誰かと協力した。", fx: { happy: 2, edge: 1, zukan: ["e5"] } },

  /* ---- 長寿・熟成（300日以降） ---- */
  { id: "l_veteran", w: 4, d: [365, 2000], t: "気づけば古参と呼ばれる側になった。新参の言葉に、少しだけ追いつけていない。", fx: { know: 2, goroku: 1 } },
  { id: "l_generation", w: 3, d: [400, 2000], t: "あなたが入った頃の常識が、もう通じなくなっている。「昔はな」と言いかけて、やめた。", fx: { mental: -1, know: 1 } },
  { id: "l_persist", w: 3, d: [365, 2000], t: "同時期に参入した顔ぶれは、もう半分も残っていない。残っているだけで、何かである。", fx: { happy: 2 } },
  { id: "l_reunion", w: 2, d: [500, 2000], t: "数年ぶりに復帰した古参と挨拶を交わした。あなたの名前を、向こうは覚えていた。", fx: { happy: 3, rel: 2 } },
  { id: "l_museum", w: 2, d: [600, 2000], t: "自分の初投稿が、過去ログとして誰かの引用に現れた。昔のあなたは、ずっと元気だった。", fx: { happy: 1 } },
  { id: "l_restart", w: 2, d: [300, 2000], cond: S => S.hk.retireCount >= 1, t: "復帰してから、時間の流れが違う。前よりゆっくりで、前より楽しい。", fx: { happy: 3, mental: 2 } },

  /* ---- 分岐フラグ用 ---- */
  { id: "f_respect", w: 2, d: [120, 2000], cond: S => S.hk.goroku >= 60 && S.hk.nareai >= 30, t: "新参の間で、あなたの語録の使い方が手本にされていた。責任を感じた。", fx: { happy: 3, nareai: 3, goroku: 1 } }
];

/* ================= 決断 ================= */
HK.DECISIONS2 = [
  { id: "j_style", w: 20, d: [1, 2], once: true, prompt: "参入の挨拶をどう書く?",
    choices: [
      { label: "丁寧な自己紹介（趣味・学年・一言）", t: "丁寧な挨拶は好印象だった。「よろしくお願いします」のリプが並んだ。", fx: { rel: 2, nareai: 1 } },
      { label: "語録満載のノリで", t: "語録を四つ入れた自己紹介は、通な新参として少し話題になった。", fx: { goroku: 3, fame: 15, nareai: 2 } },
      { label: "短文一行だけ", t: "「よろしくお願いします」だけ。シンプルは強い。誰も悪く言わなかった。", fx: {} }
    ] },
  { id: "j_first_night", w: 12, d: [1, 3], once: true, prompt: "参入初日の深夜。TLはまだ流れている。",
    choices: [
      { label: "午前2時まで見る", t: "深夜のTLの温度を知った。これは癖になる。", fx: { happy: 2, hp: -1, flags: ["nightowl"] } },
      { label: "早めに寝る", t: "明日の自分に投資した。", fx: { hp: 1, know: 1 } }
    ] },
  { id: "j_follow_tour", w: 14, d: [1, 7], once: true, prompt: "フォロー回り。TLで見かけたアカウントをどう選ぶ?",
    choices: [
      { label: "同世代の新参に片っ端から", t: "同世代の相互が一気に増えた。賑やかだが、少しだけ薄い繋がり。", fx: { rel: 2, nareai: 2, heat: 1 } },
      { label: "古参・実力者を厳選して", t: "警戒されたが、一人だけ話してくれる先輩ができた。", fx: { rel: 1, know: 2 } },
      { label: "全然知らない界隈の人を眺めるだけ", t: "あなたはフォロー数を増やさなかった。タイムラインは静かなまま。", fx: {} }
    ] },
  { id: "j_icon_war", w: 6, d: [2, 10], once: true, prompt: "アイコンを何にするかで、初対面の印象が決まる。",
    choices: [
      { label: "自作の絵", t: "味のある手描きアイコンは覚えてもらいやすい。", fx: { skill: 2, happy: 1 } },
      { label: "好きな素材の切り抜き", t: "素材アイコンは無難で、角が立たない。", fx: {} },
      { label: "文字だけ", t: "文字アイコンの人が出るのは、中堅になってからだ。", fx: { know: 1 } }
    ] },
  { id: "j_friend_hide", w: 8, d: [3, 30], once: true, prompt: "リアルの友達が「お前ツイッターやってるだろ」と聞いてきた。",
    choices: [
      { label: "正直に言う", t: "驚くほど普通に受け入れられた。リアルの友達が一人、こちらの世界を知った。", fx: { rel: 3, happy: 2 } },
      { label: "隠す", t: "「やってないよ」。自分の側の世界を、あなたは鍵のかかった箱にした。", fx: { mental: -1, know: 1 } }
    ] },
  { id: "j_sanction_first", w: 10, d: [7, 90], prompt: "タイムラインでヒカマーズ制裁が始まっている。対象はタグ荒らしらしい。",
    choices: [
      { label: "一行だけ構文を投げる", t: "加勢した。10秒の仕事だった。", fx: { edge: 3, nareai: 2, banRisk: 2, happy: 1, zukan: ["c1"] } },
      { label: "ROMる", t: "あなたは見ていた。加わらなかった。それだけのこと。", fx: { happy: 1, mental: 1 } },
      { label: "やめるように呼びかける", t: "誰も聞かなかった。逆にあなたが少し叩かれた。", fx: { happy: -2, edge: -3 } }
    ] },
  { id: "j_selfie", w: 7, d: [30, 400], once: true, prompt: "界隈では自撮りを出すと知名度が一段上がる。あなたのスマホには今朝撮った写真がある。",
    choices: [
      { label: "加工して出す", t: "通知が止まらなかった。あなたの顔が界隈の中心に置かれた。", fx: { fame: 200, fameRisk: 18, happy: 3, zukan: ["c14"] } },
      { label: "素のまま出す", t: "勇気のいる一歩。あなたの素顔がアイコンやネタに使われ始めた。", fx: { fame: 350, fameRisk: 28, happy: 2, zukan: ["c14"] } },
      { label: "出さない", t: "写真を消した。顔を明かさない者のネットは、静かだが安全だ。", fx: { mental: 3 } }
    ] },
  { id: "j_alq_try", w: 4, d: [40, 500], era: [2025, 2026], once: true, prompt: "ヒカマーズアルカイダ——TLに不快画像を流す荒業。面白いやつがやっている。",
    choices: [
      { label: "一回だけやってみる", t: "投げた。数秒後に「きた」という反応。これは笑いか、迷惑か。", fx: { edge: 8, banRisk: 12, happy: 2, flags: ["alqaeda"], zukan: ["c2"] } },
      { label: "通報した", t: "静かに通報ボタンを押した。正しさとノリは、いつも少しずれている。", fx: { edge: -3, mental: 1 } },
      { label: "何もしない", t: "スクロールを続けた。TLの端の出来事は、流れていった。", fx: {} }
    ] },
  { id: "j_vpn", w: 6, d: [30, 600], once: true, cond: S => S.hk.fameRisk >= 30, prompt: "住所特定祭りの気配がTLに出ている。ネットリテラシーを見直す機運が来ている。",
    choices: [
      { label: "VPNと捨て情報の勉強をする", t: "2時間で泳ぎ方を覚えた。海は広いが、少し安全になった。", fx: { fameRisk: -25, know: 3 } },
      { label: "自分は大丈夫だと思う", t: "この判断は、多くの人の人生を変えてきた。", fx: { fameRisk: 5 } }
    ] },
  { id: "j_resuban", w: 8, d: [20, 2000], prompt: "タイムラインで、あなたに喧嘩を売ってくるアカウントがいる。全員が見ている。",
    choices: [
      { label: "受けて立つ", t: "言葉を選んで返した。勝敗は裁定されない。だが、あなたは後悔していない。", fx: { fame: 60, happy: -1, mental: -2, goroku: 1, flags: ["resuban"], zukan: ["c17"] } },
      { label: "無視", t: "「勝ち逃げ」と言われた。時間は有限だ。", fx: { mental: 2 } },
      { label: "ミュートして忘れる", t: "ミュートは最強の構文である。", fx: { happy: 2, mental: 2 } }
    ] },
  { id: "j_kaiji_reply", w: 5, d: [40, 900], once: true, cond: S => S.hk.fameRisk >= 35, prompt: "「お前の住所、特定できるよ」というDMが来た。捨て垢。真偽は不明。",
    choices: [
      { label: "無視する", t: "既読スルーして閉じた。心臓は少し速かった。ここでビビったら負けだ。", fx: { mental: -2, happy: -1 } },
      { label: "スクショして晒す", t: "晒した。TLが沸いた。笑いものにすると同時に、守られた。", fx: { fame: 80, edge: 2, fameRisk: 4 } },
      { label: "「開示だな。震えて眠れ」と返す", t: "構文で返した。界隈は大喜利になった。", fx: { happy: 1, goroku: 3, nareai: 2, zukan: ["g14"] } }
    ] },
  { id: "j_art_start", w: 8, d: [30, 300], once: true, prompt: "練習帳が1冊終わった。界隈には上手い絵師が山ほどいる。",
    choices: [
      { label: "描き続ける", t: "手が痛くなるまで描いた。前より速く描ける。", fx: { skill: 6, happy: -1, flags: ["artist"] } },
      { label: "見る側に回る", t: "筆を置いた。見ることも、できる。", fx: { happy: 1, know: 1 } }
    ] },
  { id: "j_edit", w: 6, d: [30, 300], once: true, prompt: "動画編集ソフトの体験版を入れた。タイムラインが画面に並ぶ。",
    choices: [
      { label: "1本作ってみる", t: "3日かけて47秒の動画ができた。通知が鳴るたび、心臓が跳ねた。", fx: { skill: 10, happy: 2, fame: 60 } },
      { label: "閉じる", t: "向いていない、と自分に言い聞かせた。", fx: { know: 1 } }
    ] },
  { id: "j_mad", w: 5, d: [30, 300], once: true, prompt: "界隈で音MADが流行りはじめている。",
    choices: [
      { label: "機材とソフトを揃える", t: "小遣いを全部使った。最初の作品は無音だった。それでも笑った。", fx: { skill: 8, money: -30000, happy: 2, flags: ["mad"] } },
      { label: "眺める", t: "作る人の凄さを、誰よりも知っている眺め方だった。", fx: { happy: 1, goroku: 1 } }
    ] },
  { id: "j_bigp", w: 5, d: [60, 800], once: true, cond: S => (S.hk.skill >= 50 || S.hk.goroku >= 65), prompt: "あなたの投稿がじわじわ伸び始めている。通知が止まらない。",
    choices: [
      { label: "追い投稿で畳みかける", t: "三日間、あなたのプロフィールには知らない人たちが並んだ。", fx: { fame: 5000, skill: 2, happy: 3, fameRisk: 5, flags: ["buzzmaster"] } },
      { label: "静かに見送る", t: "波は引いた。だが海は覚えている。", fx: { happy: 1, mental: 2 } }
    ] },
  { id: "j_monetize", w: 4, d: [120, 1500], once: true, cond: S => S.hk.followers >= 3000, prompt: "「収益化しないか」という誘い。ヒカマニ周辺で金を稼ぐのは、界隈ではタブーだ。",
    choices: [
      { label: "受ける", t: "数万円が入った。それを知っているヒカマーは、C字の口になっている。", fx: { money: 150000, happy: 3, edge: 3, flags: ["monetized"] } },
      { label: "断る", t: "「嫌儲の精神」を全うした。財布は薄いが、心は軽い。", fx: { nareai: 3, happy: -1 } },
      { label: "無言で関わるのをやめる", t: "そのDMを、既読のまま、開かなかった。", fx: { mental: 1 } }
    ] },
  { id: "j_offkai", w: 5, d: [60, 900], prompt: "界隈の人たちがオフ会を開くらしい。誘われた。",
    choices: [
      { label: "参加する", t: "会話は最初の5分で普通になった。インターネットが人に戻る瞬間を見た。", fx: { rel: 4, happy: 3, fameRisk: 8, zukan: ["c15"], flags: ["met_people"] } },
      { label: "行かない", t: "行かなかった。行きたかった。両方が本当だ。", fx: { happy: -1, mental: -1 } }
    ] },
  { id: "j_degiko", w: 3, d: [90, 900], once: true, cond: S => S.flags.includes("met_people"), prompt: "界隈の連中が「開発邸に凸ろう」と騒いでいる。あなたも誘われた。",
    choices: [
      { label: "一緒に行く", t: "行った。門の前で写真を撮って、30分で帰った。楽しかったが、後で少し怖くなった。", fx: { happy: 2, fame: 150, fameRisk: 12, edge: 3, zukan: ["c20", "p4"] } },
      { label: "止める", t: "「やめとけ、絶対後悔する」。一人は残った。あなたはその一人と、駅前で飯を食った。", fx: { rel: 3, mental: 2, happy: 1 } },
      { label: "知らん顔", t: "関わらなかった。翌日のTLに、その日の映像が流れていた。", fx: { know: 1 } }
    ] },
  { id: "j_uchu", w: 4, d: [40, 900], prompt: "TLで「みんなで何か作ろう」の空気ができている。あなたはどう動く?",
    choices: [
      { label: "企画を立てる", t: "進行表を作り、締切を決め、八割は守られなかった。それでも何かが生まれた。", fx: { fame: 300, rel: 3, mental: -3, flags: ["builder"] } },
      { label: "作品で参加する", t: "あなたは名前だけを置いた。それでいい。", fx: { skill: 3, fame: 80 } },
      { label: "見学する", t: "完成を一番近くで見たのは、あなたかもしれない。", fx: { happy: 1 } }
    ] },
  { id: "j_friend_fire", w: 5, d: [60, 2000], prompt: "仲の良い相互が炎上している。あなたのリプ欄にも「お前の友達だろ」が来ている。",
    choices: [
      { label: "擁護する", t: "公開で擁護した。あなたにも火が飛んだが、後悔はしていない。", fx: { rel: 4, fame: -20, mental: -2, happy: 1 } },
      { label: "静観する", t: "何も言わなかった。波は引いた。彼とは、少し話しにくくなった。", fx: { rel: -2, mental: 1 } },
      { label: "便乗して叩く", t: "安全側に立った。だがTLのあなたの言葉が、前より安く見える。", fx: { rel: -4, mental: -3, fame: 30 } }
    ] },
  { id: "j_uchinaisen", w: 4, d: [90, 2000], cond: S => S.era >= 2023, prompt: "界隈が二つの陣営に割れている。どちらにも友達がいる。",
    choices: [
      { label: "片方につく", t: "陣営の一員になった。守られるが、あなたの言葉は旗になった。", fx: { edge: 3, rel: 2, mental: -2, zukan: ["c19"] } },
      { label: "中立を宣言", t: "「どっちでもない」。誰からも信頼されず、誰からも嫌われなかった。", fx: { know: 2, happy: 1 } },
      { label: "黙ってROMに徹する", t: "あなたは静かにしていた。戦争は、あなた抜きで終わった。", fx: { mental: 2 } }
    ] },
  { id: "j_retire_offer", w: 5, d: [200, 2000], cond: S => S.stats.mental < 45 || S.hk.heat < 20, prompt: "TLを見る指が、前より重い。そろそろ、という言葉が浮かぶ。",
    choices: [
      { label: "まだ続ける", t: "「まだやる」。その一言が、明日の自分を連れてくる。", fx: { happy: 1, mental: 2, heat: 6 } },
      { label: "活動を減らす", t: "投稿を週一にした。TLはあなたがいなくても流れていく。それが少し、寂しい。", fx: { heat: -8, mental: 1, happy: -1 } },
      { label: "引退を考える", t: "考えた。まだ決めない。決めないことにも、意味がある。", fx: { mental: -1 } }
    ] },
  { id: "j_taiin", w: 3, d: [365, 2000], prompt: "同期が次々と消えていく。あなたの順番が、近づいている気がする。",
    choices: [
      { label: "燃え尽きるまで走る", t: "熱が戻った。この界隈で、熱は全てである。", fx: { heat: 12, happy: 3, hp: -2 } },
      { label: "卒業を選ぶ", t: "現実を本業にすると決めた。寂しいが、これは選択だ。", fx: { flags: ["graduated"], mental: 3, happy: -2, end: "graduated" } }
    ] },
  { id: "j_declare", w: 5, d: [150, 2200], prompt: "引退という二文字が、頭から離れない。宣言するなら、今のうちだ。TLは構文を待っている。",
    choices: [
      { label: "「ヒカマー引退します。」を投稿する", t: "投稿した。構文どおりの一文。だが、指は震えていた。", fx: { end: "retire", happy: -2, mental: 2 } },
      { label: "投稿して即撤回する", t: "「やっぱり続けます」。界隈は許した。この界隈は、そういう界隈だ。", fx: { retire: true, happy: 2 } },
      { label: "下書きに保存する", t: "下書きフォルダの一番上に、しばらく居座ることになった。", fx: { mental: 1 } }
    ] },
  { id: "j_expel", w: 3, d: [180, 2200], cond: S => S.hk.edge >= 60 || (S.flags.includes("doxxed") && S.hk.fameRisk >= 30), prompt: "炎の後始末がつかない。あなたの居場所が、少しずつ削られている。",
    choices: [
      { label: "界隈を去る", t: "あなたは静かに去った。通知が止まるまで、三日かかった。", fx: { end: "expelled", mental: 2 } },
      { label: "居座ってやる", t: "居座った。嫌われても、ここはあなたの場所だ。", fx: { edge: 3, mental: -3, happy: -1 } }
    ] },
  { id: "j_lastcall", w: 6, d: [260, 2200], cond: S => S.stats.mental < 55 || S.heat < 30 || S.dayNum >= 600, prompt: "TLを見る指が、前より重い。そろそろ、という言葉が浮かんでいる。",
    choices: [
      { label: "引退する", t: "あなたは自分の言葉で、幕を引いた。", fx: { end: "retire" } },
      { label: "もう少しだけ続ける", t: "「もう少しだけ」。この界隈の全員が、一度は言った言葉だ。", fx: { heat: 10, happy: 1, mental: 1 } }
    ] },
  { id: "j_romlife", w: 4, d: [60, 2000], prompt: "投稿するより、見ている方が楽しい自分に気づいた。",
    choices: [
      { label: "ROMに切り替える", t: "あなたは見る専になった。泡は消えず、透明になった。", fx: { flags: ["rom"], mental: 3, heat: -10, zukan: ["c8"] } },
      { label: "無理にでも投稿する", t: "投稿は筋トレのようなものだ。続けていると、また楽しくなってくる。", fx: { happy: 1, heat: 6 } },
      { label: "しばらく休む", t: "アプリを端にやり、本を読んだ。三日後に戻ってきた。", fx: { mental: 4, hp: 2 } }
    ] },
  { id: "j_ponz", w: 3, d: [30, 600], once: true, prompt: "「短期間でフォロワーを増やす方法がある」とDMが来た。怪しい。",
    choices: [
      { label: "話を聞く", t: "フォロワー販売だった。断ったが、世の中には買う人がいるらしい。", fx: { know: 2 } },
      { label: "晒す", t: "晒したら、同じDMが界隈で流行っていたことが分かった。", fx: { fame: 50, happy: 1 } }
    ] },
  { id: "j_typhoon", w: 2, d: [30, 2000], m: [8, 9], prompt: "台風が来ている。休校の期待と、停電の不安。",
    choices: [
      { label: "わくわくする", t: "結果、普通に登校だった。TLは全員残念がった。", fx: { happy: -1 } },
      { label: "備える", t: "モバイルバッテリーを満タンにした。ネットリテラシーの一部は、防災である。", fx: { know: 1 } }
    ] },
  { id: "j_confess", w: 3, d: [200, 1500], once: true, prompt: "現実の友達に、自分の垢を見せようか迷っている。",
    choices: [
      { label: "見せる", t: "「これがお前か…」。笑い声。世界が一つ増えた。", fx: { rel: 3, happy: 3, fameRisk: 3 } },
      { label: "見せない", t: "この世界は、自分のもののままにしておいた。", fx: { mental: 1 } }
    ] },
  { id: "j_exam_choice", w: 4, d: [300, 1200], once: true, cond: S => S.age <= 18, prompt: "進路調査票が配られた。志望欄は空白のまま、スマホは光っている。",
    choices: [
      { label: "現実の側に固定する", t: "あなたは現実側に自分を固定した。ネットはその脇で、静かに続く。", fx: { know: 4, flags: ["grounded"] } },
      { label: "今は決めない", t: "空白のまま出した。進路は、あとからついてくる。", fx: { happy: 1 } }
    ] },
  { id: "j_shigoto", w: 3, d: [500, 2000], once: true, cond: S => S.age >= 18, prompt: "就職活動。ESの趣味欄に「ネット文化の研究」と書けそうな自分がいる。",
    choices: [
      { label: "書く。事実だから", t: "面接官は「詳しく」と聞いてきた。あなたは半分だけ話した。", fx: { know: 5, money: 200000, rel: 2 } },
      { label: "書かない", t: "別の言葉で自分を説明した。帰り道、あの時間が一番濃かったことを、あなたは知っている。", fx: { know: 3, mental: 1 } }
    ] },
  { id: "j_oshirase", w: 4, d: [90, 2000], prompt: "伝説的な古参が、久しぶりに浮上した。リプ欄がお祭りになっている。",
    choices: [
      { label: "リプを送る", t: "「おかえりなさい」。500件の中の一つ。それでも送った。", fx: { rel: 2, happy: 2 } },
      { label: "見ているだけで満足", t: "あなたはTLの端で、ただ嬉しかった。", fx: { happy: 1 } }
    ] },
  { id: "j_koi", w: 3, d: [200, 1500], once: true, cond: S => S.age >= 15, prompt: "好きな人からLINEが来た。スマホには、開きかけのXもある。",
    choices: [
      { label: "即レスする", t: "会話は弾んだ。TLのことは、その晩は忘れていた。", fx: { happy: 4, rel: 2, heat: -3 } },
      { label: "TLを優先する", t: "既読から30分。気づいた時には、会話は終わっていた。", fx: { happy: -2, mental: -1 } }
    ] },
  { id: "j_haishin", w: 3, d: [120, 1500], cond: S => S.hk.followers >= 500, prompt: "スペースで自分の企画をやらないか、と誘われた。",
    choices: [
      { label: "やる", t: "声が震えた30分だった。終わったあと、指が冷たくなっていた。", fx: { fame: 200, happy: 2, mental: -2, rel: 2 } },
      { label: "断る", t: "「声は出さない主義で」。これはこれで、通る。", fx: { mental: 1 } }
    ] },
  { id: "j_goods", w: 2, d: [150, 1500], once: true, cond: S => S.hk.skill >= 50, prompt: "「グッズ作らない?」の誘い。利益が出そうだが、嫌儲の界隈だ。",
    choices: [
      { label: "作る（利益は寄付）", t: "利益は全額寄付した。「らしい」と好意的に受け取られた。", fx: { fame: 250, happy: 3, money: -10000 } },
      { label: "作る（利益は自分のもの）", t: "売れた。C字の口が三個くらい見えた。", fx: { money: 80000, edge: 2, happy: 2 } },
      { label: "断る", t: "「金の匂いがするものは作りません」。嫌儲の鑑である。", fx: { nareai: 2 } }
    ] },
  { id: "j_hozon", w: 3, d: [200, 2000], prompt: "あなたの功績をWikiにまとめたい、と言ってくる人がいる。",
    choices: [
      { label: "協力する", t: "項目ができた。読み方が一文字間違っていた。それでも嬉しかった。", fx: { fame: 200, happy: 4, zukan: ["p2"] } },
      { label: "断る", t: "「まだ早い」。伝説は、生きているうちに固定されない方が面白い。", fx: { mental: 1 } }
    ] },
  { id: "j_fukkatsu2", w: 3, d: [200, 2000], cond: S => S.hk.retireCount >= 1, prompt: "一度引退した身で、また名前を呼ばれている。",
    choices: [
      { label: "ひっそり戻る", t: "宣言なしの復帰。「おかえり」の数が、前より増えていた。", fx: { happy: 3, rel: 2 } },
      { label: "完全に沈黙を守る", t: "あなたはログインだけして、閉じた。伝説は話さない方が伝説らしい。", fx: { mental: 2 } }
    ] },
  { id: "j_hikkoshi", w: 2, d: [300, 1500], once: true, cond: S => S.age >= 17, prompt: "進学・就職で、生まれ故郷を離れることになりそうだ。",
    choices: [
      { label: "離れる", t: "新しい街で、新しい部屋で、同じTL。ネットは引っ越しの荷物にならない。", fx: { know: 2, happy: 2, money: -100000 } },
      { label: "残る", t: "地元に残る選択。TLの友達との距離は、変わらなかった。", fx: { rel: 2 } }
    ] },
  { id: "j_kojin", w: 3, d: [90, 2000], prompt: "病みかけの相互が、「全部消したい」と呟いている。",
    choices: [
      { label: "DMを送る", t: "「生きてる?」。既読がついた。それだけで、あなたは今日いいことをした。", fx: { rel: 3, mental: 2, happy: 1 } },
      { label: "公開リプで励ます", t: "「大丈夫か」。公開の優しさは、時に刃になる。彼は少し、距離を置いた。", fx: { rel: -1, happy: -1 } },
      { label: "何もできない", t: "あなたは何もできなかった。そういう夜が、あなたの人生にも、いくつかある。", fx: { mental: -2 } }
    ] },
  { id: "j_kaigi", w: 3, d: [60, 2000], prompt: "「界隈の空気が悪い」という議題でスペースが立っている。",
    choices: [
      { label: "聞きに行く", t: "二時間聞いた。結論は出なかったが、みんな少しだけ落ち着いた顔をしていた。", fx: { know: 2, rel: 1 } },
      { label: "不参加", t: "始まって、終わった。TLの空気は、翌日には戻っていた。", fx: {} }
    ] },
  { id: "j_goroku_mitame", w: 4, d: [30, 2000], prompt: "新語録を自分で作って流行らせるチャンスがある。",
    choices: [
      { label: "仕掛けてみる", t: "三日後に三人が使っていた。小さな流行は、こうやって始まる。", fx: { goroku: 4, fame: 60, happy: 2 } },
      { label: "既存の語録を大事に使う", t: "古い語録を正しい文脈で使う。それもまた、上級者の芸だ。", fx: { goroku: 2, nareai: 1 } }
    ] },
  { id: "j_senpai_goroku", w: 3, d: [30, 600], once: true, prompt: "古参が「最近の新参は語録が雑」と言っている。",
    choices: [
      { label: "教えを乞う", t: "DMで質問した。半日後、丁寧な返事が来た。この界隈、根本は優しい。", fx: { goroku: 3, rel: 2, happy: 2 } },
      { label: "反発する", t: "「古参ぶってるだけでは」。小さな火花が散った。", fx: { edge: 2, goroku: 1, mental: -1 } }
    ] },
  { id: "j_kokuchi", w: 3, d: [90, 2000], once: true, prompt: "大手のまとめに、界隈が取り上げられそうになっている。",
    choices: [
      { label: "当事者として補足を書く", t: "長文の補足を書いた。まとめは結局、その一部しか拾わなかった。", fx: { know: 2, mental: -1, fame: 50 } },
      { label: "静観", t: "知らない世界に説明するのは、疲れる。あなたは静かにした。", fx: { mental: 1 } }
    ] },
  { id: "j_aruaru", w: 4, d: [10, 600], prompt: "「ヒカマーあるある」の投稿が作りたくなった。",
    choices: [
      { label: "書いて投稿", t: "「わかる」のリプが並んだ。共感は最も強い承認だ。", fx: { happy: 3, fame: 40, nareai: 1 } },
      { label: "下書きのまま保存", t: "下書きフォルダが、また一つ増えた。", fx: { know: 1 } }
    ] },
  { id: "j_daihyou2", w: 2, d: [200, 2000], cond: S => S.hk.followers >= 1500, once: true, prompt: "界隈の大きな企画の主催を「お前しかいない」と押し付けられそうだ。",
    choices: [
      { label: "引き受ける", t: "3週間、生活はサーバーと締切に支配された。そして当日、みんなが笑った。それで報われた。", fx: { fame: 700, happy: 2, rel: 4, mental: -4, flags: ["builder"] } },
      { label: "断る", t: "「今は無理」。言えた。これは強さだ。", fx: { mental: 2 } }
    ] },
  { id: "j_taijou", w: 2, d: [300, 2000], cond: S => S.hk.freezes >= 1, prompt: "凍結から戻ったばかりのあなたに、こんな提案が来た:「サブ垢を育てないか」",
    choices: [
      { label: "育てる", t: "影のアカウントができた。メインが消えても、あなたは消えない。", fx: { skill: 2, mental: 3, heat: 2 } },
      { label: "一つの顔で生きる", t: "あなたは一つの名前で生きることにした。", fx: { happy: 1 } }
    ] },
  { id: "j_shashin", w: 3, d: [60, 900], prompt: "校区の写真がタイムラインで流れてきた。あなたも今日、空がきれいだった。",
    choices: [
      { label: "位置情報なしで上げる", t: "「きれい」のリプが来た。空の写真は、なぜか伸びる。", fx: { happy: 2, fame: 20 } },
      { label: "上げない", t: "自分語りはリスク。教訓は、もう骨に染みている。", fx: {} }
    ] },
  { id: "j_name2", w: 2, d: [90, 1200], once: true, prompt: "垢名を変えたくなってきた。今の名前は、もう自分の顔になっている。",
    choices: [
      { label: "変える", t: "新しい名前は一週間で馴染んだ。でも古い名前で呼ぶ人が、三人いた。", fx: { happy: 1, fade: 0, rel: -1, fame: -20 } },
      { label: "変えない", t: "この名前は、あなたの最初の選択だった。", fx: { happy: 1 } }
    ] },
  { id: "j_bunshin", w: 2, d: [200, 2000], cond: S => S.flags.includes("doxxed"), prompt: "特定されたあとの世界。あなたはどう生きる?",
    choices: [
      { label: "堂々と続ける", t: "隠すのをやめたら、肩が軽くなった。叩く者より、心配する者の方が多かった。", fx: { mental: 4, happy: 2 } },
      { label: "静かに垢を移す", t: "新しい名前、新しいアイコン。知っている人は、もうこちらにいる。", fx: { fameRisk: -20, mental: 2, fame: -100 } }
    ] },
  { id: "j_oyako", w: 2, d: [200, 2000], once: true, prompt: "親が「最近スマホばっかり」と怒った。",
    choices: [
      { label: "少しだけ減らす", t: "週に二時間、TLの外の時間を作った。世界は意外と、そのままだった。", fx: { hp: 2, mental: 3, heat: -3 } },
      { label: "反発する", t: "「関係ないだろ」。扉が閉まる音がした。", fx: { happy: -2, mental: -1 } },
      { label: "素直に謝る", t: "「ごめん」。それだけで、空気が戻った。意外なほど簡単だった。", fx: { rel: 2, happy: 1 } }
    ] },
  { id: "j_kanrinin", w: 2, d: [200, 2000], cond: S => S.hk.skill >= 60, once: true, prompt: "掲示板かWikiの管理を手伝わないか、と誘われた。",
    choices: [
      { label: "引き受ける", t: "管理者になった。掃除と喧嘩の仲裁の日々。名誉と、思いのほかのめんどくささ。", fx: { fame: 300, know: 3, mental: -2, flags: ["builder"] } },
      { label: "やめておく", t: "「そういうのは向いてない」。自分をよく分かっている。", fx: { know: 1 } }
    ] }
];
