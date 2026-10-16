import React, { useState } from 'react';
import { Play, Flame, Bell, Sparkles, ChefHat, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioService } from '../services/audioService';

interface HeroSectionProps {
  onPlaySong: () => void;
  onPlayGame: () => void;
  onExploreMenu: () => void;
  highFiveCount: number;
  onHighFive: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onPlaySong,
  onPlayGame,
  onExploreMenu,
  highFiveCount,
  onHighFive,
}) => {
  const [bellRung, setBellRung] = useState(false);

  const handleRingBell = () => {
    setBellRung(true);
    audioService.playBell();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#fde047', '#ffffff']
    });
    setTimeout(() => setBellRung(false), 2000);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b border-slate-800">
      {/* Background ambient decorative festival glow */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Editorial Top Kicker */}
        <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm font-semibold text-amber-400 mb-4 tracking-wider">
          <span>桜ヶ丘高校秋桜祭 2026</span>
          <span aria-hidden="true" className="text-slate-600">/</span>
          <span>南校舎3F 3年B組</span>
          <span aria-hidden="true" className="text-slate-600">/</span>
          <span className="text-slate-300">熱血出展プロジェクト</span>
        </div>

        {/* Hero Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white font-rounded leading-[1.15] text-balance">
              今日だけのこの教室が、<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400">
                街で一番熱い場所。
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              朝の教室、粉まみれの手で丸めた生地に笑い声が弾ける！<br className="hidden md:inline" />
              看板の文字をちょっと曲げて、大きく書いた<strong className="text-amber-300 font-bold">「チーズボール」</strong>。<br className="hidden md:inline" />
              文化祭の鐘が鳴るまで、この仲間たちと全力で駆け抜けよう！
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onPlaySong}
                className="px-6 py-3.5 text-sm md:text-base font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2.5 whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>テーマ曲を再生 (歌詞シンク)</span>
              </button>

              <button
                onClick={onPlayGame}
                className="px-5 py-3.5 text-sm md:text-base font-bold text-white bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 rounded-xl active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <ChefHat className="w-4 h-4 text-amber-400" />
                <span>爆速調理ゲームで遊ぶ</span>
              </button>

              <button
                onClick={handleRingBell}
                className={`px-4 py-3.5 text-xs md:text-sm font-semibold rounded-xl border transition-all flex items-center gap-2 whitespace-nowrap ${
                  bellRung 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400' 
                    : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <Bell className={`w-4 h-4 ${bellRung ? 'animate-bounce text-amber-300' : 'text-slate-400'}`} />
                <span>文化祭の鐘を鳴らす</span>
              </button>
            </div>

            {/* High-touch interactive banner */}
            <div className="pt-2 flex items-center gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 max-w-xl">
              <button
                onClick={onHighFive}
                className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-2xl shadow-md hover:scale-105 active:scale-90 transition-transform cursor-pointer shrink-0"
                title="ハイタッチする！"
              >
                ✋
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-amber-400 font-semibold tracking-wide">
                  「美味しい？」聞いて ハイタッチ！
                </div>
                <div className="text-sm font-bold text-white truncate">
                  みんなのハイタッチ総数: <span className="text-amber-300 font-mono text-base tabular-nums">{highFiveCount.toLocaleString()}</span> 回
                </div>
              </div>
              <button
                onClick={onExploreMenu}
                className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors whitespace-nowrap"
              >
                <span>メニューを見る</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Showcase Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-slate-900 group">
              <img
                src="/src/assets/images/festival_hero_stall_1792126910708.jpg"
                alt="3年B組の文化祭チーズボール屋台と笑顔の生徒たち"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

              {/* In-Frame Stamp */}
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-400/40 text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>南校舎3F 3年B組 教室特設ブース</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-xs font-medium text-amber-300 mb-0.5">揚げたて即提供システム稼働中</div>
                <div className="text-sm font-bold font-rounded">「トングを渡して 袋を結ぶ、このクラスで駆け抜けよう！」</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Live Status Strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-slate-900/80 rounded-2xl border border-slate-800">
          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-medium">累計提供数</div>
            <div className="text-2xl md:text-3xl font-extrabold text-white font-mono tabular-nums">1,480 <span className="text-xs text-amber-400 font-sans">個突破</span></div>
            <div className="text-[11px] text-slate-500">完売目標 1,800個まであと少し</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-medium">最長チーズ伸び記録</div>
            <div className="text-2xl md:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">68.4 <span className="text-xs text-slate-300 font-sans">cm</span></div>
            <div className="text-[11px] text-slate-500">保持者: 2年B組 バレー部員</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-medium">現在のフライヤー油温</div>
            <div className="text-2xl md:text-3xl font-extrabold text-orange-400 font-mono tabular-nums flex items-center gap-1">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
              <span>175.5</span> <span className="text-xs text-slate-300 font-sans">°C</span>
            </div>
            <div className="text-[11px] text-slate-500">外カリッ・中トロ黄金設定</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-medium">待ち時間目安</div>
            <div className="text-2xl md:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">約 4 <span className="text-xs text-slate-300 font-sans">分</span></div>
            <div className="text-[11px] text-slate-500">注文後すぐに熱々をお渡し！</div>
          </div>
        </div>
      </div>
    </section>
  );
};
