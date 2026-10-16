import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ThemeSongPlayer } from './components/ThemeSongPlayer';
import { CheeseBallGame } from './components/CheeseBallGame';
import { FestivalKiosk } from './components/FestivalKiosk';
import { CampusGuide } from './components/CampusGuide';
import { ChalkboardMemorial } from './components/ChalkboardMemorial';
import { Footer } from './components/Footer';
import { CartItem, MenuItem } from './types/festival';
import { audioService } from './services/audioService';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [highFiveCount, setHighFiveCount] = useState<number>(() => {
    const saved = localStorage.getItem('festival_highfive_count');
    return saved ? parseInt(saved, 10) : 3240;
  });

  const handleAddToCart = (item: MenuItem, flavorOption: string, sauceOption: string) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(
        c => c.item.id === item.id && c.flavorOption === flavorOption && c.sauceOption === sauceOption
      );
      if (existingIdx !== -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += 1;
        return copy;
      }
      return [...prev, { item, quantity: 1, flavorOption, sauceOption }];
    });
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const copy = [...prev];
      const newQty = copy[index].quantity + delta;
      if (newQty <= 0) {
        return copy.filter((_, idx) => idx !== index);
      }
      copy[index].quantity = newQty;
      return copy;
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleHighFive = () => {
    audioService.playHighFive();
    setHighFiveCount(prev => {
      const next = prev + 1;
      localStorage.setItem('festival_highfive_count', next.toString());
      return next;
    });
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#f59e0b', '#fbbf24', '#ffffff']
    });
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    let targetEl: HTMLElement | null = null;
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    } else if (sectionId === 'song') {
      targetEl = document.getElementById('song-section');
    } else if (sectionId === 'game') {
      targetEl = document.getElementById('game-section');
    } else if (sectionId === 'menu') {
      targetEl = document.getElementById('menu-section');
    } else if (sectionId === 'campus') {
      targetEl = document.getElementById('campus-section');
    } else if (sectionId === 'blackboard') {
      targetEl = document.getElementById('blackboard-section');
    }

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        onNavigate={scrollToSection}
        activeSection={activeSection}
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onPlaySong={() => scrollToSection('song')}
          onPlayGame={() => scrollToSection('game')}
          onExploreMenu={() => scrollToSection('menu')}
          highFiveCount={highFiveCount}
          onHighFive={handleHighFive}
        />

        {/* Theme Song Player with Lyrics & Visualizer */}
        <ThemeSongPlayer onHighFive={handleHighFive} />

        {/* Arcade Minigame: Super Speed Cheese Ball Kitchen */}
        <CheeseBallGame />

        {/* Live Stall Menu, Cart, and Digital Queue Ticket Kiosk */}
        <FestivalKiosk
          cart={cart}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          onClearCart={handleClearCart}
        />

        {/* Campus Map & Festival Stage Schedule */}
        <CampusGuide />

        {/* Blackboard Message Board & Souvenir Photo Wall */}
        <ChalkboardMemorial />
      </main>

      {/* Footer */}
      <Footer onScrollTop={() => scrollToSection('hero')} />
    </div>
  );
}
