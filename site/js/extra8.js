/* =========================================================
   10万分の1のヒカマー v3.14 — リプ欄アイデア全部反映パック
   Xリプ31件（2026-10-16 @maebahesioru2）より:
   ・0歳からモード(最初はただの生活) ・出身ガチャ47県+アルカイダ帝国
   ・出身界隈ガチャ ・タイプ(誰かになる) ・派閥(ますまに/おぜう/ネオナチ軍/親衛隊)
   ・強制加入 ・内輪揉め ・ネカマ ・ツイ廃 ・猫(まるお/もふこ) ・ザビャン邸
   ・開示/訴訟/顔バレ/低評価捏造/悪口流出/女装/親の死/クマ/震災/安倍晋三の日
   ・ヒカマーズアルカイダ帝国 ・1/Nのくじ表示 ・スターの子(超レア)
   ========================================================= */
window.HK = window.HK || {};

const X8 = (HK.EXTRA8 = {
  origins: [
    { id: "twitter", label: "Twitter直", w: 40, fx: {} },
    { id: "opcha", label: "オプチャ", w: 16, fx: { nareai: 6, rel: 3 } },
    { id: "youtube", label: "YouTube", w: 14, fx: { happy: 2, rom: 1 } },
    { id: "tiktok", label: "TikTok", w: 10, fx: { happy: 1, fame: 15, edge: 2 } },
    { id: "nico", label: "ニコニコ動画", w: 9, fx: { skill: 4, know: 3 } },
    { id: "discord", label: "Discord", w: 6, fx: { rel: 4, nareai: 4 } },
    { id: "ch810", label: "810ch", w: 5, fx: { know: 5, fameRisk: 3 } }
  ],
  archetypes: [
    { id: "munashi", label: "無印", w: 30, desc: "名乗りに何も付けない。それも様式美。", fx: {} },
    { id: "romgami", label: "ROM専", w: 12, fx: { know: 5, heat: -4 } },
    { id: "gorokushu", label: "語録厨", w: 12, fx: { goroku: 8 } },
    { id: "kakite", label: "描き手", w: 10, fx: { skill: 6, fame: 20 } },
    { id: "otomad", label: "音マー", w: 8, fx: { skill: 8, know: 3 } },
    { id: "botshoku", label: "bot職人", w: 7, fx: { dev: 8, skill: 5 } },
    { id: "kirinuki", label: "切り抜き職人", w: 7, fx: { skill: 4, fame: 30 } },
    { id: "eventa", label: "イベンター", w: 5, fx: { rel: 6, nareai: 6 } },
    { id: "nareai", label: "馴れ合いエリート", w: 8, fx: { nareai: 10, rel: 4 } },
    { id: "info", label: "情報屋", w: 5, fx: { know: 8, dev: 3 } },
    { id: "ippan", label: "一般人", w: 11, fx: { happy: 3, mental: 3 } },
    { id: "arashi", label: "荒らし見習い", w: 5, fx: { edge: 8, fameRisk: 6 } }
  ],
  factions: [
    { id: "masuma", label: "ますまに派" },
    { id: "ozeu", label: "おぜう派" },
    { id: "neonazi", label: "ネオナチ軍" },
    { id: "ss", label: "ネオナチ親衛隊" }
  ],
  facLabel(id) { const f = X8.factions.find(f => f.id === id); return f ? f.label : null; }
});
const D = HK.DATA2;

