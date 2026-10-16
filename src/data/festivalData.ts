import { LyricLine, MenuItem } from '../types/festival';

export const FESTIVAL_LYRICS: LyricLine[] = [
  { id: 1, timeSec: 0, text: "（〜 響き渡るファンファーレ＆熱気あふれるクラップ 〜）", section: "INTRO" },
  { id: 2, timeSec: 13, text: "朝の教室 粉まみれの手", subtext: "丸めた生地に 笑い声割れる", section: "A-MELO 1" },
  { id: 3, timeSec: 20, text: "看板の文字をちょっと曲げて", subtext: "チーズボールって 大きく書いた！", section: "A-MELO 1" },
  { id: 4, timeSec: 26, text: "揚げたてを待つ列の向こう", subtext: "友達が手を振ってる", section: "B-MELO 1" },
  { id: 5, timeSec: 33, text: "今日だけのこの教室が", subtext: "街で一番 熱い場所！！", highlight: true, section: "B-MELO 1" },
  { id: 6, timeSec: 41, text: "チーズボール まんまる笑顔！", subtext: "ひとくちでみんな 仲間だよ", highlight: true, section: "CHORUS 1" },
  { id: 7, timeSec: 48, text: "文化祭の鐘が鳴るまで", subtext: "このクラスで 駆け抜けよう", highlight: true, section: "CHORUS 1" },
  { id: 8, timeSec: 54, text: "チーズボール はい、どうぞ！", subtext: "「美味しい？」聞いて ハイタッチ！✨", highlight: true, section: "CHORUS 1" },
  { id: 9, timeSec: 60, text: "君と作った 今日の味は", subtext: "忘れられないよ 文化祭！", highlight: true, section: "CHORUS 1" },
  { id: 10, timeSec: 71, text: "注文の声に返事が重なる", subtext: "トングを渡して 袋を結ぶ", section: "A-MELO 2" },
  { id: 11, timeSec: 78, text: "ちょっと焦げたのは味見がかりへ", subtext: "「これは秘密ね」って 肩を寄せた", section: "A-MELO 2" },
  { id: 12, timeSec: 84, text: "忙しくても 目が合えば", subtext: "自然と元気が 戻る", section: "B-MELO 2" },
  { id: 13, timeSec: 91, text: "それぞれの得意なこと", subtext: "持ち寄ったら 最強だ！", highlight: true, section: "B-MELO 2" },
  { id: 14, timeSec: 98, text: "チーズボール まんまる笑顔！", subtext: "ひとくちでみんな 仲間だよ", highlight: true, section: "CHORUS 2" },
  { id: 15, timeSec: 105, text: "文化祭の鐘が鳴るまで", subtext: "このクラスで 駆け抜けよう", highlight: true, section: "CHORUS 2" },
  { id: 16, timeSec: 112, text: "チーズボール はい、どうぞ！", subtext: "「美味しい？」聞いて ハイタッチ！✨", highlight: true, section: "CHORUS 2" },
  { id: 17, timeSec: 118, text: "君と作った 今日の味は", subtext: "忘れられないよ 文化祭！", highlight: true, section: "CHORUS 2" },
  { id: 18, timeSec: 128, text: "片付けのあと 空っぽの箱", subtext: "黒板に残る 丸い絵...", section: "BRIDGE" },
  { id: 19, timeSec: 135, text: "明日になっても 話そうよ", subtext: "あの行列と あの笑顔――！", highlight: true, section: "BRIDGE" },
  { id: 20, timeSec: 143, text: "チーズボール まんまる笑顔！", subtext: "ひとくちでみんな 仲間だよ！", highlight: true, section: "FINAL CHORUS" },
  { id: 21, timeSec: 150, text: "文化祭の鐘が鳴ったって", subtext: "まだまだ声は 止まらない！", highlight: true, section: "FINAL CHORUS" },
  { id: 22, timeSec: 157, text: "チーズボール はい、どうぞ！", subtext: "クラスみんなで ハイタッチ！！✨", highlight: true, section: "FINAL CHORUS" },
  { id: 23, timeSec: 163, text: "君と作った 今日の味は", subtext: "忘れられないよ この文化祭！", highlight: true, section: "FINAL CHORUS" },
  { id: 24, timeSec: 173, text: "チーズボール、また会おう！！", subtext: "（〜 最高の笑顔でフィナーレ 〜）", highlight: true, section: "OUTRO" }
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "classic-mozza",
    name: "黄金モッツァレラ・クラシック",
    japaneseTitle: "看板メニュー",
    description: "外はカリッ、中はトロ〜リ！独自配合のもちもち米粉生地にモッツァレラをぎっしり包んだ不動の1番人気。",
    price: 300,
    cheeseStretchCm: 50,
    tag: "王道人気No.1",
    popular: true,
    flavorNotes: ["モッツァレラ100%", "きび砂糖まぶし", "揚げたてサクサク"]
  },
  {
    id: "honey-cheddar",
    name: "ハニーバター＆濃厚チェダー",
    japaneseTitle: "甘じょっぱの極み",
    description: "コク深いチェダーチーズに自家製ハニーバターパウダーをたっぷり。背徳感MAXのやみつきスナック。",
    price: 350,
    cheeseStretchCm: 35,
    tag: "女子人気No.1",
    popular: true,
    flavorNotes: ["濃厚レッドチェダー", "北海道バター", "アカシア蜂蜜パウダー"]
  },
  {
    id: "spicy-yangnyeom",
    name: "旨辛ヤンニョム・ダブルチーズ",
    japaneseTitle: "韓国屋台風ホット",
    description: "特製コチュジャン甘辛ソースを絡め、チェダーとモッツァレラのWチーズが溢れ出す男子熱烈支持の一品！",
    price: 380,
    cheeseStretchCm: 45,
    tag: "男子人気No.1",
    flavorNotes: ["特製ヤンニョムソース", "Wチーズブレンド", "ピリ辛仕上げ"],
    spiceLevel: 2
  },
  {
    id: "sweet-choco-cream",
    name: "とろけるチョコ＆クリームチーズ",
    japaneseTitle: "魅惑のスイーツ系",
    description: "ビターチョコガナッシュと爽やかなクリームチーズのマリアージュ。スノーシュガーの優しい甘み。",
    price: 350,
    cheeseStretchCm: 25,
    tag: "映えスイーツ",
    flavorNotes: ["濃厚ベルギーチョコ", "クリームチーズ", "粉糖まぶし"]
  },
  {
    id: "festival-combo-box",
    name: "3年B組 団結アソートBOX (8個入)",
    japaneseTitle: "シェア用特大BOX",
    description: "全フレーバーが2個ずつ入ったクラス特別ボックス！友達や家族と食べ比べ＆写真映え間違いなし！",
    price: 600,
    cheeseStretchCm: 55,
    tag: "お得セット",
    popular: true,
    flavorNotes: ["4種×2個 (合計8個)", "専用ギフトBOX", "おまけステッカー付"]
  }
];

