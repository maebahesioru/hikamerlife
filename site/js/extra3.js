/* =========================================================
   10万分の1のヒカマー v3 — 増量パック2（時代の深化）
   イベント/暦/決断/図鑑/称号/終わり方/重点/仲間アークを追加
   ========================================================= */
window.HK = window.HK || {};

(function () {
  /* ================= 暦イベント 追加 ================= */
  HK.CAL_EVENTS.push(
    { id: "cal_setsubun", m: 2, d: [3], t: "節分。TLに「鬼は外」の構文が並び、開発光の話題で豆が撒かれた。", fx: { happy: 1, goroku: 1 } },
    { id: "cal_hanami", m: 4, d: [3, 10], t: "花見の季節。TLに桜の写真が流れ、写真自慢の裏で特定リスクの注意喚起も流れる。", fx: { happy: 2, fameRisk: 1 } },
    { id: "cal_tsuyu", m: 6, d: [10, 30], t: "梅雨。外に出る理由がなくなり、界隈全体の滞在時間が底上げされる。", fx: { heat: 2, hp: -1 } },
    { id: "cal_tanabata", m: 7, d: [7], t: "七夕。短冊の画像に「界隈の平和」と書いた者がいて、引用で笑われていた。", fx: { happy: 1 } },
    { id: "cal_bousai", m: 9, d: [1], t: "防災の日。モバイルバッテリーと水の備蓄を確認する投稿が並ぶ。ネットリテラシーは防災でもある。", fx: { know: 1 } },
    { id: "cal_bounenkai", m: 12, d: [20, 30], t: "忘年会スペースの季節。一年の労をねぎらう声と、まあまあの喧嘩が同時に流れる。", fx: { happy: 2, rel: 1 } }
  );

  /* ================= 一般イベント 追加 ================= */
  HK.EVENTS2.push(
    /* --- リアル側の人生（学生〜社会人） --- */
    { id: "y_hitorigurashi", w: 3, d: [300, 1500], once: true, cond: S => S.age >= 18, t: "一人暮らしを始めた。最初に買ったのは布団とルーターだ。", fx: { know: 2, happy: 2, money: -250000, fameRisk: -5 } },
    { id: "y_menkyo", w: 3, d: [300, 1500], once: true, cond: S => S.age >= 18, t: "教習所に通った。教官の話を半分聞きながら、TLの締切を考えていた。", fx: { know: 2, money: -250000, happy: 1 } },
    { id: "y_shukatsu2", w: 3, d: [420, 1500], cond: S => S.age >= 19 && S.age <= 24, t: "面接の帰り道、スーツのままTLを開いた。界隈は今日も騒がしい。", fx: { know: 3, happy: -1 } },
    { id: "y_shunin", w: 2, d: [500, 1500], once: true, cond: S => S.age >= 18, t: "社会人になった。初任給で、界隈の友人に自慢できる飯を食った。", fx: { money: 150000, know: 2, happy: 2 } },
    { id: "y_zangyo", w: 3, d: [500, 1800], cond: S => S.age >= 19, t: "残業の帰り、終電の中でスクロールした。指だけが元気だった。", fx: { hp: -2, money: 30000, heat: -1 } },
    { id: "y_remote", w: 2, d: [400, 1800], era: [2020, 2026], cond: S => S.age >= 18, t: "リモートワークの日は、会議のカメラを切りながらTLを見ている。", fx: { happy: 1, heat: 2, know: -1 } },
    { id: "y_douki_bare", w: 2, d: [500, 1800], once: true, cond: S => S.age >= 18, t: "職場の同僚が、あなたのプロフィールに気づいた。「趣味、激しいっすね」と言われた。", fx: { fameRisk: 4, rel: 1, mental: -1 } },
    { id: "y_jikka", w: 2, d: [600, 1800], cond: S => S.age >= 20, t: "実家に帰省した。自分の部屋の引き出しに、昔のガラケーが眠っていた。", fx: { happy: 2, mental: 1 } },
    { id: "y_hoikuen", w: 1, d: [900, 1800], cond: S => S.flags.includes("married") || S.age >= 26, t: "親戚の子守をした。子どもは、スマホより外の世界の方がまだ面白いらしい。", fx: { happy: 2, know: 1 } },
    { id: "y_kenkou2", w: 3, d: [400, 1800], t: "寝不足が常態化している。目の下のクマを、フィルタで隠すのが日課になった。", fx: { hp: -2, know: 1 } },
    /* --- 界隈の深層 --- */
    { id: "y_matome", w: 3, d: [120, 2000], cond: S => S.hk.followers >= 800, t: "界隈の外のまとめサイトに、あなたの投稿が文脈つきで載った。コメント欄は、あなたの知らない世界だった。", fx: { fame: 250, fameRisk: 3, flags: ["matome"], know: 1 } },
    { id: "y_material", w: 3, d: [200, 2000], cond: S => S.hk.followers >= 1500, t: "あなたの発言が、界隈の素材として切り抜かれた。大先輩も通った道だ。", fx: { fame: 120, happy: 1, flags: ["materialized"] } },
    { id: "y_aivoice", w: 2, d: [200, 2000], era: [2024, 2026], t: "あなたの語録が、誰かの作ったAIボイスで喋っていた。不思議な気持ちになった。", fx: { fame: 80, know: 1 } },
    { id: "y_finder", w: 2, d: [150, 2000], t: "あなたの古いポストが「発掘」されてTLに浮上した。黒歴史は、たまに考古学の対象になる。", fx: { mental: -2, fame: 60 } },
    { id: "y_densetsu_matsuri", w: 2, d: [250, 2000], t: "周年祭の企画が立ち上がった。あなたも名前を連ねた。", fx: { happy: 2, rel: 2, fame: 60 } },
    { id: "y_jishin", w: 2, d: [100, 2000], t: "地震速報。みんなの「大丈夫？」がTLに並ぶ。こういう時、界隈は優しい。", fx: { mental: 2, rel: 1 } },
    { id: "y_archive", w: 2, d: [400, 2000], t: "界隈のアーカイブWikiが更新され、古い出来事が整理されていった。あなたの名前も、脚注に載っている。", fx: { fame: 40, know: 1 } },
    { id: "y_ningyo", w: 2, d: [500, 2000], cond: S => S.hk.skill >= 35, t: "昔の作品に、思わぬところから引用がついた。三年前の自分が、今の誰かを笑わせている。", fx: { happy: 3, fame: 60 } },
    { id: "y_shinjin_o", w: 2, d: [600, 2000], t: "新参が「あなたのような人になりたい」と言ってきた。照れるが、悪くない。", fx: { happy: 3, nareai: 2 } },
    /* --- 重点シナジー: 政治・時事 --- */
    { id: "z_politics1", w: 4, d: [60, 2000], cond: S => S.focus === "politics", t: "選挙の季節。TLが政治の話で埋まり、界隈の絆と亀裂が同時に見えた。", fx: { know: 2, rel: 1 } },
    { id: "z_politics2", w: 3, d: [90, 2000], cond: S => S.focus === "politics", t: "時事ネタのポストが思わぬ伸び方をした。政治は、一番燃えやすい燃料だ。", fx: { fame: 120, edge: 2, fameRisk: 2 } },
    { id: "z_politics3", w: 2, d: [120, 2000], cond: S => S.focus === "politics" && S.hk.edge >= 30, t: "政治の話が過熱して、相互が一人減った。こういう別れ方もある。", fx: { rel: -2, mental: -1 } },
    /* --- 重点シナジー: アルカイダ --- */
    { id: "z_alq1", w: 4, d: [40, 2000], cond: S => S.focus === "alqaeda", t: "アルカイダの投稿がまたTLを汚した。あなたが今日それを投げた側だ。", fx: { edge: 3, banRisk: 4, happy: 1, zukan: ["c2"] } },
    { id: "z_alq2", w: 3, d: [60, 2000], cond: S => S.focus === "alqaeda", t: "「あいつは線を越えている」と、TLの空気が変わり始めた。", fx: { mental: -2, edge: 2 } },
    { id: "z_alq3", w: 2, d: [90, 2000], cond: S => S.focus === "alqaeda" && S.hk.banRisk >= 50, t: "アルカイダ帝国の隆盛と、その代償。通報ボタンがあなたを見ている気がする。", fx: { mental: -2, banRisk: 4 } },
    /* --- 重点シナジー: 開発叩き --- */
    { id: "z_dev1", w: 4, d: [40, 2000], cond: S => S.focus === "factdev", t: "開発光の古い配信アーカイブから、またネタが発掘された。あなたは経緯を丁寧にまとめた。", fx: { dev: 3, know: 1, fame: 60 } },
    { id: "z_dev2", w: 3, d: [80, 2000], cond: S => S.focus === "factdev", t: "ファクトチェック投稿が引用され、「丁寧な人」として界隈の信頼を少し得た。", fx: { fame: 100, goroku: 1, happy: 2 } },
    { id: "z_dev3", w: 2, d: [120, 2000], cond: S => S.focus === "factdev", t: "根拠の薄いデマをそのまま拡散してしまい、同陣営から注意された。事実は生き物だ。", fx: { fame: -30, know: 2, mental: -1 } },
    /* --- 重点シナジー: 道具づくり --- */
    { id: "z_tool1", w: 4, d: [40, 2000], cond: S => S.focus === "toolwork", t: "小さなツールを作って公開した。使った人が感想をくれて、それが報酬になった。", fx: { skill: 4, fame: 80, happy: 2, flags: ["builder"] } },
    { id: "z_tool2", w: 3, d: [100, 2000], cond: S => S.focus === "toolwork", t: "あなたの作った道具を、知らない人が紹介してくれている。縁の下の活動は、たまに光る。", fx: { fame: 150, happy: 3 } },
    { id: "z_tool3", w: 2, d: [150, 2000], cond: S => S.focus === "toolwork" && S.hk.skill >= 60, t: "メンテに追われて、自分の作品を作る時間が消えた。運営者の椅子は、思ったより硬い。", fx: { mental: -2, skill: 1 } },
    /* --- 重点シナジー: 拡散営業 --- */
    { id: "z_sales1", w: 4, d: [30, 2000], cond: S => S.focus === "sales", t: "企画に乗って引用スクショを回した。TLの波に乗る技術が、少しずつ身についている。", fx: { fame: 100, nareai: 1 } },
    { id: "z_sales2", w: 3, d: [90, 2000], cond: S => S.focus === "sales", t: "「宣伝うまいね」と褒められた。褒め言葉の裏に「営業っぽい」の声もあった。", fx: { fame: 80, rel: -1, happy: 1 } },
    { id: "z_sales3", w: 2, d: [120, 2000], cond: S => S.focus === "sales" && S.hk.followers >= 1000, t: "相互拡散の輪ができた。数字は伸びるが、繋がりの温度は、少しだけ機械的になった。", fx: { fame: 300, rel: -1, mental: -1 } },
    /* --- 重点シナジー: 凸・オフ活動 --- */
    { id: "z_off1", w: 3, d: [60, 2000], cond: S => S.focus === "offline", t: "聖地と噂の場所に、友人と行ってみた。思ったより普通で、思ったより楽しかった。", fx: { happy: 3, rel: 2, fameRisk: 8, zukan: ["p3"] } },
    { id: "z_off2", w: 2, d: [90, 2000], cond: S => S.focus === "offline", t: "オフの写真を出すか迷って、出さなかった。理性の勝ちである。", fx: { mental: 2 } },
    { id: "z_off3", w: 2, d: [120, 2000], cond: S => S.focus === "offline" && S.hk.fameRisk >= 40, t: "オフの話が特定に使われかけている。場所と時間の組み合わせは、それだけで証拠になる。", fx: { fameRisk: 6, mental: -2 } },
    /* --- ドラマ・心 --- */
    { id: "y_note", w: 2, d: [100, 2000], cond: S => S.hk.goroku >= 40, t: "noteに界隈の考察記事を書いた。界隈の外の人に読まれるのは、変な快感だ。", fx: { know: 2, fame: 60, goroku: 1 } },
    { id: "y_himu", w: 2, d: [150, 2000], t: "TLが一週間、異様に静かだった。嵐の前か、単に飽きか。どちらも界隈の普通だ。", fx: { know: 1 } },
    { id: "y_kizuna", w: 3, d: [60, 2000], t: "相互の一人と、界隈の何でもない話で三時間喋った。天才的な無駄話だった。", fx: { happy: 3, rel: 3 } },
    { id: "y_byouki_online", w: 2, d: [200, 2000], t: "入院した相互のスペースに、みんなが声を寄せた。ネットの優しさは、たまに本物だ。", fx: { rel: 2, happy: 1, mental: 2 } },
    { id: "y_kurorekishi", w: 2, d: [300, 2000], t: "自分の黒歴史が自作で流通していた。「これはこれで」と思えるまでに、二年かかった。", fx: { happy: 2, know: 1 } },
    { id: "y_tsukarechat", w: 3, d: [150, 2000], cond: S => S.stats.mental < 55, t: "TLを見るのが、義務のように感じられた。指は動くが、心がついてこない。", fx: { mental: -3, heat: -3 } },
    { id: "y_genki", w: 2, d: [120, 2000], cond: S => S.stats.mental >= 70, t: "今日はやけに調子がいい。こんな日は決まって、良いポストが生まれる。", fx: { happy: 2, goroku: 1, fame: 40 } },
    /* --- 長寿 --- */
    { id: "y_700", w: 2, d: [700, 2000], once: true, t: "700日。気づけば、最初に仲良くなった人の大半はもういない。あなただけが、まだここにいる。", fx: { mental: 1, happy: 1 } },
    { id: "y_1000day", w: 2, d: [1000, 2000], once: true, t: "1000日目の挨拶をした。「まだおったんか」と笑われて、「おるわ」と返した。", fx: { happy: 3, nareai: 2, fame: 60 } },
    { id: "y_jidai", w: 2, d: [400, 2000], t: "参入当時の常識が、もう界隈の教科書から消えかけている。あなたの記憶だけが一次資料だ。", fx: { know: 2, goroku: 1 } },
    { id: "y_oshirase3", w: 2, d: [800, 2000], t: "「界隈、終わる終わる詐欺で10年続いてる」という投稿に、全員が草を生やした。", fx: { happy: 1 } }
  );

  /* ================= 決断 追加 ================= */
  HK.DECISIONS2.push(
    { id: "yj_note", w: 3, d: [100, 1500], once: true, cond: S => S.hk.goroku >= 35, prompt: "界隈の考察記事を書いてみないか。noteは自由だ。",
      choices: [
        { label: "書いて公開", t: "記事は静かに読まれた。界隈の外からの感想が、あなたの視野を広げた。", fx: { know: 3, fame: 80, goroku: 1, flags: ["writer"] } },
        { label: "下書きで寝かせる", t: "下書きは熟成されるほど、公開されない。", fx: { know: 1 } }
      ] },
    { id: "yj_matome", w: 3, d: [150, 2000], once: true, cond: S => S.flags.includes("matome"), prompt: "あなたをネタにしたまとめ記事が伸びている。訂正を求めるか、黙るか。",
      choices: [
        { label: "訂正を申し入れる", t: "丁寧に申し入れた。記事はひっそり修正され、あなたの株は上がった。", fx: { know: 1, mental: 2, fame: 40 } },
        { label: "ネタとして受け入れる", t: "受け入れた。まとめに載ることも、この界隈の勲章のうちだ。", fx: { fame: 80, happy: 2, mental: -1 } }
      ] },
    { id: "yj_ai", w: 3, d: [200, 2000], once: true, era: [2024, 2026], prompt: "自分の声と口調をAIに学習させて、喋らせてみないか、という誘い。",
      choices: [
        { label: "許可する", t: "あなたのコピーがTLで喋っている。本物より人気が出た日は、少し複雑だった。", fx: { fame: 200, know: 1, mental: -2, flags: ["aivoice"] } },
        { label: "断る", t: "自分の声は、自分のもので終わらせた。", fx: { mental: 2 } }
      ] },
    { id: "yj_tool", w: 3, d: [150, 2000], once: true, cond: S => S.hk.skill >= 55, prompt: "作ったツールを界隈に無料公開するか、身内だけで使うか。",
      choices: [
        { label: "無料公開", t: "公開した。導入記事を書いてくれる人が現れ、あなたは「運営の人」になった。", fx: { fame: 300, rel: 2, skill: 2, flags: ["builder"] } },
        { label: "身内だけ", t: "静かに使った。道具は、静かな方が長持ちする。", fx: { mental: 1, rel: 1 } }
      ] },
    { id: "yj_sales", w: 3, d: [100, 1500], once: true, prompt: "伸びている企画に、自分の作品を売り込むDMを送るか迷っている。",
      choices: [
        { label: "送る", t: "送った。二つ返事で採用され、あなたの名前がクレジットに載った。", fx: { fame: 250, happy: 2, rel: -1 } },
        { label: "やめておく", t: "宣伝下手は、この界隈では美徳でもある。", fx: { mental: 1 } }
      ] },
    { id: "yj_politics", w: 3, d: [90, 2000], once: true, prompt: "TLで政治の議論が白熱している。あなたの一言で、風向きが変わるかもしれない。",
      choices: [
        { label: "意見を書く", t: "書いた。賛否が両方届いた。TLの熱を、直接指で触った気がした。", fx: { know: 2, edge: 2, fame: 100, fameRisk: 3 } },
        { label: "黙る", t: "界隈の平和は、書かない勇気でできている。", fx: { mental: 1 } }
      ] },
    { id: "yj_alq_go", w: 3, d: [80, 2000], once: true, prompt: "アルカイダの一派が、あなたを仲間に誘っている。ノリか、本気か。",
      choices: [
        { label: "一回だけ乗る", t: "乗った。TLが悲鳴を上げ、あなたは少し笑った。凍結リスクが跳ね上がった。", fx: { edge: 6, banRisk: 14, happy: 3, flags: ["alqaeda"], zukan: ["c2"] } },
        { label: "距離を置く", t: "「お前らは見てるだけにするわ」。賢明、という言葉が似合う選択だった。", fx: { mental: 2, know: 1 } }
      ] },
    { id: "yj_dev_report", w: 3, d: [100, 2000], once: true, prompt: "開発光の言動を、時系列でまとめたレポートを作る人が求められている。",
      choices: [
        { label: "作る", t: "数十時間かけてレポートを作った。引用され、参考文献に載り、あなたは「資料の人」になった。", fx: { dev: 4, know: 3, fame: 250, goroku: 1 } },
        { label: "参加しない", t: "誰かが作る。誰かが作った。それを読んだ。", fx: { know: 1 } }
      ] },
    { id: "yj_off_trip", w: 3, d: [120, 1200], once: true, prompt: "界隈の仲間内で、聖地巡りの小旅行の計画が立っている。",
      choices: [
        { label: "参加する", t: "参加した。写真は一枚だけ、顔なしで上げた。思い出は、全部持って帰った。", fx: { happy: 4, rel: 3, fameRisk: 10, zukan: ["p3"] } },
        { label: "見送る", t: "見送った。彼らの帰りの報告を、家で読んだ。それも楽しかった。", fx: { happy: 1 } }
      ] },
    { id: "yj_shinjin", w: 4, d: [200, 2000], prompt: "あなたより新しい新参が、挨拶もそこそこに失敗しそうな動きをしている。",
      choices: [
        { label: "DMでこっそり教える", t: "教えた。彼は後で「先輩のおかげです」と言ってくれた。面と向かっては、言われなかったけど。", fx: { rel: 2, happy: 3, nareai: 1 } },
        { label: "公開で注意する", t: "公開で注意した。教育的だが、教育は時に公開処刑だ。", fx: { edge: 2, rel: -1, goroku: 1 } },
        { label: "静観する", t: "彼は失敗し、学んだ。それも新人研修だ。", fx: {} }
      ] },
    { id: "yj_kakure", w: 3, d: [300, 2000], once: true, cond: S => S.hk.fameRisk >= 45, prompt: "身バレの疑いが濃くなってきた。捨て垢に引っ越すか、堂々と続けるか。",
      choices: [
        { label: "捨て垢に引っ越す", t: "新しい場所で、静かにやり直した。名前のない生活も、悪くなかった。", fx: { fameRisk: -30, fame: -250, mental: 2 } },
        { label: "堂々と続ける", t: "続けた。隠さない強さは、界隈で一目置かれる。", fx: { fame: 150, mental: -1, fameRisk: 4 } }
      ] },
    { id: "yj_tensei_hikaku", w: 2, d: [400, 2000], once: true, cond: S => S.hk.freezes >= 2, prompt: "転生を重ねて、名前が三つになった。どれが本当のあなたか、もう分からない。",
      choices: [
        { label: "全部が自分だと思う", t: "全部まとめて自分だ。名前に、人生の数だけの層ができた。", fx: { mental: 3, goroku: 1, happy: 1 } },
        { label: "最後の名前だけを残す", t: "過去を削ぎ落とした。身軽だが、少しだけ寒い。", fx: { mental: 1, fame: -50 } }
      ] },
    { id: "yj_shokuba", w: 2, d: [500, 1800], once: true, cond: S => S.age >= 19, prompt: "職場の飲み会で、ネットの話になった。あなたの界隈の話を、するか。",
      choices: [
        { label: "隠語だけで話す", t: "「まあ、ネットの友達が多くて」。それで通った。", fx: { know: 1, happy: 1 } },
        { label: "全部話す", t: "話した。課長は「若いなぁ」と笑った。翌日、少し評価が下がった気がする。", fx: { know: 1, fameRisk: 3, happy: -1 } }
      ] },
    { id: "yj_kanai", w: 2, d: [700, 1800], once: true, cond: S => S.flags.includes("married"), prompt: "パートナーが、あなたの垢を見たいと言っている。",
      choices: [
        { label: "見せる", t: "見せた。「へえ、友達いっぱいじゃん」。その一言で、肩の荷が下りた。", fx: { rel: 3, happy: 3, fameRisk: 3 } },
        { label: "見せない", t: "見せないまま、結婚生活は続く。秘密は、罪ではない。", fx: { mental: -1 } }
      ] },
    { id: "yj_sotsugyou_shiki", w: 2, d: [400, 1200], once: true, prompt: "卒業に合わせて、界隈からも「卒業」する人が増えている。",
      choices: [
        { label: "見送りの言葉を書く", t: "見送りのポストを書いた。出会いと別れは、同じ速度でやってくる。", fx: { rel: 2, happy: 1, know: 1 } },
        { label: "自分のことは考えない", t: "まだ、終わりを考える時間じゃない。", fx: { heat: 3 } }
      ] },
    { id: "yj_loggera", w: 2, d: [200, 2000], once: true, prompt: "TLの記録係が引退し、ログを引き継いでほしいと言われた。",
      choices: [
        { label: "引き継ぐ", t: "膨大なスクショの山を引き継いだ。界隈の記憶を守る、地味で尊い仕事だ。", fx: { know: 3, rel: 2, flags: ["archivist"] } },
        { label: "断る", t: "記憶は、皆の中にある。そう思って断った。", fx: { mental: 1 } }
      ] },
    { id: "yj_muse", w: 3, d: [250, 2000], once: true, prompt: "「もう界隈に飽きた」という気持ちと、「まだ好きだ」という気持ちが、同じ大きさで並んでいる。",
      choices: [
        { label: "重点を変えてみる", t: "重点を変えた。同じ海でも、泳ぎ方を変えれば景色が変わる。", fx: { heat: 15, happy: 2 } },
        { label: "休む", t: "二週間休んだ。戻ってきた時、TLはあなたを覚えていた。", fx: { mental: 4, heat: -5, hp: 2 } }
      ] },
    { id: "yj_saikon", w: 2, d: [300, 2000], once: true, cond: S => S.hk.retireCount >= 1, prompt: "一度去った人が、また戻ってきた。再会の言葉は、何にする？",
      choices: [
        { label: "「おかえり」", t: "「おかえり」。これが一番強い言葉だと知っている。", fx: { rel: 2, happy: 2, nareai: 1 } },
        { label: "「誰でしたっけ」", t: "冗談めかして言った。苦笑いが返ってきた。", fx: { rel: 1, happy: 1 } }
      ] },
    { id: "yj_juudai", w: 2, d: [600, 1800], once: true, prompt: "自分より10歳上の界隈の人が、「君ら若い子はいいね」と言っている。",
      choices: [
        { label: "「そちらも十分若いです」", t: "返した。界隈に年齢の壁は、あってないようなものだ。", fx: { rel: 2, happy: 2 } },
        { label: "素直に頷く", t: "頷いた。先輩には、素直が一番強い。", fx: { rel: 1, nareai: 1 } }
      ] },
    { id: "yj_bots", w: 2, d: [200, 2000], once: true, cond: S => S.hk.skill >= 50, prompt: "あなたの作ったbotが、勝手に語録を呟いて育っている。",
      choices: [
        { label: "育てる", t: "新機能を足した。botのTLが、あなたの作品の墓標になった。", fx: { skill: 3, fame: 150, flags: ["builder"] } },
        { label: "止める", t: "止めた。自動化より、人間の方が好きだった。", fx: { know: 1 } }
      ] },
    { id: "yj_oman", w: 2, d: [300, 2000], once: true, prompt: "参入から何百回目の朝挨拶になった。同じ構文を、これからも使う?",
      choices: [
        { label: "使い続ける", t: "使い続けた。繰り返しは、儀式になる。", fx: { nareai: 3, goroku: 1, happy: 2 } },
        { label: "新しい定型を考える", t: "新しい挨拶を始めた。最初は誰も使わなかったが、半年後に三人が使っていた。", fx: { goroku: 3, fame: 40 } }
      ] },
    { id: "yj_kaidan_irai", w: 2, d: [500, 2000], once: true, cond: S => S.hk.followers >= 2000, prompt: "有名になってから、界隈の揉め事の相談がDMに来るようになった。",
      choices: [
        { label: "相談に乗る", t: "乗った。仲裁は疲れるが、誰かがやらなければならない。", fx: { rel: 3, mental: -2, happy: 1 } },
        { label: "「関係ないので」と断る", t: "断った。あなたの時間は、あなたのものだ。", fx: { mental: 1 } }
      ] },
    { id: "yj_fukanzen", w: 2, d: [150, 2000], once: true, prompt: "作品が途中で見つかった。完成させるか、未完成のまま公開するか。",
      choices: [
        { label: "完成させる", t: "時間をかけて完成させた。努力は裏切らないが、待ってくれたのは二人だけだった。", fx: { skill: 5, fame: 80 } },
        { label: "未完成のまま出す", t: "未完成のまま出した。荒削りなものにしかない魅力を、一部の人が拾ってくれた。", fx: { skill: 2, fame: 150, happy: 1 } }
      ] }
  );

  /* ================= 図鑑 追加 ================= */
  HK.DATA2.zukan.push(
    { id: "c31", cat: "文化", name: "ヒカマニ暦（H.E.）", desc: "界隈の仮想世界「ヒカマーズ地球」で使われる暦。元年＝Hikakin_Maniaの創造とされる。" },
    { id: "c32", cat: "文化", name: "ヒカマーズ地球", desc: "ヒカマーが作った仮想地球。アルカイダ帝国・AI生成島・音マー連邦などが領土を分ける。" },
    { id: "c33", cat: "文化", name: "ファボなしRT島", desc: "仮想地球の大国。名前の通り、いいねもRTもない場所を指す冗談の産物。" },
    { id: "c34", cat: "文化", name: "切り抜き文化", desc: "誰かの発言を切り抜いて素材にする行為。される側になるのは、半ば名誉だ。" },
    { id: "c35", cat: "文化", name: "素材化", desc: "投稿が写真や音として界隈の素材になること。作品の中で、不死身になる。" },
    { id: "c36", cat: "文化", name: "アーカイブ勢", desc: "スクショとログを集め、消えたものを残す人たち。界隈の記憶係。" },
    { id: "c37", cat: "文化", name: "弊界隈構文", desc: "「弊界隈」という自嘲の言い回し。半分の自負を込めて使われる。" },
    { id: "c38", cat: "文化", name: "公式より早い人", desc: "発掘と速報が全て。遅刻した情報は、もう情報ではない。" },
    { id: "c39", cat: "道具", name: "ヤジュッター / 野獣ノート", desc: "ヤジュヤジュ系列のSNS・メモ帳。別界隈の道具だが、ヒカマーも覗きに行く。" },
    { id: "c40", cat: "道具", name: "迫真広告部", desc: "ヤジュヤジュ系列の広告ごっこ。偽チラシ文化の親戚。" },
    { id: "g21", cat: "語録", name: "言うまでもない", desc: "ヒカマニ語録の定番。同意と軽蔑を同時に運ぶ、万能の車両。" },
    { id: "g22", cat: "語録", name: "草、ゥ", desc: "笑いの最後に付く小文字の「ゥ」。文字数の美学。" },
    { id: "g23", cat: "語録", name: "そ決 / そ決まり", desc: "「そうに決まっている」の短縮形。挨拶代わりに使われる。" },
    { id: "g24", cat: "語録", name: "ンァ〜", desc: "呆れと愛着のため息。舌打ちと唸りの中間にある音。" },
    { id: "g25", cat: "構文", name: "俺が何をしたってんだよ、説明しろよ！", desc: "とあるスペースのバトルから生まれた完全犯罪者風の構文。反省は含まれない。" },
    { id: "g26", cat: "構文", name: "はじめまして、そ決", desc: "新参への返しの定番。この一言で、扉が開く。" },
    { id: "g27", cat: "語録", name: "塩対応ありが🈵", desc: "冷たいけどありがとう。語録の温度管理は、この界隈の高度技術。" },
    { id: "e11", cat: "事件", name: "年越しスペース", desc: "毎年12月31日、誰かのスペースで年を越す。最初にカウントダウンした人が勝者になる風習がある。" },
    { id: "e12", cat: "事件", name: "ログ引き継ぎ", desc: "去る人が、スクショの山を残して人に託す儀式。デジタルの形見分け。" },
    { id: "e13", cat: "事件", name: "最終ログインの記録", desc: "「あれからこの垢、動いてないんだよな」。TLの端に、そういう垢が並んでいる。" },
    { id: "p12", cat: "場所", name: "TLの端 (フォロー外) の観測所", desc: "フォローしていないのに流れてくる界隈の端。観測所派の聖地。" },
    { id: "p13", cat: "場所", name: "まとめサイトのコメント欄", desc: "界隈の外の目。恐れるより、読みに行く人が多い。" },
    { id: "h11", cat: "人", name: "同期", desc: "同じ頃に参入した仲間たち。全員で歩き出すのに、一人ずつ止まっていく。" },
    { id: "h12", cat: "人", name: "古参", desc: "生きている年表。話しかけると、あなたの知らない前史を教えてくれる。" },
    { id: "h13", cat: "人", name: "パリピマー", desc: "界隈の明るい出身。ノリの振幅が人より二回り大きい。" },
    { id: "h14", cat: "人", name: "ロムの巨人", desc: "投稿せず全てを知っている。姿を見せた時、界隈はざわつく。" },
    { id: "t2019b", cat: "時代", name: "ニコチンTVの教え", desc: "「ヒカマニは開かれたミームだ」。この一文が界隈の憲法になった。" },
    { id: "t2022b", cat: "時代", name: "制裁の体系化", desc: "2022年、制裁が作法として整った。同時に、私物化の問題も生まれた。" },
    { id: "t2024b", cat: "時代", name: "露悪の時代", desc: "2024年以降、露悪が強さになった。笑いのハードルが下がり、地雷も増えた。" },
    { id: "t2026b", cat: "時代", name: "摩擦の時代", desc: "2026年、界隈は最大規模に。揉め事の粒度も、最大になった。" }
  );

  /* ================= 称号 追加 ================= */
  HK.DATA2.titles.splice(HK.DATA2.titles.length - 2, 0,
    { id: "bunkajin", rank: "A", name: "文化人", cond: "era<=2021 && goroku>=70", desc: "最初期の空気を覚えていて、それを正しい文脈で使える数少ない一人。" },
    { id: "aidai", rank: "A", name: "AI世代の申し子", cond: "era>=2023 && skill>=75", desc: "道具が変わる時、使い倒す側に回った。時代を泳ぐ才能は本物だ。" },
    { id: "koban", rank: "B", name: "日陰の功臣", cond: "flags.includes('builder') && fame<1500", desc: "名前は売れなかったが、道具と場所はあなたの仕事だ。" },
    { id: "matome", rank: "B", name: "まとめられし者", cond: "flags.includes('matome')", desc: "界隈の外の人は、あなたの投稿でこの界隈を知った。" },
    { id: "owarai", rank: "B", name: "最後の笑い", cond: "mental<35 && fame>=3000", desc: "人気の重さに、心が先に音を上げた。それでも、笑いを手放さなかった。" },
    { id: "morikaeri", rank: "B", name: "帰り道の人", cond: "retireCount>=2 && days>=500", desc: "どれだけ出ても、帰る場所があった。それはあなた自身が作った場所だ。" },
    { id: "uchu", rank: "A", name: "語り部", cond: "days>=1000 && goroku>=50", desc: "千日の記憶を持って話せる人。知識は、この界隈では最も静かな強さだ。" },
    { id: "natsukashi", rank: "C", name: "なつかしの年の人", cond: "days>=365 && days<730 && fame<300 && flags.includes('nightowl')", desc: "深夜のTLでしか会えないタイプだった。あの時間帯は、あなたの時代だ。" },
    { id: "mushoku", rank: "B", name: "無職の浪漫", cond: "flags.includes('nightowl') && days>=800 && mental>=50", desc: "夜の界隈を守り続けた番人。生活リズムは、犠牲になった。" }
  );

  /* ================= 終わり方 追加 ================= */
  HK.DATA2.endings.push(
    { id: "account_delete", name: "垢ごと消えた", desc: "全ポスト削除。デジタルタトゥーは自分では消せないと言うが、あなたは消して回った。" },
    { id: "immigrate", name: "新天地へ", desc: "別の界隈に移った。界隈移動は、この界隈では最大のクソムーブだが、一番人間らしい選択でもある。" },
    { id: "ghost", name: "幽霊", desc: "垢は残っている。フォローも残っている。ただ、もう話さない。時々、いいねだけがつく。" },
    { id: "rest", name: "おやすみ", desc: "「しばらくお休みします」。その「しばらく」は、まだ終わっていない。" },
    { id: "burnout", name: "燃え尽き", desc: "全力で走って、ある朝ふっと火が消えた。無理をした自覚は、なかった。" }
  );

  /* ================= 重点 追加 ================= */
  HK.DATA2.focuses.push(
    { id: "politics", label: "政治・時事", desc: "TLの火種を、正面から見に行く。", followK: 0.95, skillK: 0.8, riskK: 1.5, nareaiK: 1.0 },
    { id: "alqaeda", label: "アルカイダ", desc: "不快画像でTLを占拠する。凍結リスク最大。", followK: 1.1, skillK: 0.7, riskK: 2.2, nareaiK: 0.9 },
    { id: "factdev", label: "開発叩き", desc: "ファクトを掘り、まとめ、発信する。", followK: 1.0, skillK: 0.9, riskK: 1.3, nareaiK: 0.8 },
    { id: "toolwork", label: "道具づくり", desc: "bot・サイト・ツールを作る影の実力者。", followK: 0.9, skillK: 1.8, riskK: 0.9, nareaiK: 0.7 },
    { id: "sales", label: "拡散営業", desc: "波に乗る技術で数字を伸ばす。", followK: 1.35, skillK: 0.8, riskK: 1.1, nareaiK: 1.3 },
    { id: "offline", label: "凸・オフ活動", desc: "聖地に行き、人に会う。リアルは危険で楽しい。", followK: 1.0, skillK: 0.7, riskK: 1.8, nareaiK: 1.1 }
  );

  /* ================= 仲間アーク 追加 ================= */
  HK.DATA2.compArcs.push(
    { id: "archiver", lines: ["はスクショを集めてアーカイブをやっている。消えたものの墓守だ。", "の保管庫に、あなたの初期のポストも保存されていた。少しだけ、死なない気がした。"] },
    { id: "rival", lines: ["とお互いの投稿をよく引用し合っている。ライバル、というには温度が熱い。", "はあなたを超えていった。悔しいが、見送るのは嫌いじゃない。"] },
    { id: "sisters", lines: ["と毎日リプを送り合うようになった。挨拶の定型だけで、会話が成立する。", "の拾った語録を、あなたも無意識に使い始めていた。馴れ合いは、うつる。"] }
  );

  /* 運命の結末ラベル（エンディングで仲間を並べて表示） */
  HK.DATA2.compFates = {
    legend: "伝説になった", mid: "中堅として今も活動中", freeze: "凍結と転生を繰り返した",
    vanish: "消息不明のまま", yami: "病みと復帰を経た", alq: "アルカイダーとして生き延びた",
    hikakou: "ROMになって垢だけ残した", buzz: "一度大バズした", graduated: "現実のために卒業した",
    archiver: "アーカイブに残り続けている", rival: "今も最大のライバルだ", sisters: "毎日リプを送り合う仲になった"
  };

  /* ================= 新しい終わり方への決断 ================= */
  HK.DECISIONS2.push(
    { id: "yj_delete", w: 2, d: [200, 2000], once: true, cond: S => S.flags.includes("doxxed") || S.hk.edge >= 65, prompt: "過去のポストを全部消して、垢ごと消える——という選択肢が、頭から離れない。",
      choices: [
        { label: "全部消して消える", t: "ポストを一つずつ消した。最後の一つを消す時、少しだけ手が止まった。", fx: { end: "account_delete" } },
        { label: "残しておく", t: "残した。黒歴史も、あなたの歴史だ。", fx: { mental: 2 } }
      ] },
    { id: "yj_immigrate", w: 2, d: [250, 2000], once: true, prompt: "別の界隈から、移住しないかという誘いが来ている。",
      choices: [
        { label: "新天地へ移る", t: "荷造りは一晩で終わった。アカウントは、引っ越しの荷物にならない。", fx: { end: "immigrate" } },
        { label: "ここに残る", t: "残った。他所の界隈の話は、聞くだけにした。", fx: { nareai: 2, happy: 1 } }
      ] },
    { id: "yj_rest", w: 3, d: [180, 2000], once: true, prompt: "「しばらくお休みします」——その一文を、下書きに書いては消している。",
      choices: [
        { label: "投稿してお休みに入る", t: "投稿した。休むと宣言した夜のTLは、いつもよりずっと静かだった。", fx: { end: "rest" } },
        { label: "下書きを消す", t: "消した。休むのは、まだ先でいい。", fx: { heat: 6, mental: 1 } }
      ] },
    { id: "yj_burnout", w: 2, d: [300, 2000], once: true, cond: S => S.flags.includes("buzzmaster") && S.heat < 35, prompt: "大バズの後、何を投稿しても前ほど伸びない。火が、静かに小さくなっている。",
      choices: [
        { label: "火が消えるままにする", t: "無理に薪をくべなかった。ある朝、アプリを開く理由が消えていることに気づいた。", fx: { end: "burnout" } },
        { label: "もう一度燃やす", t: "もう一度、全力で投稿した。小さな火が、また付いた。", fx: { heat: 20, happy: 3, hp: -2 } }
      ] }
  );
})();