/* ================= 幼少期（0歳からの生活）================= */
HK.CHILD_EVENTS = [
  { id: "cc1", w: 2, t: "家のビデオデッキで、親が録画したアニメを繰り返し見た。テープが擦り切れる音まで覚えている。" },
  { id: "cc2", w: 2, t: "家族共用のパソコンがリビングに来た。触っていい時間は、一日30分と決められた。" },
  { id: "cc3", w: 3, t: "YouTubeの沼に落ちた。おすすめは、あなたの好みをどんどん覚えていく。" },
  { id: "cc4", w: 2, t: "学校で流行っているゲームの話についていくため、動画を見まくった一日だった。" },
  { id: "cc5", w: 2, t: "教室のヒエラルキーを、あなたは静かに観察していた。端の席から、全部見える。" },
  { id: "cc6", w: 2, t: "検索の途中で、知らない掲示板に迷い込んだ。世界は、思ったより広いらしい。" },
  { id: "cc7", w: 2, t: "親とネットのルールを決めた。「宿題をしてから」。三日で崩壊した。" },
  { id: "cc8", w: 2, t: "深夜アニメという文化を知った。録画予約が、生活の中心になっていく。" },
  { id: "cc9", w: 2, t: "スマホデビュー。スタンプの送り方だけで、最初の一週間が過ぎた。" },
  { id: "cc10", w: 2, t: "友達の家で最新ゲームをやらせてもらった。帰り道、ずっと余韻があった。" },
  { id: "cc11", w: 1, t: "ガラケーのゲーム課金で、初めて親に本気で怒られた。" },
  { id: "cc12", w: 1, t: "テレビのニュースで「インターネットの危険」特集を見た。他人事だった。" },
  { id: "cc13", w: 1, t: "共用パソコンが壊れた。犯人は、あなたではない。たぶん。" },
  { id: "cc14", w: 2, t: "毎朝の登校で、同じ電車の人が気になっている。名前は、知らない。" },
  { id: "cc15", w: 1, t: "将来の夢を聞かれた。「YouTuber」と答えたら、クラスで三人と被った。" }
];