export const INITIAL_CHALK_NOTES = [
  {
    id: "note-1",
    author: "調理長 ケンタ",
    classOrRole: "3年B組 調理班",
    text: "油温175度キープ！最高のサクサク感をみんなに届けるぞ🔥",
    color: "yellow" as const,
    x: 15,
    y: 20,
    stamp: "👨‍🍳",
    createdAt: "10:15"
  },
  {
    id: "note-2",
    author: "サクラ & ユイ",
    classOrRole: "3年B組 看板隊",
    text: "黒板アート完成！チーズボール食べてハイタッチしようね✨",
    color: "pink" as const,
    x: 65,
    y: 18,
    stamp: "🧀",
    createdAt: "10:22"
  },
  {
    id: "note-3",
    author: "担任 田中先生",
    classOrRole: "顧問",
    text: "味見がかりで3個食べました。本当に美味しくて感動！完売目指せ！",
    color: "white" as const,
    x: 40,
    y: 55,
    stamp: "💮",
    createdAt: "11:05"
  },
  {
    id: "note-4",
    author: "軽音部 ミナト",
    classOrRole: "2年C組",
    text: "ライブ前に食べたらパワー出た！ハニーバター最高すぎる！",
    color: "cyan" as const,
    x: 20,
    y: 75,
    stamp: "🎸",
    createdAt: "11:40"
  },
  {
    id: "note-5",
    author: "通りすがりの先輩",
    classOrRole: "卒業生",
    text: "B組の熱気すごい！高校生活最高の思い出にしてね👍",
    color: "orange" as const,
    x: 70,
    y: 70,
    stamp: "⭐",
    createdAt: "12:15"
  }
];

export const FESTIVAL_SCHEDULE = [
  { time: "09:00", title: "開会式＆カウントダウン", place: "体育館メインアリーナ", desc: "校長挨拶＆全クラスPRタイム" },
  { time: "09:30", title: "3-B チーズボール屋台 OPEN！", place: "南校舎3F 3年B組教室", desc: "揚げたて第1陣フライ開始！行列スタート！", highlight: true },
  { time: "11:30", title: "クラス有志 ダンス＆アコースティック", place: "中庭 特設センターステージ", desc: "手拍子とチーズボール片手に集合！" },
  { time: "13:00", title: "第1回『チーズ伸び〜る選手権』", place: "3年B組 前廊下特設ブース", desc: "誰が一番チーズを伸ばせるか生中継対決！", highlight: true },
  { time: "14:30", title: "軽音部フェスLIVE 2026", place: "体育館 特設音響ステージ", desc: "テーマ曲『チーズボール』熱狂カバー演奏！", highlight: true },
  { time: "15:45", title: "文化祭の鐘が鳴るフィナーレ", place: "全校放送＆教室", desc: "完売御礼＆全クラスハイタッチ" },
  { time: "16:30", title: "後夜祭 キャンプファイヤー", place: "グラウンド中央", desc: "フォークダンス＆メモリアル花火" }
];
