import React, { useState, useEffect, useRef } from 'react';
import { Flame, Sparkles, Trophy, RotateCcw, Play, CheckCircle, AlertCircle, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioService } from '../services/audioService';

interface OrderItem {
  id: string;
  customer: string;
  role: string;
  flavor: 'モッツァレラ' | 'ハニーバター' | 'ヤンニョム' | 'チョコ';
  timeLimit: number; // in seconds
}

interface FryerSlot {
  id: number;
  status: 'empty' | 'frying' | 'golden' | 'burnt';
  fryTime: number; // in seconds
  doughReady: boolean;
}

export const CheeseBallGame: React.FC = () => {
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE');
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [lives, setLives] = useState<number>(3);
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('cheeseball_high_score');
    return saved ? parseInt(saved, 10) : 1200;
  });

  // Current customer orders (up to 2 at a time)
  const [currentOrders, setCurrentOrders] = useState<OrderItem[]>([]);
  
  // Fryer slots (4 fryers)
  const [fryers, setFryers] = useState<FryerSlot[]>([
    { id: 0, status: 'empty', fryTime: 0, doughReady: false },
    { id: 1, status: 'empty', fryTime: 0, doughReady: false },
    { id: 2, status: 'empty', fryTime: 0, doughReady: false },
    { id: 3, status: 'empty', fryTime: 0, doughReady: false }
  ]);

  // Selected flavor powder for coating
  const [selectedFlavor, setSelectedFlavor] = useState<'モッツァレラ' | 'ハニーバター' | 'ヤンニョム' | 'チョコ'>('モッツァレラ');
  const [flavorFeedback, setFlavorFeedback] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);

  // Start game
  const startGame = () => {
    setGameState('PLAYING');
    setScore(0);
    setCombo(0);
    setTimeLeft(45);
    setLives(3);
    setFryers([
      { id: 0, status: 'empty', fryTime: 0, doughReady: false },
      { id: 1, status: 'empty', fryTime: 0, doughReady: false },
      { id: 2, status: 'empty', fryTime: 0, doughReady: false },
      { id: 3, status: 'empty', fryTime: 0, doughReady: false }
    ]);
    generateNewOrder();
    generateNewOrder();
    audioService.playBell();
  };

  const generateNewOrder = () => {
    const flavors: Array<'モッツァレラ' | 'ハニーバター' | 'ヤンニョム' | 'チョコ'> = [
      'モッツァレラ', 'ハニーバター', 'ヤンニョム', 'チョコ'
    ];
    const customers = [
      { name: 'ユウタ', role: '隣のクラスの友達' },
      { name: 'アスカ', role: 'ダンス部員' },
      { name: '先生', role: '学年主任' },
      { name: 'レン', role: 'サッカー部員' },
      { name: 'メイ', role: '吹奏楽部員' }
    ];
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const chosenFlavor = flavors[Math.floor(Math.random() * flavors.length)];

    const newOrder: OrderItem = {
      id: Math.random().toString(),
      customer: customer.name,
      role: customer.role,
      flavor: chosenFlavor,
      timeLimit: 14
    };

    setCurrentOrders(prev => {
      if (prev.length >= 3) return prev;
      return [...prev, newOrder];
    });
  };

  // Main game tick (every 200ms)
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });

      // Update fryer state
      setFryers(prevFryers => 
        prevFryers.map(f => {
          if (f.status === 'empty') return f;
          const nextTime = f.fryTime + 1;
          let nextStatus = f.status;
          if (nextTime >= 2 && nextTime <= 5) {
            nextStatus = 'golden';
          } else if (nextTime > 5) {
            nextStatus = 'burnt';
          }
          return { ...f, fryTime: nextTime, status: nextStatus };
        })
      );

      // Decrement order limits
      setCurrentOrders(prev => {
        const updated = prev.map(o => ({ ...o, timeLimit: o.timeLimit - 1 }));
        const expired = updated.filter(o => o.timeLimit <= 0);
        if (expired.length > 0) {
          audioService.playBoing();
          setCombo(0);
          setLives(l => {
            if (l <= 1) {
              endGame();
              return 0;
            }
            return l - 1;
          });
        }
        return updated.filter(o => o.timeLimit > 0);
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Refill orders periodically
  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const interval = setInterval(() => {
      if (currentOrders.length < 3) {
        generateNewOrder();
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [gameState, currentOrders.length]);

  const endGame = () => {
    setGameState('GAMEOVER');
    if (timerRef.current) clearInterval(timerRef.current);
    audioService.playBell();
    setHighScore(prev => {
      const best = Math.max(prev, score);
      localStorage.setItem('cheeseball_high_score', best.toString());
      return best;
    });
    if (score > highScore) {
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    }
  };

  // 1. Roll dough into a fryer
  const handleRollDough = (slotId: number) => {
    if (gameState !== 'PLAYING') return;
    const slot = fryers[slotId];
    if (slot.status !== 'empty') return;

    audioService.playSizzle();
    setFryers(prev => prev.map(f => f.id === slotId ? {
      ...f,
      status: 'frying',
      fryTime: 0,
      doughReady: true
    } : f));
  };

  // 2. Serve from fryer
  const handleServeBall = (slotId: number) => {
    if (gameState !== 'PLAYING') return;
    const slot = fryers[slotId];
    if (slot.status === 'empty') return;

    // Reset this fryer
    setFryers(prev => prev.map(f => f.id === slotId ? {
      ...f,
      status: 'empty',
      fryTime: 0,
      doughReady: false
    } : f));

    // Handle burnt ball
    if (slot.status === 'burnt') {
      audioService.playBoing();
      setFlavorFeedback('ちょっと焦げた！味見がかりへ！（+20点）');
      setScore(s => s + 20);
      setCombo(0);
      setTimeout(() => setFlavorFeedback(null), 1500);
      return;
    }

    // Must be golden
    if (slot.status === 'golden') {
      // Check if there is an order matching selectedFlavor
      const matchIndex = currentOrders.findIndex(o => o.flavor === selectedFlavor);
      if (matchIndex !== -1) {
        // Successful order!
        const matched = currentOrders[matchIndex];
        audioService.playHighFive();
        const basePts = 200;
        const comboBonus = combo * 40;
        const totalAdd = basePts + comboBonus;
        setScore(s => s + totalAdd);
        setCombo(c => c + 1);
        setFlavorFeedback(`「はい、どうぞ！」${matched.customer}に提供！(+${totalAdd}点)`);
        
        // Remove order and spawn new one
        setCurrentOrders(prev => prev.filter((_, idx) => idx !== matchIndex));
        setTimeout(() => setFlavorFeedback(null), 1500);
      } else {
        // Wrong flavor for current queue
        setScore(s => Math.max(0, s + 50));
        setFlavorFeedback(`列に${selectedFlavor}の注文がないけど配った！(+50点)`);
        setTimeout(() => setFlavorFeedback(null), 1500);
      }
    } else {
      // Too raw
      setFlavorFeedback('まだ生揚がり！もう少し揚げよう！');
      setTimeout(() => setFlavorFeedback(null), 1200);
    }
  };

  return (
    <section id="game-section" className="py-14 bg-[#0a0e14] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>3-B ミニゲームアリーナ</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white font-rounded mb-3">
            爆速！チーズボール屋シミュレーター
          </h2>
          <p className="text-sm md:text-base text-slate-400">
            丸めて、揚げて、味付けして「はい、どうぞ！」トングを渡して列のお客さんに笑顔でハイタッチしよう！
          </p>
        </div>

        {/* Game Arena Container */}
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          {/* Top HUD Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 mb-6 font-mono">
            {/* Score */}
            <div>
              <div className="text-[11px] text-slate-400 font-sans">スコア</div>
              <div className="text-2xl font-black text-amber-400 tabular-nums">{score.toLocaleString()}</div>
            </div>

            {/* Combo */}
            <div>
              <div className="text-[11px] text-slate-400 font-sans">コンボ</div>
              <div className="text-xl font-bold text-yellow-300 tabular-nums">
                {combo > 1 ? `${combo}x 連鎖🔥` : '-'}
              </div>
            </div>

            {/* Time Left */}
            <div>
              <div className="text-[11px] text-slate-400 font-sans">残り時間</div>
              <div className={`text-2xl font-black tabular-nums ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
                {timeLeft}s
              </div>
            </div>

            {/* Lives */}
            <div>
              <div className="text-[11px] text-slate-400 font-sans">行列の我慢値</div>
              <div className="flex items-center gap-1 text-rose-400 text-lg">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-5 h-5 ${i < lives ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}`}
                  />
                ))}
              </div>
            </div>

            {/* High Score */}
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-sans flex items-center gap-1 justify-end">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>歴代最高記録</span>
              </div>
              <div className="text-base font-bold text-slate-300 tabular-nums">{highScore.toLocaleString()}</div>
            </div>
          </div>

          {/* Active Overlay for IDLE or GAMEOVER */}
          {gameState === 'IDLE' && (
            <div className="text-center py-12 space-y-5">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center text-4xl shadow-inner">
                🧀
              </div>
              <div>
                <h3 className="text-2xl font-black text-white font-rounded mb-2">
                  教室の屋台を最高に盛り上げよう！
                </h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  ① 空きフライヤーをタップして生地を投入<br />
                  ② 黄金色になった瞬間にタップして引き上げ<br />
                  ③ 下部の味（モッツァレラ/ハニー/ヤンニョム/チョコ）を選んで「はい、どうぞ！」
                </p>
              </div>
              <button
                onClick={startGame}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:brightness-110 active:scale-95 text-slate-950 font-black rounded-xl text-lg shadow-lg shadow-amber-500/30 transition-all inline-flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>屋台シミュレーター 開始！</span>
              </button>
            </div>
          )}

          {gameState === 'GAMEOVER' && (
            <div className="text-center py-12 space-y-5">
              <div className="text-5xl mb-2">🎉</div>
              <h3 className="text-2xl md:text-3xl font-black text-white font-rounded">
                営業終了！文化祭の鐘が鳴りました！
              </h3>
              <p className="text-base text-amber-300 font-bold">
                あなたの獲得スコア: <span className="font-mono text-3xl text-white underline decoration-amber-400">{score} 点</span>
              </p>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                「君と作った今日の味は 忘れられないよ 文化祭！」クラス全員から大きな拍手！
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:brightness-110 active:scale-95 text-slate-950 font-black rounded-xl text-base shadow-lg transition-all inline-flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>もう一度チャレンジ！</span>
              </button>
            </div>
          )}

          {/* ACTIVE PLAYING VIEW */}
          {gameState === 'PLAYING' && (
            <div className="space-y-6">
              {/* Feedback Banner */}
              {flavorFeedback && (
                <div className="bg-amber-400/20 border border-amber-400/50 text-amber-300 px-4 py-2 rounded-xl text-center text-sm font-bold animate-pulse">
                  {flavorFeedback}
                </div>
              )}

              {/* Customer Queue Orders */}
              <div>
                <div className="text-xs font-bold text-slate-400 mb-2 flex items-center justify-between">
                  <span>待っているお客さんの注文リスト</span>
                  <span className="text-[11px] text-amber-400">トングで袋詰めして渡そう！</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {currentOrders.map(order => (
                    <div
                      key={order.id}
                      className="bg-slate-950/70 border border-amber-500/30 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{order.customer}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          {order.role}
                        </span>
                      </div>
                      <div className="text-sm font-extrabold text-amber-400 font-rounded my-1">
                        🧀 {order.flavor}
                      </div>
                      {/* Order patience meter */}
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-amber-400 h-full transition-all duration-300"
                          style={{ width: `${(order.timeLimit / 14) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {currentOrders.length === 0 && (
                    <div className="col-span-3 text-center py-4 text-xs text-slate-500">
                      次のお客さんが廊下から手を振っています...
                    </div>
                  )}
                </div>
              </div>

              {/* 4 Deep Fryer Stations */}
              <div>
                <div className="text-xs font-bold text-slate-400 mb-2 flex items-center justify-between">
                  <span>黄金フライヤー (175℃)</span>
                  <span className="text-[11px] text-slate-400">空きスロットタップで投入 · 黄金色で引き上げ</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {fryers.map(f => {
                    let bg = 'bg-slate-950/60 border-slate-800 hover:border-slate-700';
                    let label = '空き（タップで投入）';
                    let icon = '⚪';

                    if (f.status === 'frying') {
                      bg = 'bg-amber-950/40 border-amber-600/50 animate-pulse';
                      label = '揚げ中... (ジュワ〜)';
                      icon = '🟡';
                    } else if (f.status === 'golden') {
                      bg = 'bg-yellow-500/20 border-yellow-400 shadow-lg shadow-yellow-500/20 scale-[1.02]';
                      label = '✨ 黄金揚げたて！タップ！';
                      icon = '🌟';
                    } else if (f.status === 'burnt') {
                      bg = 'bg-red-950/50 border-red-500/60';
                      label = '焦げた！味見がかりへ';
                      icon = '🍘';
                    }

                    return (
                      <button
                        key={f.id}
                        onClick={() => {
                          if (f.status === 'empty') handleRollDough(f.id);
                          else handleServeBall(f.id);
                        }}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center min-h-[120px] text-center cursor-pointer ${bg}`}
                      >
                        <div className="text-3xl mb-1">{icon}</div>
                        <div className="text-xs font-extrabold text-white font-rounded">{label}</div>
                        {f.status !== 'empty' && (
                          <div className="text-[10px] text-slate-400 font-mono mt-1">
                            {f.fryTime} 秒経過
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Flavor Coating & Serving Station */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                  <span>味付けパウダー選択（引き上げ時に自動適用）</span>
                  <span className="text-[11px] text-amber-400 font-bold">現在: {selectedFlavor}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(['モッツァレラ', 'ハニーバター', 'ヤンニョム', 'チョコ'] as const).map(flavor => (
                    <button
                      key={flavor}
                      onClick={() => {
                        setSelectedFlavor(flavor);
                        audioService.playDing();
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        selectedFlavor === flavor
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black scale-[1.02]'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {flavor}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