/* ================= イベント追加 ================= */
HK.EVENTS2.push(
  /* --- 出身地ネタ --- */
  { id: "x8_reg_snow", w: 2, d: [60, 2000], cond: S => ["北海道", "青森県", "岩手県", "秋田県", "山形県", "新潟県", "富山県", "石川県", "福井県", "長野県"].includes(S.pref), t: "朝、雪かきをした。腰が痛い。TLには、誰もこの痛みを知らない。" },
  { id: "x8_reg_city", w: 2, d: [60, 2000], cond: S => ["東京都", "大阪府", "愛知県", "神奈川県", "福岡県"].includes(S.pref), t: "満員電車の中で、TLの誰かとすれ違った気がした。確認は、しない。" },
  { id: "x8_reg_umi", w: 2, d: [60, 2000], cond: S => ["沖縄県", "長崎県", "鹿児島県", "高知県", "和歌山県", "静岡県", "宮城県", "岩手県", "青森県", "北海道"].includes(S.pref), t: "地元の海の写真を上げたら、思ったより伸びた。海は、どこでも正義らしい。" },
  { id: "x8_fukushima", w: 1, d: [100, 2000], cond: S => S.pref === "福島県", t: "出身の話になった。相手は一瞬止まり、それから普通に笑った。普通が、いちばんありがたい。" },
  { id: "x8_fish", w: 2, d: [100, 2000], t: "日本産の魚介類を、今日も「我慢して」食べた。もちろん、うまい。" },

  /* --- 界隈の場所・名物 --- */
  { id: "x8_zabyan", w: 2, d: [60, 2000], once: true, cond: S => S.hk.followers >= 150, t: "ザビャン邸に招かれた。広い。噂で聞くより、三倍広い。帰り際、記念バッジをもらった。名刺代わりになるらしい。", fx: { fame: 120, happy: 3, zukan: ["p11"] } },
  { id: "x8_beast", w: 2, d: [100, 2000], once: true, t: "野獣邸の前を、たまたま通った。敷地の端が見えない。あなたは静かに歩き去った。", fx: { know: 1 } },
  { id: "x8_hyou", w: 2, d: [300, 2000], once: true, cond: S => S.hk.followers >= 2000, t: "界隈の名簿に、あなたの名前が載った。載りたい場所ではなかった。でも、載った。", fx: { fame: 80, happy: 1 } },
  { id: "x8_dead_mouth", w: 2, d: [200, 2000], t: "また一人、垢が消えた。死人に口なし。界隈は、走り続ける。" },
  { id: "x8_abe_day", w: 1, d: [0, 2000], era: [2022, 2022], m: 7, t: "2022年7月8日。日本中が息を呑んだ。TLも、しばらく誰も笑わなかった。", fx: { mental: -1, know: 1 } },

  /* --- 猫(まるお・もふこ) --- */
  { id: "x8_cat_sleep", w: 2, d: [30, 2000], cond: S => !!S.catName, t: "{cat}がキーボードの上で寝ている。どかすと、機嫌が悪くなる。世界の理屈は、猫が決める。" },
  { id: "x8_cat_buzz", w: 1, d: [60, 2000], once: true, cond: S => !!S.catName, t: "{cat}の写真が、あなたのアカウント史上いちばん伸びた。猫は、いつでも最強のコンテンツだ。", fx: { fame: 200, happy: 3 } },
  { id: "x8_cat_escape", w: 1, d: [120, 2000], once: true, cond: S => !!S.catName, t: "{cat}が網戸を開けて脱走した。三時間後、堂々と帰ってきた。", fx: { mental: -3, happy: 1 } },

  /* --- タイプ別 --- */
  { id: "x8_arch_kaki", w: 2, d: [40, 2000], cond: S => S.archId === "kakite", t: "日課の一枚を上げた。今日は、先輩が反応してくれた。指先が、少しだけ温かい。", fx: { skill: 2, happy: 1 } },
  { id: "x8_arch_oto", w: 2, d: [60, 2000], cond: S => S.archId === "otomad", t: "音MADを一本、ニコニコに上げた。界隈の外にも、少しだけ届いた。", fx: { skill: 3, fame: 40 } },
  { id: "x8_arch_bot", w: 2, d: [60, 2000], cond: S => S.archId === "botshoku", t: "作ったbotが、界隈のどこかで動いている。誰かの役に立っているらしい。それだけで、足りる。", fx: { dev: 3, happy: 2 } },
  { id: "x8_arch_kirinuki", w: 2, d: [60, 2000], cond: S => S.archId === "kirinuki", t: "切り抜きが一本、初めて千再生を超えた。元の配信者には、まだバレていない。", fx: { skill: 2, fame: 30 } },
  { id: "x8_arch_rom", w: 3, d: [40, 2000], cond: S => S.archId === "romgami", t: "一日中ROMった。見たポストは、数えていない。指は、動かしていない。" },

  /* --- ツイ廃ライン --- */
  { id: "x8_tw_day", w: 2, d: [100, 2000], cond: S => S.flags.includes("tw_waste"), t: "今日もTLを八時間見た。内容は、思い出せない。時間だけが、確かにあった。", fx: { happy: -1 } },
  { id: "x8_tw_bottom", w: 1, d: [300, 2000], once: true, cond: S => S.flags.includes("tw_waste") && S.stats.mental <= 45, t: "ある朝、目が覚める前に指がアプリを開いていた。あなたの一日は、通知欄から始まる。", fx: { end: "tsuiwaste" } },

  /* --- アフィライン --- */
  { id: "x8_afi_day", w: 2, d: [60, 2000], cond: S => S.flags.includes("afi"), t: "アフィの記事が検索で当たった。収益画面を見る時間が、確実に増えた。" },
  { id: "x8_afi_gold", w: 1, d: [200, 2000], once: true, cond: S => S.flags.includes("afi") && S.money >= 300000, t: "収益ダッシュボードの数字が、フォロワー数を超えた。画面が、少しだけ他人に見える。", fx: { end: "afiliend" } },

  /* --- 危険ライン --- */
  { id: "x8_nori_burn", w: 3, d: [230, 2000], once: true, cond: S => S.flags.includes("nori_open"), t: "「ノリ違」の引用が、一週間経っても止まない。TLが、あなたの名前ごと祭りを続けている。", fx: { end: "nori_chigai" } },
  { id: "x8_leak", w: 1, d: [150, 2000], once: true, cond: S => S.flags.includes("badmouth"), t: "あのDMのスクショが、TLに流れた。開示請求が届くのは、時間の問題だ。", fx: { mental: -12, end: "doxxing" } },
  { id: "x8_nuke", w: 1, d: [150, 2000], era: [2025, 2026], t: "界隈の「核」の噂。押すなよ、絶対に押すなよ——誰も押しはしないが、全員が見ている。", fx: { happy: -1, know: 1 } },
  { id: "x8_alq_citizen", w: 2, d: [30, 2000], cond: S => S.flags.includes("alq_citizen"), t: "帝国の住民名簿を更新した。名前の横に、階級が付いた。階級は、自分で決められない。", fx: { edge: 2, know: 1 } },

  /* --- スターの子 --- */
  { id: "x8_star_pressure", w: 2, d: [30, 2000], cond: S => S.flags.includes("star_child"), t: "「有名人の子」の期待と重圧。挨拶の一言が、次の日にはニュース欄に載っている。", fx: { mental: -2, fame: 50 } },

  /* --- 親の死 --- */
  { id: "x8_parent", w: 1, d: [200, 2000], once: true, cond: S => S.age >= 16, t: "親が逝った。訃報と、弔いの言葉。夜、あなたはTLに報告した。朝まで、リプが並んだ。", fx: { mental: -8, happy: -6, rel: 6 } }
);

