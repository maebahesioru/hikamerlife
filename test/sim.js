/* ヘッドレス・シミュレーション（バランス検証用）
   使い方: node test/sim.js [n] [random|amb]
*/
global.window = global;
require("../js/data.js");
require("../js/events.js");
require("../js/engine.js");

const N = parseInt(process.argv[2] || "300", 10);
const ST = process.argv[3] || "random";
const titles = {};
let joined = 0, joinAgeSum = 0, peakSum = 0, peakMax = 0, freezeSum = 0, doxx = 0, retireSum = 0;
let deathAges = [];
let decisionsSeen = 0, eventsSeen = 0;
let peakBuckets = { "0": 0, "1-100": 0, "101-1000": 0, "1001-1万": 0, "1万+": 0 };
let rareMin = Infinity, rareMax = 0;

function score(choice) {
  const f = choice.fx || {};
  let s = 0;
  if (f.join) s += 50;
  s += (f.skill || 0) * 3;
  s += (f.goroku || 0) * 2;
  s += (f.fame || 0) / 200;
  s += (f.happy || 0) * 0.4;
  s += (f.know || 0) * 0.3;
  s -= (f.banRisk || 0) * 0.8;
  s -= (f.fameRisk || 0) * 0.5;
  s -= (f.edge || 0) * 0.3;
  return s;
}

for (let i = 0; i < N; i++) {
  const S = HK.engine.newGame({ seed: 1000 + i * 7 });
  let guard = 0;
  while (!S.dead && guard < 400) {
    guard++;
    HK.engine.step(S);
    if (S.pending) {
      if (S.pending.kind === "decision") {
        const dec = HK.DECISIONS.find(x => x.id === S.pending.id);
        let idx = 0;
        if (ST === "amb") {
          let best = -1e9;
          dec.choices.forEach((c, j) => { const s = score(c); if (s > best) { best = s; idx = j; } });
        } else {
          idx = Math.floor(Math.random() * dec.choices.length);
        }
        HK.engine.resolve(S, idx);
        decisionsSeen++;
      } else {
        HK.engine.resolve(S, ST === "amb" ? 0 : Math.floor(Math.random() * 2));
      }
    }
    if (guard > 350) break;
  }
  eventsSeen += S.log.length;
  if (S.hk.joined) { joined++; joinAgeSum += S.hk.joinAge; }
  peakSum += S.hk.peakFollowers;
  peakMax = Math.max(peakMax, S.hk.peakFollowers);
  freezeSum += S.hk.freezes;
  retireSum += S.hk.retireCount;
  if (S.flags.includes("doxxed")) doxx++;
  deathAges.push(S.age);
  const t = S.title ? S.title.name : "(no title)";
  titles[t] = (titles[t] || 0) + 1;
  const pf = S.hk.peakFollowers;
  if (pf === 0) peakBuckets["0"]++;
  else if (pf <= 100) peakBuckets["1-100"]++;
  else if (pf <= 1000) peakBuckets["101-1000"]++;
  else if (pf <= 10000) peakBuckets["1001-1万"]++;
  else peakBuckets["1万+"]++;
  const rare = S.prob ? Math.round(1 / S.prob.product) : 0;
  rareMin = Math.min(rareMin, rare || rareMin); rareMax = Math.max(rareMax, rare);
}

deathAges.sort((a, b) => a - b);
console.log("==== ", N, "lives /", ST, "====");
console.log("joined:", joined, `(${(joined / N * 100).toFixed(1)}%)`, "avg join age:", joined ? (joinAgeSum / joined).toFixed(1) : "-");
console.log("avg peak followers:", Math.round(peakSum / N), "max:", peakMax);
console.log("peak buckets:", JSON.stringify(peakBuckets));
console.log("avg freezes:", (freezeSum / N).toFixed(2), "avg retires:", (retireSum / N).toFixed(2), "doxxed:", doxx, `(${(doxx / N * 100).toFixed(1)}%)`);
console.log("death age median:", deathAges[Math.floor(N / 2)], "min:", deathAges[0], "max:", deathAges[N - 1]);
console.log("avg log entries:", Math.round(eventsSeen / N), "decisions:", decisionsSeen);
console.log("rare range 1/x:", rareMin.toLocaleString(), "〜", rareMax.toLocaleString());
console.log("titles:");
Object.entries(titles).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log("  ", k, v));
