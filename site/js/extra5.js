/* =========================================================
   10万分の1のヒカマー v3.9 — 道具屋（お金の使い道）
   ========================================================= */
window.HK = window.HK || {};

(function () {
  const D = HK.DATA2;
  D.shopItems = [
    { id: "phone", label: "中古スマホに買い替える", price: 50000, once: true, desc: "画面のヒビは、もう気にしない。", fx: { skill: 3, happy: 2 } },
    { id: "pc", label: "デスクトップPCを組む", price: 300000, once: true, desc: "深夜の作業台が、本物になった。", fx: { skill: 8, dev: 6, happy: 3 } },
    { id: "mic", label: "マイクを買う", price: 80000, once: true, desc: "声が、界隈に届く道具になった。", fx: { skill: 4, dev: 4, happy: 1 } },
    { id: "hikari", label: "光回線を引く", price: 60000, once: true, desc: "待ち時間が消えた。指はもっと速く動く。", fx: { dev: 5, heat: 2 } },
    { id: "drink", label: "エナジードリンク", price: 5000, desc: "深夜が、もう少しだけ伸びる。", fx: { happy: 2, hp: -1 } },
    { id: "karaoke", label: "カラオケで発散", price: 10000, desc: "十八番は、界隈で一番流行ってる曲。", fx: { happy: 4, mental: 3 } },
    { id: "ad", label: "自分の宣伝", price: 20000, desc: "TLのすみっこに、あなたの宣伝が並んだ。", fx: { fame: 60 } },
    { id: "game", label: "ゲームに課金", price: 30000, desc: "後悔は明日の自分に任せる。", fx: { happy: 1, mental: -1 } }
  ];
})();