/* ================= 決断追加 ================= */
HK.DECISIONS2.push(
  /* [10] 猫 まるお・もふこ */
  { id: "x8_cat", w: 2, d: [120, 2000], once: true, cond: S => S.age >= 15, prompt: "保護猫の里親募集を見てしまった。ケージの前で、二匹がこちらを見ている。", choices: [
    { label: "まるおを迎える（オス）", t: "名前は一瞬で決まった。まるお。界隈の猫は、なぜかみんなまるおだ。", fx: { catName: "まるお", happy: 5, mental: 3, money: -30000 } },
    { label: "もふこを迎える（メス）", t: "名前は一瞬で決まった。もふこ。界隈の猫は、なぜかみんなもふこだ。", fx: { catName: "もふこ", happy: 5, mental: 3, money: -30000 } },
    { label: "今回はやめておく", t: "里親募集のページを閉じた。閉じたあと、もう一回開いた。", fx: { mental: 1 } }
  ] },

  /* [7] 派閥 */
  { id: "x8_fac_invite", w: 2, d: [140, 2000], once: true, cond: S => !S.fac, prompt: "界隈の派閥から、加入の誘いが来た。「今なら、席がある」——派閥は、どこも定員制らしい。", choices: [
    { label: "ますまに派に入る", t: "ますまに派に入った。挨拶が終わると、名簿とノルマが配られた。", fx: { fac: "masuma", fame: 40, nareai: 5 } },
    { label: "おぜう派に入る", t: "おぜう派に入った。派の空気は、思ったより落ち着いていた。", fx: { fac: "ozeu", fame: 40, nareai: 5 } },
    { label: "ネオナチ軍に入る", t: "ネオナチ軍に入った。名前は過激だが、実態は……知らない方がいい。", fx: { fac: "neonazi", edge: 6, fame: 30 } },
    { label: "どこにも入らない", t: "誘いを断った。無所属のまま、TLの真ん中に立っている。", fx: { mental: 3, know: 1 } }
  ] },
  { id: "x8_fac_split", w: 2, d: [300, 2000], cond: S => !!S.fac, prompt: "派閥が、二つに割れた。先輩同士が、引用で撃ち合っている。あなたは——。", choices: [
    { label: "ますまに側につく", t: "ますまに側として、旗を掲げた。TLの半分が、赤く染まったように見えた。", fx: { fac: "masuma", edge: 4, nareai: -5 } },
    { label: "おぜう側につく", t: "おぜう側についた。義理は通した。通した分だけ、重くなった。", fx: { fac: "ozeu", edge: 4, nareai: -5 } },
    { label: "傍観する", t: "どちらの投稿にも、いいねをしなかった。それが何より、目立つらしい。", fx: { mental: 2, know: 2 } }
  ] },

  /* [11][7b] ツイ廃 */
  { id: "x8_tw_waste", w: 2, d: [120, 2000], prompt: "一日のTL滞在時間が、八時間を超えた。設定画面の数字が、あなたを見ている。", choices: [
    { label: "開き直る", t: "「TLは人生」——開き直った。時間の感覚が、通知の単位になっていく。", fx: { flags: ["tw_waste"], happy: 2 } },
    { label: "アプリ制限をかける", t: "スクリーンタイムをセットした。三日後、パスコードを忘れる予定。", fx: { mental: 2 } }
  ] },
  { id: "x8_tw_invite", w: 1, d: [200, 2000], once: true, cond: S => !S.flags.includes("tw_waste"), prompt: "有名ツイ廃と仲良くなった。向こうの界隈の「沼」へ、誘われている。", choices: [
    { label: "沼に沈む", t: "沼は、思ったより居心地が良かった。これが、時間が溶けるという感覚か。", fx: { flags: ["tw_waste"], happy: 3, know: 1 } },
    { label: "堤防で止まる", t: "向こう岸から、しばらく見ていた。沼は、見ている分には綺麗だ。", fx: { know: 2, mental: 1 } }
  ] },

  /* [7c][14] ネカマ */
  { id: "x8_love", w: 2, d: [150, 2000], once: true, prompt: "ヒカマー同士で、毎晩DMしている相手がいる。今日、「付き合いたい」と言われた。", choices: [
    { label: "付き合う", t: "ネットの恋人になった。毎晩のDMが、一日の中心になる。", fx: { flags: ["koibito"], happy: 5, rel: 4 } },
    { label: "友達のままで", t: "丁寧に断った。DMの頻度は、翌週から静かになった。", fx: { rel: 2, mental: 1 } }
  ] },
  { id: "x8_nekama", w: 2, d: [300, 2000], once: true, cond: S => S.flags.includes("koibito"), prompt: "半年後、写真と通話の矛盾を発見した。あなたの恋人の正体は——。", choices: [
    { label: "ネタにして笑う", t: "「半年間ネカマと付き合ってた」——大爆笑の引用が並んだ。笑われた分だけ、傷は浅い（気がした）。", fx: { fame: 250, happy: 2, mental: -4, flags: ["nekama_done"] } },
    { label: "静かに別れる", t: "誰にも言わずに、ブロックした。夜が、いつもより長かった。", fx: { mental: -5, flags: ["nekama_done"] } },
    { label: "愛は本物だった", t: "「性別は関係ないだろ」——引用が伸びた。界隈の反応は、半々だった。", fx: { happy: 3, rel: 3, fame: 80, flags: ["nekama_done"] } }
  ] },

  /* [6] エンカ・顔バレ */
  { id: "x8_offline", w: 2, d: [180, 2000], once: true, prompt: "エンカ（オフライン交流）の約束をした。集合場所は、都内のカフェ。", choices: [
    { label: "行く", t: "当日、全員が思ったより普通の人間だった。それが、いちばんの事件だった。", fx: { flags: ["enka_go"], happy: 4, rel: 3, fameRisk: 5 } },
    { label: "やめておく", t: "「体調が悪くて」——嘘はついていない。緊張で、腹が痛いだけだ。", fx: { mental: 1, know: 1 } }
  ] },
  { id: "x8_photo_out", w: 2, d: [250, 2000], once: true, cond: S => S.flags.includes("enka_go") && !S.flags.includes("face_managed"), prompt: "集合写真が、どこからか流出した。顔が写っている。界隈では、それは終わりの始まりだ。", choices: [
    { label: "削除して回る", t: "画像を片っ端から回って、削除を頼んだ。コミュニティの庇護は、思ったより暖かかった。", fx: { fameRisk: -15, mental: -6, flags: ["face_managed"] } },
    { label: "逃げるように消える", t: "垢を消し、TLを離れた。顔が出た瞬間に、界隈歴のろくろが回り始めていた。", fx: { end: "face" } }
  ] },

  /* [25] 悪口 */
  { id: "x8_badmouth", w: 2, d: [120, 2000], prompt: "DMの内輪ノリで、つい他人の悪口を書いてしまった。送信ボタンは、もう押された。", choices: [
    { label: "すぐ謝って回る", t: "本人に真っ先に謝った。怒られたが、晒されはしなかった。", fx: { rel: -2, mental: -1 } },
    { label: "そのままにする", t: "「DMは密室だ」——そう信じた。スクショという文明を、忘れていた。", fx: { flags: ["badmouth"], fameRisk: 8 } }
  ] },

  /* [31] 低評価捏造 */
  { id: "x8_lowscores", w: 2, d: [150, 2000], prompt: "嫉妬で、ライバルの投稿に低評価を大量に捏造した。指が、勝手に動いた。", choices: [
    { label: "認めて謝る", t: "全部消して、謝った。相手は「もういいよ」と言った。声は、少し冷たかった。", fx: { mental: -3, rel: 1, happy: -1 } },
    { label: "隠し通す", t: "何食わぬ顔で過ごした。数字は、必ず誰かが見ている。", fx: { flags: ["rat"], fameRisk: 10 } }
  ] },
  { id: "x8_rat_exposed", w: 1, d: [250, 2000], once: true, cond: S => S.flags.includes("rat"), prompt: "数字の出所がバレた。「工作員」のタグが、あなたの名前に貼られた。", choices: [
    { label: "全部消して黙る", t: "証拠を消して、静かにした。タグは、Googleに残った。", fx: { end: "expelled" } }
  ] },

  /* [8][5] 開示・訴訟 */
  { id: "x8_kaihi", w: 1, d: [200, 2000], once: true, cond: S => S.hk.fameRisk >= 55, prompt: "開示請求の通知が届いた。「特定」の二文字が、現実の速さで迫ってくる。", choices: [
    { label: "開示に戦う（弁護士）", t: "費用は痛い。だが、安い授業料だったと思うことにした。", fx: { money: -300000, mental: -4, know: 2, flags: ["kaihi_fought"] } },
    { label: "謝罪して和解する", t: "土下座のようなDMを送った。相手は、それで満足した。今回は。", fx: { mental: -3, fameRisk: -20 } },
    { label: "無視する", t: "通知を閉じた。請求は、無視できるものではない。", fx: { flags: ["kaihi_ignored"], fameRisk: 12 } }
  ] },
  { id: "x8_lawsuit", w: 1, d: [400, 2000], once: true, cond: S => S.hk.followers >= 3000, prompt: "「訴えます」——テンプレートじゃない、本気の文面だった。差出人は、界隈の外の人だ。", choices: [
    { label: "誠意を見せる", t: "謝罪と補償で、なんとか収めた。お金で買えないものを、お金で守った。", fx: { money: -250000, mental: -5 } },
    { label: "弁護士に相談する", t: "弁護士は淡々としていた。「ネットの言葉は、紙に印刷される」——忘れない。", fx: { money: -350000, know: 4, mental: -2 } },
    { label: "無視する", t: "無視した。書類は、無視されない。", fx: { flags: ["lawsuit_pending"], fameRisk: 10 } }
  ] },
  { id: "x8_lawsuit_lost", w: 1, d: [500, 2000], once: true, cond: S => S.flags.includes("lawsuit_pending"), prompt: "不在のまま、手続きは進んでいた。家に、書留が届いた。", choices: [
    { label: "現実と向き合う", t: "法廷は、句読点まで読み込む場所だった。あなたの界隈歴は、証拠の山に埋まった。", fx: { end: "lawsuit" } }
  ] },

  /* [15] 内輪テロ */
  { id: "x8_trade_center", w: 1, d: [250, 2000], once: true, prompt: "界隈のワルノリが、一線を越えた。通報ボタンは、境界線の向こう側にある。", choices: [
    { label: "便乗する", t: "ノリに乗った。翌週、凍結の嵐があなたの垢を持って行った。", fx: { end: "ban" } },
    { label: "距離を置く", t: "静かにフォローを外した。祭りは、いずれ終わる。終わりは、いつも急だ。", fx: { know: 2, mental: 1 } },
    { label: "それはやりすぎだと書く", t: "「ノリ違」と言われることを、承知で書いた。正しさは、いつも単価が悪い。", fx: { edge: -2, know: 2, rel: 1 } }
  ] },

  /* [28] アフィ */
  { id: "x8_afi", w: 2, d: [200, 2000], once: true, prompt: "アフィリエイト収益化の誘いが来た。界隈の注目は、そのまま金に換わる。", choices: [
    { label: "やる", t: "記事を書き、数字を追った。最初の入金は、フォロワー千人の記憶より重かった。", fx: { flags: ["afi"], money: 50000 } },
    { label: "やらない", t: "「界隈に借りがある」——断った。借りは、数字では返せない。", fx: { nareai: 5, rel: 2 } }
  ] },

  /* [27] ノリ違 */
  { id: "x8_nori", w: 2, d: [200, 2000], prompt: "「ノリ違くね?」——その引用が、今日だけで三回届いた。返信欄は、祭りの太鼓の音がする。", choices: [
    { label: "真面目に謝る", t: "謝った。祭りは、拍子抜けしたように静まった。", fx: { mental: -2, know: 2 } },
    { label: "開き直る", t: "「俺のノリで何が悪い」——正論だった。正論は、たいてい石を投げられる。", fx: { edge: 5, fameRisk: 10, flags: ["nori_open"] } },
    { label: "距離を置く", t: "数日TLを離れた。祭りは、次の対象を見つけて移動していた。", fx: { mental: 2 } }
  ] },

  /* [9] 女装 */
  { id: "x8_joso", w: 1, d: [150, 2000], once: true, prompt: "女装の写真を撮ってしまった。問題は、思ったより似合っていることだ。", choices: [
    { label: "界隈にだけ公開する", t: "鍵の向こうで、静かな祭りが起きた。「史上最高」の語録が、一日だけ流行った。", fx: { happy: 3, edge: 2, fame: 60 } },
    { label: "自分の目だけで楽しむ", t: "写真はアルバムに眠らせた。たまに見て、笑う。それだけの自由が、あなたにはある。", fx: { happy: 2, mental: 1 } }
  ] }
);

