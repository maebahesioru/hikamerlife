# 4万分の1のヒカマー

Xのインターネットで、ひとつの人生を生きるブラウザゲーム。ヒカマー界隈の実データ・実史をベースにした人生シミュレーション。

- **本番URL**: https://hikamerlife.hikamers.app/
- 構成: 素のHTML/CSS/JS（ビルド不要） + nginx:alpine（Coolifyデプロイ）
- 参考にした作品: [80億分の1](https://1in8b.life/ja/) / [1.2億分の1](https://1in120m.uxwxu.com/) / [100万分の1(富山)](https://nurie.xyz/1in1m-toyama/) / [人間に生まれる確率](https://yoshitakeapp.com/games/next-life-gacha/) / [日本に生まれる](https://nihonjin.iniminigames.com/)

## 使い方（クイックスタート）

1. トップで「生まれる」を押す（名前・ハンドル・性別・生年は任意）
2. 1年ずつ人生が進む。決断が来たら選ぶ。右上の速度（×1〜×8）と「おまかせ」で放置も可
3. 人生が終わると称号・希少度・共有カードが出る。カードはPNG保存できる
4. 「メモリアル」に納めると、直近10回分の人生がこの端末に残る（ろうそくも灯せる）
5. 出会った語録・文化・事件は「図鑑」に貯まる（人生を重ねるほど増える）

## ステータス

- **基礎**: 健康 / 幸福 / 知識 / 人間関係 / メンタル
- **ヒカマー期**: フォロワー / 語録力 / 技量 / 特定リスク / 凍結リスク
- 隠し軸: 馴れ合い度・過激さ・開発叩き度（称号と一部イベントに影響）

## しくみ（要約）

- 生涯はシード付き乱数で決定的。生年(2005〜2014)・都道府県・家・ネット環境はくじ
- 12〜16歳で「ヒカマニとの出会い」→「#新参ヒカマー」の決断。以後、フォロワー成長・炎上・特定・凍結・引退/復帰・世代交代が進む
- 界隈の平均寿命「2〜3年」を指数分布で近似し、多くのアカウントが数年で冷めていく（生存曲線に表示）
- 死亡は年齢・性別・健康・メンタルの簡易生命表。確率チェーン（日本に生まれる1/66.7〜）は**表示された数字の積＝合計**になるように丸めてある

## データ出典（実測）

| データ | 値 | 出典 |
|---|---|---|
| ヒカマーWiki 記事/利用者 | 595 / 187（2026-08実測） | hikamers.net |
| ヒカマー一覧（名簿） | 約1,234件 | hikamers.net |
| Hikabooru 投稿/タグ | 56,603 / 375,176 | hikabooru.hikamers.app API実測 |
| ニコニコ「Hikakin_mania」タグ | 15,019本（外伝リンク3,762本） | ニコニコ動画 |
| ヒカマーズ8values 回答 | 357件・最多「反開發主義」 | hikamer8values.hikamers.app API実測 |
| 界隈の活動人口 | 数百〜数千人・平均寿命2〜3年 | ヒカマーWiki Handbooks |
| 日本の出生/人口 | 68.6万人/年（2024）・約1.23億人 | 厚労省/総務省（参考サイトに同じ） |

※ 登場人物・出来事はフィクションです。実在の人物への攻撃や特定を推奨するものではありません。

## 開発

```bash
# ローカル
cd site && python3 -m http.server 8899

# バランス検証（ヘッドレス）
node test/sim.js 400 random   # ランダム戦略400人生
node test/sim.js 300 amb      # 創作寄り戦略

# 実測テスト（Playwright, c4-env）
~/c4-env/bin/python ../../ダウンロード/hikamer_life_research/test_game.py
```

- `site/js/data.js` — 実データ・称号・図鑑・名前パーツ
- `site/js/events.js` — イベント/決断データ
- `site/js/engine.js` — シムエンジン（RNG/成長/リスク/死亡/称号/確率）
- `site/js/ui.js` — 画面・モーダル・共有カード（Canvas）・図鑑/メモリアル（localStorage）

## デプロイ

Coolify（VM100）+ Cloudflare Tunnel。静的サイト手順は `references/static-site-github-coolify-flow.md`（coolify-managementスキル）を参照。
更新は `git push` → `POST /api/v1/deploy?uuid=<app-uuid>`。
