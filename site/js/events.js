/* =========================================================
   4万分の1のヒカマー — イベント / 決断データ
   phase: 'pre'   … ヒカマー以前（幼少〜ネット原体験）
          'hk'    … ヒカマー期
          'any'   … いつでも
   ages: [min, max] / w: 抽選重み / once: 一度きり
   fx: ステータス変動 {hp,happy,know,rel,mental,fame,goroku,skill,fameRisk,banRisk,money,nareai,edge,dev}
   flags: 付与フラグ
   t: 表示テキスト（{h}=ハンドル {n}=名前）
   ========================================================= */
window.HK = window.HK || {};

HK.EVENTS = [
  /* ================= 0〜12歳 ふつうの子ども ================= */
  { id: "e_night", phase: "pre", ages: [0, 2], w: 8, once: true, fx: { hp: -1, rel: 1 }, t: "夜泣きがすごくて、家族が寝不足になった。あなたは何も覚えていない。" },
  { id: "e_tv", phase: "pre", ages: [3, 6], w: 6, fx: { happy: 1 }, t: "テレビの前で、同じアニメの歌を延々と口ずさんだ。" },
  { id: "e_park", phase: "pre", ages: [3, 7], w: 6, fx: { rel: 2, hp: 1 }, t: "公園のブランコで、近所の子と無言の王者決定戦をした。" },
  { id: "e_pokemon", phase: "pre", ages: [5, 10], w: 5, fx: { happy: 2 }, t: "周りの流行り物が気になり始めた。クラス全員が同じゲームをやっていた。" },
  { id: "e_youtube", phase: "pre", ages: [4, 9], w: 7, fx: { happy: 1, know: 1 }, cond: S => S.net.tier >= 1, t: "親のスマホでYouTubeを見せてもらった。スクリーンの向こうに人が住んでいる。" },
  { id: "e_undou", phase: "pre", ages: [6, 9], w: 5, fx: { hp: 2, rel: 1 }, t: "運動会でかけっこをした。順位は覚えていないが、風だけ覚えている。" },
  { id: "e_mushiba", phase: "pre", ages: [5, 12], w: 4, fx: { hp: -1, happy: -1 }, t: "歯医者の恐怖。麻酔の針の角度は今も覚えている。" },
  { id: "e_juku", phase: "pre", ages: [7, 11], w: 5, fx: { know: 3, happy: -1, rel: -1 }, cond: S => S.citySize !== "田舎", t: "塾の体験授業に行かされた。同じ教室に、後にTLで出会うことになる誰かがいたかもしれない。" },
  { id: "e_game", phase: "pre", ages: [7, 11], w: 6, fx: { happy: 2, rel: 1 }, t: "友達の家でゲームをさせてもらった。コントローラーの匂いと、その部屋の明るさ。" },
  { id: "e_moving", phase: "pre", ages: [4, 10], w: 4, once: true, fx: { rel: -2, happy: -1, know: 1 }, t: "引っ越しをした。転校先で最初の週末、あなたは部屋の段ボールの間にいた。" },
  { id: "e_bukatsu", phase: "pre", ages: [9, 12], w: 5, fx: { hp: 2, rel: 2, know: 1 }, t: "習い事か部活を始めた。日に焼けた。上履きの名前は油性ペンだった。" },
  { id: "e_route", phase: "pre", ages: [8, 12], w: 4, fx: { know: 1, rel: 1 }, t: "親のPCを借りた。壁紙は家族写真。検索履歴は毎回消された。" },

  /* ---- 12〜15歳 ネットの海へ ---- */
  { id: "e_chu", phase: "pre", ages: [12, 12], w: 30, once: true, fx: { rel: 2 }, t: "中学校に入学した。ランドセルが消えて、世界が少し広くなった。" },
  { id: "e_smart", phase: "pre", ages: [12, 14], w: 12, once: true, fx: { happy: 3 }, cond: S => S.net.tier >= 1, t: "自分のスマホが来た。最初の夜、布団の中でアプリの海を泳いだ。" },
  { id: "e_nico", phase: "pre", ages: [11, 14], w: 8, once: true, fx: { know: 1, happy: 1 }, cond: S => S.net.tier >= 1, t: "ニコニコ動画の存在を知った。コメントが画面を流れていく、その速さに驚いた。" },
  { id: "e_yaju", phase: "pre", ages: [12, 15], w: 10, once: true, fx: { know: 1 }, cond: S => !S.hk.joined, t: "クラスの誰かが「例のアレ」の話をしていた。意味は分からなかったが、笑い声だけ分かった。" },
  { id: "e_timeline", phase: "pre", ages: [12, 15], w: 6, cond: S => !S.hk.joined, fx: { happy: -1, know: 1 }, t: "ネットの治安というものを初めて見た。誰かが誰かを、四六時中たたいている。" },
  { id: "e_latenight", phase: "pre", ages: [12, 16], w: 8, fx: { hp: -1, happy: 1 }, t: "布団の中で、午前2時まで画面。眩しさで目が痛い。それでもやめられない。" },
  { id: "e_test", phase: "pre", ages: [12, 17], w: 9, fx: { know: 2, happy: -1 }, t: "定期テスト。一夜漬けの割に、真ん中より少し上だった。" },
  { id: "e_friend", phase: "pre", ages: [11, 16], w: 6, fx: { rel: 2 }, t: "学校で笑いのツボが合う相手ができた。あなたは少し救われた。" },

  /* ================= ヒカマー期 日常 ================= */
  { id: "h_tl_kaigi", phase: "hk", ages: [13, 60], w: 9, fx: { happy: 1, nareai: 2 }, t: "タイムラインで朝会が始まっていた。あなたはその輪に、語録をひとつ置いて参加した。" },
  { id: "h_nareai", phase: "hk", ages: [13, 50], w: 8, fx: { happy: 2, rel: 1, nareai: 3 }, t: "相互と日常のリプを交わした。外から見れば意味不明な、内側から見れば完璧な会話。" },
  { id: "h_quote_practice", phase: "hk", ages: [13, 20], w: 8, fx: { goroku: 3, happy: 1 }, t: "今日の語録メモ。使い所を研究した。語彙は、この界隈では暴力にも挨拶にもなる。" },
  { id: "h_quote_miss", phase: "hk", ages: [13, 18], w: 5, cond: S => S.hk.goroku < 60, fx: { happy: -1, goroku: 2 }, t: "語録の使い方を間違えた。先輩から「それ、こう使うゾ」と引用RT付きで教えられた。教育は時に公開処刑だ。" },
  { id: "h_drama", phase: "hk", ages: [13, 60], w: 7, fx: { happy: -1, know: 1 }, t: "TLの治安が急に悪くなった日。誰が誰を叩いているのか、あなたにも正確には分からない。" },
  { id: "h_gochagocha", phase: "hk", ages: [13, 60], w: 6, fx: { happy: 1 }, t: "界隈のおもしろ時間帯に当たった。知らないヒカマー同士の妙な連帯が、その瞬間だけ生まれていた。" },
  { id: "h_newcomer", phase: "hk", ages: [13, 18], w: 5, fx: { nareai: 2 }, t: "あなたより新しい新参が挨拶していた。「よろしくお願いします」の文字が、少し以前の自分に見えた。" },
  { id: "h_tsuihai", phase: "hk", ages: [13, 25], w: 4, fx: { edge: 2, happy: -1 }, t: "ツイ廃界隈が近くで騒いでいた。ヒカマーとツイ廃の壁は、思っているより薄い。" },
  { id: "h_kaesen", phase: "hk", ages: [14, 60], w: 4, fx: { dev: 3, know: 1 }, t: "開発光の過去投稿がまた発掘された。あなたはそのスレッドをRTするか、少し迷ってからRTした。" },
  { id: "h_fukushima", phase: "hk", ages: [13, 60], w: 4, fx: { dev: 2, edge: 1 }, t: "福島関連のネタがTLを一周した。笑う者、顔をしかめる者、無言でスクショを撮る者。" },
  { id: "h_goroku_win", phase: "hk", ages: [14, 60], w: 4, cond: S => S.hk.goroku >= 50, fx: { happy: 2, fame: 30, goroku: 2 }, t: "あなたの語録の使い方が「うまい」と引用された。小さな勝利。だがその小さな勝利が、この界隈の全てでもある。" },
  { id: "h_follow500", phase: "hk", ages: [13, 60], w: 3, cond: S => S.hk.followers >= 400 && S.hk.followers < 700, once: true, fx: { happy: 3 }, t: "フォロワーが500人を超えた。「雑魚じゃなくなった」と自分で言って、自分で笑った。" },
  { id: "h_follow1000", phase: "hk", ages: [13, 60], w: 3, cond: S => S.hk.followers >= 900 && S.hk.followers < 1300, once: true, fx: { happy: 4, nareai: 2 }, t: "フォロワー1000人。記念スクショを撮って、誰にも見せずに保存した。" },
  { id: "h_mention", phase: "hk", ages: [13, 60], w: 5, cond: S => S.hk.followers >= 500, fx: { happy: 2 }, t: "知らないアカウントがあなたの名前を出して笑っていた。悪口ではなかった。それがうれしかった。" },
  { id: "h_narabikou", phase: "hk", ages: [13, 18], w: 4, fx: { rel: 1, happy: 1 }, t: "エンカの約束をした。当日、駅前で「あの、ヒカマーの人ですか？」と声をかけるあの数秒の気まずさ。" },
  { id: "h_deepnight_call", phase: "hk", ages: [14, 25], w: 4, fx: { rel: 2, happy: 1, hp: -1 }, t: "深夜のスペースで3時間喋った。起きているのが同じ界隈の人間だけという時間帯がある。" },
  { id: "h_art_watch", phase: "hk", ages: [13, 60], w: 4, fx: { happy: 1 }, t: "界隈の絵師の新作が流れてきた。あなたは「うますぎだろ」とだけ言った。それで十分だった。" },
  { id: "h_video_watch", phase: "hk", ages: [13, 60], w: 5, fx: { happy: 1 }, t: "新作のヒカマニ外伝が流れてきた。何回も見てしまうやつだ。あなたは再生数を確認した。" },
  { id: "h_shinbun", phase: "hk", ages: [13, 60], w: 3, fx: { know: 1 }, t: "ヒカマー新聞を読んだ。界隈の事件が、淡々と、しかし丁寧に並んでいる。" },
  { id: "h_wiki_read", phase: "hk", ages: [13, 60], w: 3, fx: { know: 1 }, t: "ヒカマーWikiを読みふけった。あなたが知っているあの出来事には、あなたが知らない経緯があった。" },
  { id: "h_zukan", phase: "hk", ages: [13, 60], w: 3, fx: { know: 1 }, t: "界隈の用語を、ひとつ覚えた。こうして人は少しずつ、泡沫から泡の群れになっていく。" },
  { id: "h_old_memory", phase: "hk", ages: [15, 60], w: 3, fx: { happy: 1 }, t: "数年前のポストがふとタイムラインで再浮上した。当時の自分は、まだいろいろと知らなかった。" },
  { id: "h_test_season", phase: "hk", ages: [13, 18], w: 6, fx: { know: 2, happy: -2 }, t: "テスト期間。TLはいつも通り騒がしい。あなたは教科書の上で親指だけ動かした。" },
  { id: "h_school_sick", phase: "any", ages: [13, 18], w: 4, fx: { hp: -2, happy: 1 }, t: "体調を崩して学校を休んだ。一日中ベッドで、スマホだけが友達だった。" },
  { id: "h_mendan", phase: "any", ages: [15, 30], w: 3, fx: { happy: -1, know: 1 }, cond: S => S.hk.fameRisk >= 40, t: "不用意な投稿をして、母に「大丈夫なの？」と聞かれた。あなたは「大丈夫」と即答した。" },
  { id: "h_family_bare", phase: "hk", ages: [13, 22], w: 3, fx: { happy: -2 }, t: "家族に、スマホの画面を見られた。スクロールの指が止まる。あの0.5秒の恐怖。" },
  { id: "h_school_bare", phase: "hk", ages: [13, 18], w: 3, fx: { happy: -1, rel: -1 }, t: "クラスメイトに、あなたがヒカマーであることがバレた。「お前そういうのやってるんだ」の言い方。" },
  { id: "h_friend_hk", phase: "hk", ages: [13, 18], w: 3, fx: { rel: 3, happy: 2 }, t: "リアルの友達が、実は界隈の住人だった。二人で顔を見合わせて笑った。秘密は半分になった。" },
  { id: "h_oosaka", phase: "hk", ages: [13, 22], w: 2, fx: { happy: 1 }, t: "誰かがTLで巨大な失敗をした。あなたは小突くでもなく、ただ見ていた。" },
  { id: "h_aesthetic", phase: "hk", ages: [13, 18], w: 2, fx: { happy: 2 }, t: "自分のアイコンを新しくした。界隈の人間が一番時間をかける自己紹介。" },
  { id: "h_ramen", phase: "any", ages: [13, 70], w: 4, fx: { happy: 1, hp: 1 }, t: "深夜のカップ麺。塩分のことは、健康診断の日だけ考える。" },
  { id: "h_influenza", phase: "any", ages: [10, 70], w: 3, fx: { hp: -3, happy: -1 }, t: "高熱でうなされた。夢の中でもタイムラインが流れていた。" },

  /* ---- イベント（バズ・成功） ---- */
  { id: "h_buzz_small", phase: "hk", ages: [13, 60], w: 5, cond: S => S.hk.skill >= 15 || S.hk.goroku >= 50, fx: { fame: 300, happy: 3 }, t: "まあまあ伸びた。通知が100件を超えると、スマホが少し重くなる。" },
  { id: "h_buzz_big", phase: "hk", ages: [13, 60], w: 2, cond: S => S.hk.skill >= 40 || S.hk.goroku >= 70, fx: { fame: 3000, happy: 5, mental: 2 }, t: "バズった。見知らぬ大物アカウントの引用が並び、あなたはTLの主役になった。数日間だけ。" },
  { id: "h_buzz_viral", phase: "hk", ages: [13, 60], w: 2, cond: S => (S.hk.skill >= 65 || S.hk.goroku >= 85) && (S.hk._virals || 0) < 2, fx: { fame: 15000, happy: 6, fameRisk: 5, viral: true }, t: "大バズ。あなたの投稿が界隈の外まで流れた。フォロワー通知が止まらない夜は、少し怖かった。" },
  { id: "h_creator_debut", phase: "hk", ages: [13, 25], w: 3, cond: S => S.hk.skill >= 40, once: true, fx: { fame: 200, skill: 3 }, t: "初めての作品を投稿した。再生数は112。だがそのうち数人は、ずっとあなたの作品を見ていく人になった。" },
  { id: "h_collab", phase: "hk", ages: [13, 25], w: 3, cond: S => S.hk.skill >= 50, fx: { fame: 500, skill: 5, rel: 2 }, t: "合作に参加した。名義がエンドロールに並ぶ。あなたの名前は、誰かの名前の隣にあった。" },
  { id: "h_money_first", phase: "hk", ages: [15, 40], w: 2, cond: S => S.hk.followers >= 3000, once: true, fx: { money: 10000, happy: 2 }, t: "初めての収入。数百円。嫌儲の界隈で、それは実績であり、後ろめたさでもあった。" },
  { id: "h_art_req", phase: "hk", ages: [14, 30], w: 2, cond: S => S.flags.includes("artist"), fx: { happy: 2, rel: 1 }, t: "知らない人のアイコンを描いた。お礼に自分の絵が使われているのを見るのは、悪くない気分だ。" },
  { id: "h_kaigyou", phase: "hk", ages: [16, 40], w: 2, cond: S => S.hk.skill >= 60, fx: { fame: 2000, skill: 5, happy: 3 }, t: "作品が界隈の「教科書」になった。新参があなたの功績を調べ、Wikiに書こうとしている。" },

  /* ---- トラブル ---- */
  { id: "h_antipathy", phase: "hk", ages: [13, 60], w: 4, fx: { mental: -2, happy: -1 }, t: "見知らぬアカウントから粘着された。毎朝、あなたの過去投稿に一つずついいねが付く。" },
  { id: "h_kusomove", phase: "hk", ages: [13, 25], w: 4, fx: { happy: -2, mental: -2, fame: -50 }, t: "クソムーブをやらかした。勢いで書いたポストの通知が、朝には赤くなっていた。" },
  { id: "h_satsugai_pred", phase: "hk", ages: [14, 60], w: 1, fx: { mental: -8, happy: -3, fameRisk: 5 }, t: "殺害予告のようなDMが来た。冗談だと信じたい。スクショは撮ってある。" },
  { id: "h_law_fake", phase: "hk", ages: [14, 60], w: 2, fx: { mental: -4, happy: -2, banRisk: 2 }, t: "「開示する」という通知文面のDMが来た。慌てて検索したが、本物の請求はこんなDMでは来ない。たぶん。" },
  { id: "h_alqaeda_tl", phase: "hk", ages: [14, 60], w: 3, fx: { edge: 2, mental: -1 }, t: "TLの端で、アルカイダ系の投稿が流れてきた。目を逸らす者、通報する者、笑ってる者。" },
  { id: "h_freeze_wave", phase: "hk", ages: [13, 60], w: 3, cond: S => S.hk.banRisk >= 40, fx: { mental: -3, banRisk: 5 }, t: "凍結の噂が一斉に流れた週。強いアカウントが次々と消えていく。あなたは自分のプロフィールを開いて閉じた。" },
  { id: "h_stalker_school", phase: "hk", ages: [13, 18], w: 2, fx: { mental: -5, happy: -2 }, t: "学校の外で、あなたのネットの名前を呼ぶ声がした。振り返らなかった。振り返れなかった。" },
  { id: "h_shokugyou", phase: "hk", ages: [15, 60], w: 2, fx: { know: 1 }, t: "あなたの界隈での知名度を、職場や学校の誰かが知っていた。世界は狭い。" },
  { id: "h_yamiochi_friend", phase: "hk", ages: [13, 60], w: 4, fx: { mental: -3, happy: -2, rel: 2 }, t: "仲の良かったアカウントが「病み垢になります」と言った。慰めの言葉を打っては消した。" },
  { id: "h_someone_gone", phase: "hk", ages: [14, 80], w: 2, fx: { mental: -4, happy: -3 }, t: "界隈の知り合いが、突然いなくなった。アカウントは残っている。最終投稿は、いつも通りの内容だった。 ／ ひとりで抱えないで。まもろうよこころ（厚労省）には、24時間の窓口一覧がある。" },
  { id: "h_memorial", phase: "hk", ages: [14, 80], w: 2, fx: { mental: -2, rel: 2 }, t: "逝去したヒカマーのポストを、みんなで引用して静かに一周した。この界隈なりの、お葬式。" },
  { id: "h_offkai_trouble", phase: "hk", ages: [14, 30], w: 2, fx: { mental: -3, happy: -1, fameRisk: 3 }, t: "オフ会で写真が勝手に撮られ、どこかに流れていないか不安になった。SNSの写真は、引っ込められない手榴弾だ。" },
  { id: "h_screenshot_war", phase: "hk", ages: [13, 60], w: 3, fx: { happy: -1, know: 2 }, t: "晒し合いのスクショがTLを飛び交った。文化の一部と、そうでないものの境界線を、みんなで確認した。" },
  { id: "h_kaiji", phase: "hk", ages: [14, 60], w: 2, fx: { mental: -6, happy: -3, fameRisk: 8 }, t: "あなたの個人情報の一部が、まとめサイトに載った。「これ本当に俺か」と思う部分は、本当だった。" },

  /* ---- 界隈外・現実 ---- */
  { id: "w_covid", phase: "any", ages: [6, 20], year: [2020, 2020], w: 20, once: true, fx: { know: 1, happy: -1 }, t: "2020年、世界が止まった。学校はオンラインになり、あなたのネット時間は倍になった。" },
  { id: "w_mikoto", phase: "hk", ages: [13, 25], year: [2024, 2026], w: 4, once: true, fx: { know: 1 }, t: "界隈で「AI生成」という言葉が普通になった。誰でも、何でも、作れるようになった。その意味は、まだ誰も理解していない。" },
  { id: "w_teacher", phase: "any", ages: [13, 18], w: 3, fx: { know: 2, rel: 1 }, t: "学校の先生に、昔のネットの話をしてもらった。先生もかつて、どこかの界隈の住人だったらしい。" },
  { id: "w_job", phase: "any", ages: [23, 65], w: 4, fx: { money: 300000, know: 1 }, t: "仕事で小さな昇進をもらった。あなたのパソコンの速さと、検索のうまさは、ネットで培われた。" },
  { id: "w_list", phase: "any", ages: [28, 65], w: 2, fx: { money: -200000, happy: -1 }, t: "リストラの波が来た。あるいは、波が去った後に、あなただけが残った。" },
  { id: "w_kenko", phase: "any", ages: [35, 90], w: 4, fx: { hp: -2, know: 1 }, t: "健康診断の結果を見た。医者に「このままだと、いずれ」と言われた。いずれ、という言葉の重さ。" },
  { id: "w_sake", phase: "any", ages: [20, 80], w: 3, fx: { hp: -1, happy: 1 }, t: "晩酌の量だけが、最近の日課になっている。タイムラインをスクロールする指と、グラスを持つ手が同じ動きをする。" },
  { id: "w_child", phase: "any", ages: [25, 45], w: 3, cond: S => S.flags.includes("married"), fx: { happy: 3, rel: 3, money: -300000 }, t: "子どもが生まれた。あなたは初めて、スマホの向こうではない世界に、本気で脊髄反射した。" },
  { id: "w_kaigo", phase: "any", ages: [40, 70], w: 3, fx: { happy: -2, rel: 2, know: 1 }, t: "親の介護が始まった。ポストの下書き画面を開いては、閉じる日が続いた。" },
  { id: "w_kekkon", phase: "any", ages: [24, 50], w: 2, cond: S => !S.flags.includes("married"), fx: { happy: 5, rel: 4, money: -2000000, flags: ["married"] }, t: "結婚した。相手はあなたのネットの趣味を、three割くらいしか理解していない。それでも、だいたい、幸せだ。" },
  { id: "w_shokuji", phase: "any", ages: [20, 90], w: 3, fx: { happy: 1 }, t: "うまいものを食べた。味だけが、ネットの外にあるリアルだと思う。" },
  { id: "w_shizen", phase: "any", ages: [30, 90], w: 2, fx: { happy: 2, hp: 1 }, t: "休日に山か海を見に行った。スマホの電波が届かない場所で、あなたは少しだけ落ち着いた。" },
  { id: "w_kyujitsu", phase: "any", ages: [18, 90], w: 3, fx: { happy: 1, hp: 1 }, t: "久しぶりに、何もしない休日を過ごした。何もしないことの練習は、大人になってから一番難しい。" },

  /* ---- 老後 ---- */
  { id: "old_life", phase: "any", ages: [60, 95], w: 4, fx: { happy: 1, know: 1 }, t: "テレビやニュースが、ネットの話をするようになった。若者たちが、あなたの若い頃の言葉を使っている。意味は違う。" },
  { id: "old_screenshot", phase: "any", ages: [55, 95], w: 3, fx: { happy: 1 }, t: "古いHDDを開いた。当時のスクショの中に、もうこの世にいないアカウントたちがいる。あなたは彼らのプロフィールを、まだ覚えている。" },
  { id: "old_grandchild", phase: "any", ages: [60, 95], w: 3, cond: S => S.flags.includes("married") || S.rel >= 50, fx: { happy: 2 }, t: "孫が「この言葉、おじいちゃんの世代の言葉だよ」と見せてくれた。それは語録だった。元ネタは、もう誰も知らない。" },
  { id: "old_akari", phase: "any", ages: [65, 99], w: 3, fx: { happy: 1 }, t: "あなたは今日も、静かにスクロールしている。指の動きは変わらない。変わったのは、通知の数だけだ。" },
  { id: "old_doko", phase: "any", ages: [58, 99], w: 2, fx: { happy: 1 }, t: "同窓会に行った。誰も、あなたのネットでの正体を知らない。あなたも、知っている顔には見られない。" }
];