/* ================= 終わり方追加 ================= */
D.endings.push(
  { id: "quake", name: "揺れた夜", desc: "大きな地震が来た。界隈は動き続けていて、あなただけが動けなくなった。" },
  { id: "bear", name: "山の向こう", desc: "クマの目撃情報は、出ていたらしい。あなたの最後の投稿は、山の写真だった。" },
  { id: "doxxing", name: "開示された", desc: "ネットの履歴は、現実の住所より速く人に届く。静かに、消えた。" },
  { id: "nori_chigai", name: "ノリ違の烙印", desc: "たった三文字で、あなたの言葉は誰にも届かなくなった。" },
  { id: "afiliend", name: "アフィ成金", desc: "収益は月を追うごとに増えた。DMを返す相手は、月を追うごとに減った。" },
  { id: "face", name: "顔が出た", desc: "顔が晒された。界隈歴は、そこで強制的に幕を閉じる。" },
  { id: "ban", name: "一斉BAN", desc: "凍結の嵐が吹いた日、あなたの垢もまとめて持って行かれた。" },
  { id: "tsuiwaste", name: "ツイ廃", desc: "TLが人生になった。外の世界のニュースも、あなたはTLで知る。" },
  { id: "lawsuit", name: "法廷の日", desc: "書留の中身は、期日だった。ネットの言葉が、紙になって返ってきた。" }
);

