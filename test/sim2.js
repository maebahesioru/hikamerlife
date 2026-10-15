/* 4万分の1のヒカマー v2 — ヘッドレス・シミュレーション
   使い方: node test/sim2.js [n] [random|sakusei|nareai|real]
*/
global.window = global;
require("../site/js/data2.js");
require("../site/js/events2.js");
require("../site/js/extra2.js");
require("../site/js/extra3.js");
require("../site/js/engine2.js");

const N = parseInt(process.argv[2] || "300", 10);
const ST = process.argv[3] || "random";
const endings = {}, titles = {};
let daysArr = [], peakArr = [], freezeSum = 0, doxx = 0, decCount = 0;
let peakBuckets = { "0-99": 0, "100-999": 0, "1000-9999": 0, "1万+": 0 };

for (let i = 0; i < N; i++) {
  const S = HK.engine2.newGame({ seed: 7000 + i * 13 });
  if (ST === "sakusei") S.focus = "sakusei";
  if (ST === "nareai") S.focus = "nareai";
  if (ST === "real") S.focus = "real";
  let guard = 0;
  while (!S.ended && guard < 4000) {
    guard++;
    HK.engine2.step(S);
    if (S.pending && S.pending.kind === "decision") {
      const dec = HK.DECISIONS2.find(x => x.id === S.pending.id);
      let idx = Math.floor(Math.random() * dec.choices.length);
      if (ST !== "random") {
        let best = -1e9;
        dec.choices.forEach((c, j) => {
          const f = c.fx || {}; let s = 0;
          if (ST === "sakusei") s += (f.skill || 0) * 3 + (f.fame || 0) / 300;
          if (ST === "nareai") s += (f.nareai || 0) * 2 + (f.rel || 0) + (f.fame || 0) / 500;
          if (ST === "real") s += (f.know || 0) * 2 + (f.money || 0) / 50000;
          s += (f.fame || 0) / 600 - (f.banRisk || 0) * 0.3 - (f.fameRisk || 0) * 0.2;
          if (f.end) s -= 8;
          if (s > best) { best = s; idx = j; }
        });
      }
      HK.engine2.resolve(S, idx);
      decCount++;
    } else if (S.pending) {
      HK.engine2.resolve(S, 0);
    }
  }
  daysArr.push(S.dayNum);
  peakArr.push(S.hk.peakFollowers);
  freezeSum += S.hk.freezes;
  if (S.flags.includes("doxxed")) doxx++;
  endings[S.ending ? S.ending.id : "?"] = (endings[S.ending ? S.ending.id : "?"] || 0) + 1;
  const t = S.title ? S.title.name : "?";
  titles[t] = (titles[t] || 0) + 1;
  const pf = S.hk.peakFollowers;
  if (pf < 100) peakBuckets["0-99"]++;
  else if (pf < 1000) peakBuckets["100-999"]++;
  else if (pf < 10000) peakBuckets["1000-9999"]++;
  else peakBuckets["1万+"]++;
}

daysArr.sort((a, b) => a - b);
const med = arr => arr[Math.floor(arr.length / 2)];
console.log(`==== ${N} runs / ${ST} ====`);
console.log("days: median", med(daysArr), "min", daysArr[0], "max", daysArr[N - 1]);
console.log("peak followers: median", med([...peakArr].sort((a, b) => a - b)), "max", Math.max(...peakArr));
console.log("peak buckets:", JSON.stringify(peakBuckets));
console.log("avg freezes:", (freezeSum / N).toFixed(2), "| doxxed:", doxx, `(${(doxx / N * 100).toFixed(1)}%)`, "| decisions:", decCount);
console.log("endings:", JSON.stringify(endings));
console.log("titles:");
Object.entries(titles).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log("  ", k, v));
