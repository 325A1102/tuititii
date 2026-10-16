import React from 'react';
import { Sparkles, UtensilsCrossed } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection, cartCount }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0d1117]/95 backdrop-blur-md border-b border-amber-500/20 px-4 md:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#hero" 
          onClick={(e) => { e.preventDefault(); onNavigate('hero'); }}
          className="text-lg md:text-xl font-extrabold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-900 shadow-md">
            <Sparkles className="w-4 h-4 fill-slate-900" />
          </span>
          <span className="font-rounded">3-B CHEESE BALL FEST</span>
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button 
            onClick={() => onNavigate('song')}
            className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 ${activeSection === 'song' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''}`}
          >
            テーマソング
          </button>
          <button 
            onClick={() => onNavigate('game')}
            className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 ${activeSection === 'game' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''}`}
          >
            調理ゲーム
          </button>
          <button 
            onClick={() => onNavigate('menu')}
            className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 ${activeSection === 'menu' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''}`}
          >
            屋台メニュー
          </button>
          <button 
            onClick={() => onNavigate('campus')}
            className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 ${activeSection === 'campus' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''}`}
          >
            校内マップ
          </button>
          <button 
            onClick={() => onNavigate('blackboard')}
            className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 ${activeSection === 'blackboard' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''}`}
          >
            黒板メッセージ
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onNavigate('menu')}
            className="px-4 py-2 text-xs md:text-sm font-bold text-slate-900 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/20 whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <UtensilsCrossed className="w-4 h-4 text-slate-900" />
            <span>整理券・注文 ({cartCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