/* ================= 図鑑追加 ================= */
D.zukan.push(
  { id: "n21", cat: "用語", name: "ますまに派", desc: "界隈の派閥のひとつ。加入すると、TLの解像度が上がる。定員制らしい。" },
  { id: "n22", cat: "用語", name: "おぜう派", desc: "界隈の派閥のひとつ。落ち着いた空気で、義理を重んじる。" },
  { id: "n23", cat: "用語", name: "ネオナチ軍", desc: "界隈の派閥のひとつ。名前は過激。実態は……知らない方がいい。" },
  { id: "n24", cat: "用語", name: "ネオナチ親衛隊", desc: "ネオナチ軍の親衛隊。派閥の序列は、名前の強さで決まるらしい。" },
  { id: "n25", cat: "用語", name: "ネオミド派", desc: "内輪揉めの常連。揉め事の当事者になる率が、界隈で最も高い。" },
  { id: "n26", cat: "文化", name: "強制加入", desc: "気づいたら名簿に載っている。界隈の派閥は、招待制ではない。" },
  { id: "n27", cat: "文化", name: "内輪揉め", desc: "界隈最大の娯楽であり、最大の消耗戦。どっちに付くかで、翌週のTLが変わる。" },
  { id: "n28", cat: "文化", name: "出身ガチャ", desc: "TikTok・オプチャ・YouTube・ニコニコ——どこから来たかで、ノリの配合が変わる。" },
  { id: "n29", cat: "用語", name: "ツイ廃", desc: "TLが人生になった者。時間の感覚が、通知の単位になる。" },
  { id: "n30", cat: "用語", name: "ネカマ", desc: "ネットの恋人。半分は、そう。残りの半分も、たぶんそう。" },
  { id: "n31", cat: "文化", name: "開示請求", desc: "気になる相手の情報を、法の力で開ける。界隈の最強カード。使う側も、燃える。" },
  { id: "n32", cat: "文化", name: "ザビャンバッジ", desc: "ザビャン邸で配られる記念品。持っていると、界隈の一部の扉で話が早い。" },
  { id: "n33", cat: "文化", name: "まるお・もふこ", desc: "界隈の猫の名は、なぜかこの二択になる。命名権は、猫にはない。" },
  { id: "n34", cat: "用語", name: "ヒカマーズアルカイダ帝国", desc: "伝説の国。住民名簿と階級制度があるらしい。国旗は、誰も覚えていない。" }
);