/* ================= 決断 ================= */
HK.DECISIONS = [
  { id: "d_late", phase: "pre", ages: [12, 15], w: 6, prompt: "深夜1時。布団の中でスマホが光っている。明日は早起きだ。",
    choices: [
      { label: "あと10分だけ見る", t: "その10分が毎日続いて、あなたの朝は常に眠い。", fx: { happy: 2, hp: -2, know: 1 } },
      { label: "電源を切って寝る", t: "珍しい勝ち方をした。あなたは自分で自分を褒めた。", fx: { hp: 2, know: 1 } }
    ] },
  { id: "d_show", phase: "pre", ages: [11, 14], w: 5, once: true, prompt: "クラスのイケてる奴に「お前これ知ってるか」と動画を見せられた。画面にはヒカキンの切抜きが無理やり喋っていた。",
    choices: [
      { label: "「なにこれ、うますぎ」と笑う", t: "あなたは笑った。本当に面白いと思った。この瞬間、あなたの中に何かの扉が開いた。", fx: { happy: 2, flags: ["pre_hooked"] } },
      { label: "「え、まあまあ」と流す", t: "あなたは大げさに笑わなかった。だが家に帰って、その動画を検索した。", fx: { know: 1, flags: ["pre_hooked"] } },
      { label: "「キモい」と正直に言う", t: "相手は少し気まずそうにした。あなたはもう見ないと思った。たぶん、思っていただけだった。", fx: { rel: -1 } }
    ] },
  { id: "d_art", phase: "hk", ages: [13, 35], w: 5, once: false, cond: S => S.hk.skill < 88, prompt: "練習帳が1冊終わった。界隈には「うまい絵師」が山ほどいる。あなたの線は、まだ震えている。",
    choices: [
      { label: "描き続ける", t: "手が痛くなるまで描いた。上手くなったかは分からない。だが、前より速く描ける。", fx: { skill: 6, happy: -1, flags: ["artist"] } },
      { label: "見る側に回る", t: "あなたは筆を置いた。見ることは、いつでもできる。", fx: { happy: 1, know: 1 } }
    ] },
  { id: "d_edit", phase: "hk", ages: [13, 22], w: 4, once: true, prompt: "動画編集ソフトの体験版を入れた。タイムラインが画面に並ぶ。素材フォルダには、例の切り抜きが入っている。",
    choices: [
      { label: "1本作ってみる", t: "3日かけて、47秒の動画ができた。投稿した。通知が鳴るたび、心臓が跳ねた。", fx: { skill: 10, happy: 2, fame: 80 } },
      { label: "閉じる", t: "あなたはそっとソフトを閉じた。向いていない、と自分に言い聞かせた。", fx: { know: 1 } }
    ] },
  { id: "d_mad", phase: "hk", ages: [13, 22], w: 3, once: true, prompt: "界隈で音MADが流行りはじめている。あなたのPC（または親のPC）には、まだ何も入っていない。",
    choices: [
      { label: "機材とソフトを揃える", t: "小遣いを全部使った。最初の作品は、無音だった（音の出し方が分からなかった）。それでも、あなたは笑った。", fx: { skill: 8, money: -30000, happy: 2 } },
      { label: "眺めている", t: "あなたは完成品だけを楽しむことにした。作る人の凄さを、誰よりも知っている眺め方だった。", fx: { happy: 1, goroku: 1 } }
    ] },
  { id: "d_bigp", phase: "hk", ages: [14, 45], w: 4, once: true, cond: S => (S.hk.skill >= 55 || S.hk.goroku >= 70), prompt: "あなたの投稿が、じわじわ伸び始めている。通知が止まらない。この波に乗るか、静かに見送るか。",
    choices: [
      { label: "追い投稿で畳みかける", t: "畳みかけた。三日間、あなたのプロフィールには知らない人たちが並んだ。", fx: { fame: 9000, skill: 2, happy: 3, fameRisk: 6, flags: ["buzzmaster"] } },
      { label: "静かに見送る", t: "あなたは追加の投稿をしなかった。波は引いた。だが海は覚えている。", fx: { happy: 1, mental: 2 } }
    ] },
  { id: "d_hook2", phase: "pre", ages: [13, 16], w: 8, once: true, cond: S => !S.flags.includes("pre_hooked") && !S.flags.includes("joined"), prompt: "ニコニコ動画のランキングに、見慣れない動画が上がっていた。切り抜きの男が、変なことを言わされている。",
    choices: [
      { label: "見てみる", t: "見た。50秒後、あなたは同じシリーズの3本目を開いていた。", fx: { happy: 2, flags: ["pre_hooked"] } },
      { label: "スルーする", t: "あなたはスクロールした。その動画は、数日後にまたあなたの前に現れる。", fx: { know: 1 } }
    ] },
  { id: "d_join", phase: "pre", ages: [13, 16], w: 30, once: true, cond: S => S.flags.includes("pre_hooked"), prompt: "あなたは決めた。X（ツイッター）のアカウントを作り、「#新参ヒカマー」で挨拶する。ハンドルネームは「{handle}」。",
    choices: [
      { label: "#新参ヒカマー を投稿する", t: "投稿した。数分後、通知がついた。「はじめまして、そ決🦪」——界隈の扉が、静かに開いた。", fx: { flags: ["joined"], join: true } },
      { label: "今はやめておく", t: "あなたは見送った。アカウントは作り、タイムラインだけを眺めることにした。", fx: { flags: ["watcher"] } }
    ] },
  { id: "d_smart_watch", phase: "pre", ages: [12, 16], w: 4, once: true, prompt: "あなたのスマホに、足あと（タイムライン）が付いた。知らない人の日常が流れてくる。",
    choices: [
      { label: "流れるままに見る", t: "あなたは見る人になった。それは参加の一種だ。", fx: { flags: ["watcher"], know: 1, zukan: ["c0"] } },
      { label: "アカウントを閉じてしまおうと思う", t: "閉じるのは、いつでもできる、とあなたは思った。そのいつかは、来なかった。", fx: { happy: 1 } }
    ] },
  { id: "d_sanction", phase: "hk", ages: [13, 18], w: 6, once: false, prompt: "タイムラインでヒカマーズ制裁が始まっている。対象はタグ荒らしらしい。みんなが「なんでそんなこと言うんだ?」の構文を使っている。",
    choices: [
      { label: "自分も一行、構文を投げる", t: "あなたは加勢した。10秒の仕事だった。界隈の片棒を担いだ、という小さな記録が残った。", fx: { edge: 3, nareai: 2, banRisk: 3, happy: 1 } },
      { label: "ROMる", t: "あなたは見ていた。加わらなかった。それだけのことだが、あなたは少しだけ安心した。", fx: { happy: 1, mental: 1 } },
      { label: "やめるように呼びかける", t: "あなたは中止を呼びかけた。誰も聞かなかった。「この界隈のやることに口出すな」というリプだけが届いた。", fx: { happy: -2, edge: -3, goroku: -1 } }
    ] },
  { id: "d_selfie", phase: "hk", ages: [13, 20], w: 5, once: true, prompt: "界隈では自撮りを出すと、一気に知名度が上がる。あなたのスマホには、今朝撮った写真が入っている。",
    choices: [
      { label: "加工して出す", t: "1時間で数十人の新しい通知。界隈の中心に、あなたの顔が置かれた。", fx: { fame: 500, fameRisk: 20, happy: 3 } },
      { label: "素のまま出す", t: "勇気のいる一歩。あなたの素顔が、アイコンやネタに使われ始めた。おもちゃの道と、英雄の道が交差点になっている。", fx: { fame: 800, fameRisk: 30, happy: 2 } },
      { label: "出さない", t: "あなたは写真を消した。顔を明かさない者のインターネットは、静かだが、安全だ。", fx: { mental: 2 } }
    ] },
  { id: "d_alqaeda", phase: "hk", ages: [14, 20], w: 3, once: true, prompt: "ヒカマーズアルカイダ——TLに不快画像を流す荒業。面白いやつがやっている。あなたのスマホにはシャッターの準備ができている。",
    choices: [
      { label: "一回だけやってみる", t: "投げた。数秒後に「きた」という反応。これは笑いか、迷惑か。あなたにもわからない。", fx: { edge: 8, banRisk: 15, happy: 2, flags: ["alqaeda"] } },
      { label: "通報した", t: "あなたは静かに通報ボタンを押した。正しさと、この界隈のノリは、いつも少しずれている。", fx: { edge: -3, mental: 1 } },
      { label: "何もしない", t: "あなたはスクロールを続けた。TLの端の出来事は、いつものように流れていった。", fx: {} }
    ] },
  { id: "d_bahnhof", phase: "hk", ages: [14, 60], w: 4, once: true, prompt: "あなたの名前が、Wikiの「ヒカマー一覧」に載りそうだという噂を聞いた。",
    choices: [
      { label: "自分から情報をまとめて送る", t: "数日後、あなたの項目ができた。読み方は間違われていた。それが嬉しかった。", fx: { fame: 200, happy: 3, fameRisk: 5, flags: ["wikipedia"] } },
      { label: "黙って待つ", t: "あなたは何もしなかった。Wikiは、勝手に誰かが書くものだ。", fx: { know: 1 } }
    ] },
  { id: "d_kaiji", phase: "hk", ages: [14, 60], w: 4, once: true, cond: S => S.hk.fameRisk >= 45, prompt: "「お前の住所、特定できるよ」というDMが来た。相手の名義は捨て垢。真偽は不明。",
    choices: [
      { label: "無視する", t: "あなたはDMを既読スルーして閉じた。心臓は少し速かった。ここでビビったら負けだ。", fx: { mental: -2, happy: -1 } },
      { label: "スクショして晒す", t: "晒した。「かわいそう」「怖いて言えよ」とTLが沸いた。あなたは笑いものにすると同時に、守られている。", fx: { fame: 100, edge: 2, fameRisk: 5, mental: -1 } },
      { label: "「開示だな。震えて寝ろ」と返す", t: "構文で返した。界隈は大喜利になった。あなたはこの瞬間、少しだけこの界隈の住人をやめられなくなった。", fx: { happy: 1, goroku: 3, nareai: 2 } }
    ] },
  { id: "d_vpn", phase: "hk", ages: [14, 60], w: 4, once: true, cond: S => S.hk.fameRisk >= 50, prompt: "住所特定祭りが界隈で続いている。ネットリテラシーを見直す機運が来ている。",
    choices: [
      { label: "VPNと捨て情報の勉強をする", t: "あなたは2時間かけて、身を守る方法を学んだ。ネットの海は、泳ぎ方を覚えれば少し安全だ。", fx: { fameRisk: -25, know: 3 } },
      { label: "自分は大丈夫だと思う", t: "あなたは「自分は大丈夫」と判断した。この判断は、多くの人間の人生を変えてきた。", fx: { fameRisk: 5 } }
    ] },
  { id: "d_resuban", phase: "hk", ages: [14, 60], w: 3, once: false, prompt: "タイムラインで、あなたに喧嘩を売ってくるアカウントがいる。全員が見ている。",
    choices: [
      { label: "受けて立つ", t: "あなたは返した。巧妙に、言葉を選んで。勝败は誰も公式には裁定しない。だが、あなたはこの時間を後悔していない。", fx: { fame: 60, happy: -1, mental: -2, goroku: 1, flags: ["resuban"] } },
      { label: "無視", t: "あなたはスルーした。界隈は「勝ち逃げ」と言った。時間は有限だ。", fx: { mental: 2 } },
      { label: "ミュートして忘れる", t: "ミュートは最強の構文である。あなたは平和を選んだ。", fx: { happy: 2, mental: 2 } }
    ] },
  { id: "d_tetsu", phase: "hk", ages: [14, 18], w: 3, once: true, prompt: "受験の年が近づいてきた。塾の費用は親が出してくれるらしい。",
    choices: [
      { label: "本気で受ける", t: "あなたは半年間、TLを静かにした。結論から言うと、これは正解だった、たぶん。", fx: { know: 8, happy: -2, rel: -2, flags: ["studied"] } },
      { label: "ネットと両立する", t: "両立は激しく難しい。結果は、来年わかる。", fx: { know: 4, happy: -1, rel: -1 } },
      { label: "ネットを選ぶ", t: "あなたは選んだ。知っている。これが後に響くことを。それでも選んだ。", fx: { know: -2, happy: 3, nareai: 3, flags: ["net_first"] } }
    ] },
  { id: "d_retire", phase: "hk", ages: [15, 25], w: 4, once: false, prompt: "界隈の空気が重い。テストとTLの両立も限界だ。あなたの指は、引退するなら今だと言っている。",
    choices: [
      { label: "「ヒカマー引退します。」と投稿する", t: "投稿した。「今までありがとうございました」。TLに置かれたその一文は、いつもの構文の形をしていた。", fx: { happy: -2, mental: 2, retire: true } },
      { label: "まだやる", t: "あなたは投稿を削除した。削除ボタンの位置は、もう指が覚えてしまっている。", fx: { happy: 2, nareai: 2 } },
      { label: "ROMに切り替える", t: "あなたはアカウントを残したまま、見る専になった。泡は消えず、透明になった。", fx: { flags: ["rom"], happy: 1 } }
    ] },
  { id: "d_return", phase: "hk", ages: [16, 70], w: 4, once: false, cond: S => S.hk.retired, prompt: "久しぶりに開くと、知っているアカウントが、まだいた。TLのフォントは同じだ。",
    choices: [
      { label: "ひっそり復帰する", t: "あなたは特に宣言せず、いつものようにリプを送った。「おかえり」と言われた。それだけで、復帰は成功だ。", fx: { happy: 3, rel: 2, flags: ["returned"] } },
      { label: "眺めるだけにする", t: "あなたはログインして、トレンドを見て、閉じた。何度目になるか、もう数えていない。", fx: { happy: 1 } }
    ] },
  { id: "d_monetize", phase: "hk", ages: [16, 40], w: 2, once: true, cond: S => S.hk.followers >= 5000, prompt: "「収益化しないか」という誘いが来た。だがヒカマニ周辺で金を稼ぐのは、この界隈ではタブーだ。",
    choices: [
      { label: "受ける", t: "受けた。数万円が入った。それを知っているヒカマーは、C字の口になっている。", fx: { money: 200000, happy: 3, edge: 3, flags: ["monetized"] } },
      { label: "断る", t: "断った。「嫌儲の精神」を全うした。貧乏に、満足した。", fx: { nareai: 3, happy: -1, money: 0 } },
      { label: "無言で関わるのをやめる", t: "あなたはそのDMを、既読のまま、開かなかった。", fx: { mental: 1 } }
    ] },
  { id: "d_offkai", phase: "hk", ages: [14, 30], w: 3, once: false, prompt: "界隈の人たちがオフ会を開くらしい。あなたも誘われた。半分は行きたい。半分は、顔がバレるのが怖い。",
    choices: [
      { label: "参加する", t: "行った。会話は最初の5分で普通になった。インターネットが人に戻る瞬間を、あなたは見た。", fx: { rel: 4, happy: 3, fameRisk: 10, flags: ["met_people"] } },
      { label: "行かない", t: "行かなかった。行きたかった。両方が本当だ。", fx: { happy: -1, mental: -1 } }
    ] },
  { id: "d_shinbun", phase: "hk", ages: [14, 60], w: 2, once: true, cond: S => S.hk.followers >= 2000, prompt: "ヒカマー新聞に、あなたの活動が載った。「あの件」のまとめ記事だ。",
    choices: [
      { label: "RTして自慢する", t: "RTした。知らないアカウントからの引用が増えた。あなたは少し、有名人の気持ちを知った。", fx: { happy: 3, fame: 300 } },
      { label: "スクショして宝物にする", t: "あなたは画像を保存した。10年後、それを懐かしく感じる予習を、今のうちにしておく。", fx: { happy: 2 } }
    ] },
  { id: "d_tsuihan", phase: "hk", ages: [14, 30], w: 2, once: true, prompt: "ツイ廃界隈から「そっちよりこっちの方が面白い」と誘われている。",
    choices: [
      { label: "NO。ヒカマーでいる", t: "あなたは断った。ヒカマーとツイ廃の壁は、越えると帰ってこれないと言われている。たぶん嘘だ。", fx: { nareai: 3, happy: 1 } },
      { label: "両方行く", t: "あなたは複数の顔を使い分けるようになった。現代のインターネットでは、珍しいことではない。", fx: { know: 2, happy: 2, edge: 2 } }
    ] },
  { id: "d_friend_yami", phase: "hk", ages: [13, 60], w: 5, once: true, prompt: "仲の良い界隈の人が「もう無理かも」と投稿して、二日間消えている。",
    choices: [
      { label: "DMを送る", t: "「生きてる？」と送った。既読がついた。それだけで、あなたは今日いいことをした。", fx: { rel: 3, happy: 1, mental: -1 } },
      { label: "投稿にいいねだけする", t: "いいねを押した。言葉が足りない気がして、つけたり消したりした。", fx: { rel: 1 } },
      { label: "何もできない", t: "あなたは何もできなかった。そういう夜が、あなたの人生にも、いくつかある。", fx: { mental: -2 } }
    ] },
  { id: "d_daihyou", phase: "hk", ages: [16, 40], w: 2, once: true, cond: S => S.hk.followers >= 3000, prompt: "界隈の企画の主催を「お前しかいない」と押し付けられそうだ。",
    choices: [
      { label: "引き受ける", t: "引き受けた。3週間、あなたの生活はサーバーと締切と通知に支配された。そして、当日、みんなが笑った。それが報酬だった。", fx: { fame: 800, happy: 2, rel: 4, mental: -3, flags: ["builder"] } },
      { label: "断る", t: "「すまん、今は無理」。言えた。これは、ある種の強さだ。", fx: { mental: 2 } }
    ] },
  { id: "d_surya", phase: "hk", ages: [14, 60], w: 3, once: true, cond: S => S.hk.followers >= 1500, prompt: "炎上しているアカウントを、みんなで叩いている。あなたの仲間も混ざっている。",
    choices: [
      { label: "混ざる", t: "あなたも一行だけ。それでそのアカウントは、翌週、消えた。", fx: { edge: 3, happy: 1, mental: -1 } },
      { label: "止める", t: "「やりすぎでは」と言った。何人かがあなたから離れ、何人かが近づいた。", fx: { edge: -4, rel: 2, happy: -1 } },
      { label: "何もしない", t: "あなたは静かにした。TLの波は、関わらなくても引いていく。", fx: { mental: 1 } }
    ] },
  { id: "d_gakkou", phase: "any", ages: [15, 18], w: 3, once: true, prompt: "進路調査票が配られた。志望欄は空白のまま、あなたのスマホは光っている。",
    choices: [
      { label: "ネットと関係ない進路を書く", t: "あなたは現実の側に、自分を固定した。ネットはその脇で、静かに続く。", fx: { know: 3, rel: 1 } },
      { label: "ネットで食っていくことを妄想する", t: "書かなかった。書けるわけがなかった。だが、書きたかった。", fx: { happy: 1, know: -1, nareai: 2 } }
    ] },
  { id: "d_shigoto", phase: "any", ages: [20, 30], w: 4, once: true, prompt: "就職活動が始まった。ESの志望動機欄に、あなたは「ネットコミュニティの運営経験」と書けそうな自分がいる。",
    choices: [
      { label: "書く。事実だから", t: "面接官は「詳しく」と聞いてきた。あなたは半分だけ話した。内定をもらった会社で、あなたは今日もスクロールしている。", fx: { know: 5, money: 300000, rel: 2 } },
      { label: "書かない。これは人生の裏側だから", t: "あなたは別の言葉で自分を説明した。しかし帰り道、あの界隈の時間が、あなたの人生で一番濃かったことを、あなたは知っている。", fx: { know: 3, happy: -1 } }
    ] },
  { id: "d_kaidan", phase: "hk", ages: [18, 50], w: 2, once: false, cond: S => S.hk.followers >= 5000, prompt: "あなたの卒業（引退）を惜しむ声が、定期的に届く。あなたはもう中心にいなくても、名前だけが残っている。",
    choices: [
      { label: "たまに浮上する", t: "半年に一回の投稿に、数百のいいねがつく。あなたは伝説の残骸になった。", fx: { happy: 2, fame: 100 } },
      { label: "完全に沈黙する", t: "あなたは静かにした。伝説は、話さない方が伝説らしい。", fx: { mental: 2 } }
    ] }
];
