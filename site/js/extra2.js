/* =========================================================
   4万分の1のヒカマー v2 — 追加コンテンツ（増量パック）
   ========================================================= */
window.HK = window.HK || {};

(function () {
  // ---- 追加イベント ----
  HK.EVENTS2.push(
    /* 学校・季節 */
    { id: "x_schooltrip", w: 3, d: [90, 600], m: [5, 6, 9, 10], t: "修学旅行。夜、同室の誰かが布団の中でスマホを光らせていて、全員で笑った。", fx: { happy: 3, rel: 2, heat: 1 } },
    { id: "x_culture", w: 3, d: [60, 600], m: [9, 10], t: "文化祭の準備で忙しい。合間にTLを開くと、界隈も同じように文化祭の話で持ちきりだった。", fx: { know: 1, rel: 2, happy: 1 } },
    { id: "x_sports_day", w: 3, d: [60, 600], m: [5, 6, 9, 10], t: "体育祭。走って、転んで、笑われて。帰宅後にすべてをTLに報告した。", fx: { hp: 1, rel: 1, happy: 2 } },
    { id: "x_graduation", w: 2, d: [400, 1200], m: [3], once: true, t: "卒業式。教室の椅子のネジの緩さまで、全部覚えている気がした。", fx: { know: 2, rel: 2, happy: 2 } },
    { id: "x_ny_course", w: 2, d: [200, 1200], m: [1], t: "冬期講習。教室の窓から見える空が、TLの背景と似ていた。", fx: { know: 3, happy: -1 } },
    { id: "x_heatwave", w: 2, d: [30, 2000], m: [7, 8], t: "猛暑。エアコンの効いた部屋から出る理由が、一つもない。", fx: { hp: -1, heat: 1 } },
    { id: "x_cold", w: 2, d: [60, 2000], m: [12, 1, 2], t: "寒波。手がかじかんで、ポストの誤字率が上がった。", fx: {} },
    /* 界隈の光景 */
    { id: "x_densetsu_sonzai", w: 2, d: [90, 2000], t: "伝説のアカウントが、久しぶりに一言だけ投稿した。引用が数分で100を超えた。", fx: { know: 1, happy: 1 } },
    { id: "x_niwaka", w: 3, d: [30, 2000], t: "TLに一斉に同じ構文が流れた。こういう日は、界隈がひとつの生き物に見える。", fx: { happy: 2, goroku: 1 } },
    { id: "x_utage", w: 2, d: [60, 2000], t: "フォロワー記念の企画が流れていた。あなたの番は、来るだろうか。", fx: { happy: 1 } },
    { id: "x_museum", w: 2, d: [120, 2000], t: "古いスクショがTLで発掘された。三年前の常識が、今は笑いものになっている。", fx: { know: 2 } },
    { id: "x_shinjin_ga", w: 3, d: [60, 2000], t: "新参が「ヒカマーって何ですか」と本気で聞いていて、TLが一瞬だけ優しくなった。", fx: { happy: 2, nareai: 1 } },
    { id: "x_onsen", w: 2, d: [90, 2000], t: "「オフ会の写真、外に出すなよ」の注意が毎回される。毎回、誰かが出す。", fx: { know: 1 } },
    /* 成長の微細 */
    { id: "x_reply_daily", w: 5, d: [10, 2000], t: "リプ返しの一日。50件返して、指が痛い。でも誰かと話している感覚がある。", fx: { rel: 2, nareai: 2, hp: -1 } },
    { id: "x_screenshot_rep", w: 3, d: [30, 2000], t: "あなたのポストのスクショが、他人のまとめに載っていた。名前は切られていた。", fx: { fame: 40, know: 1 } },
    { id: "x_collab_watch", w: 3, d: [60, 2000], t: "合作の完成品が公開された。制作陣の名義が流れていくのを、最後まで見た。", fx: { happy: 2, skill: 1 } },
    { id: "x_ai_talk", w: 3, d: [200, 2000], era: [2024, 2026], t: "「AIで作った」の申告をめぐって、TLがまた割れている。", fx: { know: 1 } },
    { id: "x_kokuchi2", w: 2, d: [150, 2000], t: "あなたの古いネタが、他の誰かのポストで再利用された。出典は書かれていなかった。", fx: { mental: -1, know: 1 } },
    /* トラブル追加 */
    { id: "x_mistake_hair", w: 2, d: [90, 2000], t: "切り抜きを誤解して拡散してしまった。慌てて訂正したが、訂正はRTされなかった。", fx: { mental: -2, know: 1 } },
    { id: "x_friend_block", w: 3, d: [90, 2000], t: "相互だった人に突然ブロックされた。理由は分からない。分からないまま、が一番効く。", fx: { mental: -2, rel: -1 } },
    { id: "x_imposter_report", w: 2, d: [120, 2000], t: "なりすましが本物として通っている。通報したが、界隈の外には伝わらない。", fx: { mental: -1 } },
    { id: "x_kerai", w: 3, d: [300, 2000], cond: S => S.hk.followers >= 700, t: "懐いてくる新参ができた。あなたの語録をコピーして、少し間違えて使っている。", fx: { happy: 3, nareai: 2, rel: 1 } },
    { id: "x_timeslip", w: 2, d: [450, 2000], t: "タイムラインを遡って、自分の初投稿を見つけた。世界は優しかった。", fx: { happy: 3, mental: 2 } },
    /* 終盤 */
    { id: "x_oshirase2", w: 2, d: [500, 2000], t: "「界隈、最近落ち着いてない?」のポストに、みんなが「そうでもない」と返していた。", fx: { know: 1 } },
    { id: "x_last_like", w: 2, d: [700, 2000], t: "同時期に参入した仲間の垢を久しぶりに開いた。最終投稿は、元気な日常の話だった。", fx: { mental: 1, happy: 1 } }
  );

  // ---- 追加決断 ----
  HK.DECISIONS2.push(
    { id: "xj_bunkasai", w: 4, d: [60, 600], m: [9, 10], prompt: "文化祭の準備とTL、どっちを優先する？",
      choices: [
        { label: "学校を優先", t: "文化祭は成功した。TLは三日分、まとめて読んだ。", fx: { rel: 3, know: 2, happy: 2, heat: -4 } },
        { label: "TLを優先", t: "企画の波に乗った。文化的な行事の記憶は、薄い。", fx: { fame: 120, happy: 1, rel: -2 } }
      ] },
    { id: "xj_kokunai", w: 3, d: [120, 900], m: [5, 6, 11, 12], cond: S => S.age <= 18, prompt: "テスト前日。「一夜漬けか、TLか、両方か」。",
      choices: [
        { label: "一夜漬け", t: "眠気と戦いながら、単語帳の端に語録を落書きした。", fx: { know: 5, happy: -2, hp: -1 } },
        { label: "TLしながら勉強", t: "交互にやって、どちらも中途半端に終わった。両方の気持ちは分かる。", fx: { know: 2, happy: 1 } },
        { label: "今日はネットの日", t: "「明日の自分がなんとかする」。明日の自分は、今日と同じことをした。", fx: { know: -1, happy: 2, heat: 2 } }
      ] },
    { id: "xj_follow_vip", w: 3, d: [60, 900], once: true, prompt: "界隈の中核の一人から、フォローされた。",
      choices: [
        { label: "慎重に、でも嬉しさを隠さず", t: "普通に礼を言った。過剰でないのが、一番好かれる。", fx: { rel: 3, happy: 3, fame: 60 } },
        { label: "全ポストをいいねして回る", t: "熱意は伝わった。少し、重かった。", fx: { rel: -1, happy: 2 } }
      ] },
    { id: "xj_shinbun_choku", w: 2, d: [150, 1500], once: true, cond: S => S.hk.followers >= 1200, prompt: "ヒカマー新聞から、取材のDMが来た。",
      choices: [
        { label: "答える", t: "記事が出た。母に「あんた載ってるやん」と言われた。", fx: { fame: 150, happy: 3, fameRisk: 3 } },
        { label: "断る", t: "「宣伝はしない主義で」。静かなのが一番だ。", fx: { mental: 1 } }
      ] },
    { id: "xj_2shu", w: 3, d: [180, 1500], once: true, prompt: "体育祭の応援団に誘われた。練習期間はTLが薄くなる。",
      choices: [
        { label: "引き受ける", t: "喉が枯れた。応援団の salute を、TLのノリに変換するのが楽しかった。", fx: { rel: 3, hp: -2, happy: 2, heat: -5 } },
        { label: "断る", t: "応援は心の中で。指は動かし続けた。", fx: { heat: 3 } }
      ] },
    { id: "xj_koi2", w: 3, d: [240, 1500], once: true, cond: S => S.age >= 15 && S.stats.happy >= 60, prompt: "好きな人と、帰り道が同じになった。スマホには通知が4件。",
      choices: [
        { label: "通知を無視して話す", t: "その30分は、通知より価値があった。", fx: { happy: 4, rel: 2, heat: -3 } },
        { label: "スマホを見ながら話す", t: "相手は途中から、少し静かになった。", fx: { happy: -1, know: -1 } }
      ] },
    { id: "xj_baito_goroku", w: 2, d: [400, 1500], cond: S => S.flags.includes("baito"), prompt: "バイト先に、界隈にいそうな客が来た。",
      choices: [
        { label: "声をかける", t: "「それ、ヒカマーですか?」と聞いたら、苦笑いされた。同業者はちょっと怖い。", fx: { rel: 1, happy: 1, fameRisk: 2 } },
        { label: "知らないふり", t: "プロ同士は静かにやる。これが大人の付き合いだ。", fx: { mental: 1 } }
      ] },
    { id: "xj_genkai", w: 2, d: [500, 2000], once: true, prompt: "界隈内で「そろそろ世代交代だな」という空気が出ている。あなたはどう振る舞う?",
      choices: [
        { label: "古参として語る", t: "「昔はよかった」を一回だけ言った。二回目は言わないようにした。", fx: { know: 1, goroku: 1 } },
        { label: "新参のノリを学ぶ", t: "新しい語録を覚えた。指の運動量は、若さと関係ない。", fx: { goroku: 2, heat: 6, happy: 1 } }
      ] },
    { id: "xj_toko", w: 2, d: [700, 2000], once: true, prompt: "5年目。あなたの垢のプロフィールには、もういない人の名前が並んでいる。",
      choices: [
        { label: "プロフを整理する", t: "消えた垢の名前を、一つずつ消した。線香をあげるみたいな作業だった。", fx: { mental: 2, happy: -1 } },
        { label: "残す", t: "残した。幽霊のように、確かにいた人たちだ。", fx: { mental: 1 } }
      ] },
    { id: "xj_youtube", w: 2, d: [300, 1500], once: true, cond: S => S.hk.skill >= 45, prompt: "動画を外のプラットフォームにも出さないか、という誘い。",
      choices: [
        { label: "出す", t: "再生数は伸びた。だが界隈の外のコメント欄は、少しだけよそよそしい。", fx: { fame: 400, know: 1 } },
        { label: "内側だけに置く", t: "内輪で完成する面白さを守った。それはそれで、強い選択だ。", fx: { nareai: 2, happy: 1 } }
      ] },
    { id: "xj_kyohi", w: 2, d: [400, 2000], cond: S => S.hk.freezes >= 1, once: true, prompt: "凍結明けのあなたを見て、「もう潮時では」という声と、「おかえり」という声が両方届く。",
      choices: [
        { label: "戻ってきた証明をしていく", t: "小さな投稿を毎日続ける。それが何よりの再出発だった。", fx: { heat: 8, happy: 2, mental: 2 } },
        { label: "声に揺れる", t: "揺れた。人の言葉は、時に自分の何倍も重い。", fx: { mental: -2 } }
      ] },
    { id: "xj_sotsuron", w: 2, d: [600, 1500], once: true, cond: S => S.age >= 17, prompt: "卒論・レポートのテーマに、ネット文化を選べる。",
      choices: [
        { label: "書く", t: "自分の界隈を客観視した。書くのは、いちばん上手い供養だった。", fx: { know: 5, happy: 2, flags: ["reflected"] } },
        { label: "書かない", t: "調べ物の対象になるには、まだ少し早い。", fx: { know: 1 } }
      ] },
    { id: "xj_kokyou", w: 2, d: [700, 2000], once: true, prompt: "地元を離れて数年。界隈の友達が「お前の地元に行ってみたい」と言う。",
      choices: [
        { label: "案内する", t: "案内した。知らない土地で、知っている人と歩くのは変な感じだった。", fx: { rel: 4, happy: 3, fameRisk: 3 } },
        { label: "やめておく", t: "この街と、このアカウントは、別々にしておきたい。", fx: { mental: 1 } }
      ] },
    { id: "xj_toko2", w: 2, d: [900, 2000], once: true, prompt: "界隈の外の友人に、これまでの5年をどう説明する?",
      choices: [
        { label: "ひとつの趣味として説明する", t: "「ネットの友達と遊んでた」。それだけ言えば、話は通じた。", fx: { rel: 2, happy: 2 } },
        { label: "説明しない", t: "説明できないものが、人生にはあってもいい。", fx: { mental: 1 } }
      ] }
  );

  // ---- 追加称号 ----
  HK.DATA2.titles.splice(HK.DATA2.titles.length - 2, 0,
    { id: "zeroichi", rank: "A", name: "ゼロ年代の遺産", cond: "era<=2021 && skill>=60", desc: "最初期の空気を知る作り手。あなたの作品には、あの頃の匂いがする。" },
    { id: "kinou", rank: "B", name: "昨日の主役", cond: "flags.includes('buzzmaster') && fame<3000", desc: "一度だけ大舞台に立った。それだけで、ただの人とは呼ばれない。" },
    { id: "seikatsu", rank: "B", name: "両立の達人", cond: "flags.includes('grounded') && skill>=50", desc: "現実と界隈を、どちらも捨てなかった。一番難しいことだ。" },
    { id: "kioku", rank: "B", name: "記憶の管理人", cond: "days>=1000 && goroku>=60", desc: "古い語録と、消えた垢の名前を、あなたはまだ正しく使える。" },
    { id: "tanoshimi", rank: "C", name: "ただ楽しんだ人", cond: "fame>=200 && fame<1000 && flags.includes('met_people')", desc: "のめり込まず、離れず。オフ会の飯が、いちばん旨かった。" },
    { id: "mujaki", rank: "C", name: "無邪気な三年", cond: "days>=730 && days<1100 && fame<500", desc: "三年いて、フォロワーは500人未満。それでも毎日TLが楽しかった。" },
    { id: "kanpeki", rank: "A", name: "全部盛り", cond: "flags.includes('artist') && flags.includes('mad') && flags.includes('builder')", desc: "絵も音も道具も。あなたは界隈の万能ナイフだった。" }
  );

  // ---- 追加図鑑 ----
  HK.DATA2.zukan.push(
    { id: "c26", cat: "文化", name: "フォロバ制限", desc: "XのAPI制限。新参の最初の敵は、人間ではなく仕様である。" },
    { id: "c27", cat: "文化", name: "オープンチャット", desc: "LINEの公開トークルーム。界隈が移住しては、荒らしては、消えていく場所。" },
    { id: "c28", cat: "文化", name: "年間ワースト決定戦", desc: "1月のもうひとつの風物詩。なった方は、なった方で語り草になる。" },
    { id: "c29", cat: "文化", name: "自作トレカ", desc: "ヒカマーが作る非公式カードゲーム。界隈の思想と人物がカードになる。" },
    { id: "c30", cat: "文化", name: "疑似科学いじり", desc: "開発光の「効能」系投稿を掘る文化。冗談と検証の中間地点。" },
    { id: "p11", cat: "道具", name: "フォロワー数", desc: "界隈の体温計であり、呪いでもある数字。1000で一人前と言われる。" },
    { id: "e10", cat: "事件", name: "住所特定祭り", desc: "2026年9月、短い期間に個人情報の特定が連鎖した。ネットリテラシーが界隈の共通語になった。" },
    { id: "h10", cat: "人", name: "あなた", desc: "この記録の主人公。誰かにとってのおもちゃにも、誰かの朝の楽しみにもなった。" }
  );
})();
