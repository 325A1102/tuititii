import React from 'react';
import { Sparkles, ArrowUp, Heart } from 'lucide-react';

interface FooterProps {
  onScrollTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollTop }) => {
  return (
    <footer className="bg-[#080b0f] border-t border-slate-900 py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-900 shadow-md">
              <Sparkles className="w-4 h-4 fill-slate-900" />
            </span>
            <div>
              <div className="text-base font-extrabold text-white font-rounded tracking-tight">
                3-B CHEESE BALL FESTIVAL 2026
              </div>
              <div className="text-xs text-slate-500">
                桜ヶ丘高校秋桜祭 · 3年B組 出展企画特設サイト
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <a href="#song-section" className="hover:text-amber-400 transition-colors">テーマソング</a>
            <a href="#game-section" className="hover:text-amber-400 transition-colors">調理ゲーム</a>
            <a href="#menu-section" className="hover:text-amber-400 transition-colors">屋台メニュー</a>
            <a href="#blackboard-section" className="hover:text-amber-400 transition-colors">黒板メッセージ</a>
          </div>

          {/* Back to top */}
          <button
            onClick={onScrollTop}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowUp className="w-4 h-4" />
            <span>一番上へ</span>
          </button>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            企画·調理·音楽·黒板アート: 3年B組 36名一同
          </div>
          <div className="flex items-center gap-1">
            <span>「君と作った今日の味は 忘れられないよ 文化祭！」</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