/* ================= 効果拡張・名前置換 ================= */
/* applyFx: fac / catName はエンジン側パッチで処理 */
/* renderText: {cat} はエンジン側パッチで処理 */

/* ================= 参入くじの拡張（newGameラップ）================= */
(function () {
  const _orig = HK.engine2.newGame;
  HK.engine2.newGame = function (opts) {
    opts = opts || {};
    const S = _orig(opts);
    const rng = S.rng;

    /* 出身デビュー元（どこから界隈に来たか） */
    const og = rng.wpick(X8.origins, o => o.w);
    S.originId = og.id;
    if (og.fx) HK.engine2.applyFx(S, og.fx);

    /* タイプ（界隈で何になるか） */
    const ar = rng.wpick(X8.archetypes, a => a.w);
    S.archId = ar.id;
    if (ar.fx) HK.engine2.applyFx(S, ar.fx);

    /* 超激レア: スターの子（有名人の家に生まれる 1/1000） */
    if (rng.chance(0.001)) {
      S.star = true;
      S.hk.followers += rng.int(600, 2000);
      S.hk.fameRisk = HK.engine2.clamp(S.hk.fameRisk + 8, 0, 100);
      S.flags.push("star_child");
    }
    /* 超激レア: ヒカマーズアルカイダ帝国に生まれる（1/500・2025以降のみ） */
    if (S.era.year >= 2025 && rng.chance(0.002)) {
      S.pref = "ヒカマーズアルカイダ帝国";
      S.flags.push("alq_citizen");
      S.hk.banRisk = HK.engine2.clamp(S.hk.banRisk + 4, 0, 100);
      S.hk.edge = HK.engine2.clamp(S.hk.edge + 6, 0, 100);
    }

    /* 無所属スタート */
    S.fac = null;
    S.catName = null;

    /* 生まれのくじ（組み合わせ数） */
    const counts = [D.prefs.length + (S.era.year >= 2025 ? 1 : 0), X8.origins.length, X8.archetypes.length,
      D.paths.length, D.triggers.length, D.families.length, D.nets.length];
    S.comboInv = counts.reduce((a, b) => a * b, 1);
    return S;
  };
})();
