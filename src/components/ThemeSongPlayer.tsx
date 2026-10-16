import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Music, Upload } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FESTIVAL_LYRICS } from '../data/festivalData';
import { audioService } from '../services/audioService';

interface ThemeSongPlayerProps {
  onHighFive: () => void;
}

export const ThemeSongPlayer: React.FC<ThemeSongPlayerProps> = ({ onHighFive }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeLyricIndex, setActiveLyricIndex] = useState<number>(0);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const customAudioRef = useRef<HTMLAudioElement | null>(null);
  const totalDuration = 185; // 3 min 05 sec

  // Toggle playback
  const togglePlay = () => {
    if (customAudioUrl && customAudioRef.current) {
      if (isPlaying) {
        customAudioRef.current.pause();
        setIsPlaying(false);
      } else {
        customAudioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    if (isPlaying) {
      audioService.stopBgm();
      setIsPlaying(false);
    } else {
      audioService.startBgm((time) => {
        setCurrentTime(time);
      });
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    if (customAudioRef.current) {
      customAudioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        customAudioRef.current.pause();
      }
      return;
    }
    audioService.stopBgm();
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Find current active lyric
  useEffect(() => {
    let activeIdx = 0;
    for (let i = 0; i < FESTIVAL_LYRICS.length; i++) {
      if (currentTime >= FESTIVAL_LYRICS[i].timeSec) {
        activeIdx = i;
      }
    }
    setActiveLyricIndex(activeIdx);

    // Auto scroll lyrics into view smoothly
    if (lyricsContainerRef.current) {
      const activeEl = lyricsContainerRef.current.querySelector(`[data-index="${activeIdx}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentTime]);

  // Audio Visualizer loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderVisualizer = () => {
      animId = requestAnimationFrame(renderVisualizer);
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const barCount = 36;
      const barWidth = width / barCount - 2;

      let freqData: Uint8Array | null = null;
      if (audioService.analyser && isPlaying) {
        const binCount = audioService.analyser.frequencyBinCount;
        freqData = new Uint8Array(new ArrayBuffer(binCount));
        (audioService.analyser as unknown as { getByteFrequencyData: (arr: Uint8Array) => void }).getByteFrequencyData(freqData);
      }

      for (let i = 0; i < barCount; i++) {
        let value = 15;
        if (isPlaying) {
          if (freqData && freqData.length > 0) {
            const dataIdx = Math.floor((i / barCount) * freqData.length * 0.7);
            value = Math.max(15, (freqData[dataIdx] / 255) * height);
          } else {
            // Simulated bounce
            value = 15 + Math.sin(Date.now() / 150 + i * 0.4) * 25 + Math.random() * 20;
          }
        }

        const x = i * (barWidth + 2);
        const y = height - value;

        // Gradient from yellow/amber to deep orange
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, '#f59e0b');
        gradient.addColorStop(0.6, '#fbbf24');
        gradient.addColorStop(1, '#ef4444');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, value, [4, 4, 0, 0]);
        ctx.fill();
      }
    };

    renderVisualizer();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  // Handle custom audio file upload if user wants to play their exact file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isPlaying) {
        audioService.stopBgm();
      }
      const url = URL.createObjectURL(file);
      setCustomAudioUrl(url);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (customAudioRef.current) {
      setCurrentTime(customAudioRef.current.currentTime);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section id="song-section" className="py-14 bg-slate-950/60 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wider mb-2">
            <Music className="w-3.5 h-3.5" />
            <span>3年B組 公式テーマソング</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white font-rounded mb-3">
            『チーズボール』〜文化祭アンセム〜
          </h2>
          <p className="text-sm md:text-base text-slate-400">
            青春の熱気と揚げたてチーズの香りを閉じ込めたオリジナルソング！歌詞シンク＆歓声ボタンで一緒に盛り上がろう！
          </p>
        </div>

        {/* Player Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Player Controls & Visualizer */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            {/* Visualizer Canvas */}
            <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>LIVE FREQUENCY</span>
                </span>
                <span className="tabular-nums font-bold">132 BPM · POP/ROCK</span>
              </div>
              <canvas
                ref={canvasRef}
                width={360}
                height={90}
                className="w-full h-[90px] block"
              />
            </div>

            {/* Time progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-400 tabular-nums">
                <span className="text-amber-400 font-bold">{formatTime(currentTime)}</span>
                <span>{formatTime(totalDuration)}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden relative">
                <div
                  className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-200"
                  style={{ width: `${Math.min(100, (currentTime / totalDuration) * 100)}%` }}
                />
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleReset}
                className="p-3 text-slate-400 hover:text-white bg-slate-800/70 hover:bg-slate-800 rounded-xl transition-all"
                title="最初に戻る"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={togglePlay}
                className="px-8 py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:brightness-110 active:scale-95 text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-500/25 flex items-center gap-2.5 text-base transition-all"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5 fill-slate-950" />
                    <span>一時停止</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-slate-950" />
                    <span>テーマ曲を再生！</span>
                  </>
                )}
              </button>
            </div>

            {/* Shout / Cheer Soundboard */}
            <div className="pt-2 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-400 mb-3 flex items-center justify-between">
                <span>クラス応援サウンドボード</span>
                <span className="text-[11px] text-amber-400">タップで歓声！</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    audioService.playHighFive();
                    onHighFive();
                  }}
                  className="p-2.5 bg-slate-800/80 hover:bg-amber-500/20 hover:border-amber-400/50 border border-slate-700/60 rounded-xl text-xs font-bold text-slate-200 hover:text-amber-300 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>✋</span>
                  <span>ハイタッチ！</span>
                </button>

                <button
                  onClick={() => audioService.playBoing()}
                  className="p-2.5 bg-slate-800/80 hover:bg-amber-500/20 hover:border-amber-400/50 border border-slate-700/60 rounded-xl text-xs font-bold text-slate-200 hover:text-amber-300 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>🧀</span>
                  <span>チーズ伸び〜る</span>
                </button>

                <button
                  onClick={() => audioService.playSizzle()}
                  className="p-2.5 bg-slate-800/80 hover:bg-amber-500/20 hover:border-amber-400/50 border border-slate-700/60 rounded-xl text-xs font-bold text-slate-200 hover:text-amber-300 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>🔥</span>
                  <span>ジュワ〜ッ (揚げる)</span>
                </button>

                <button
                  onClick={() => audioService.playBell()}
                  className="p-2.5 bg-slate-800/80 hover:bg-amber-500/20 hover:border-amber-400/50 border border-slate-700/60 rounded-xl text-xs font-bold text-slate-200 hover:text-amber-300 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>🔔</span>
                  <span>文化祭の鐘</span>
                </button>
              </div>
            </div>

            {/* Custom Audio File Optional Upload */}
            <div className="pt-2 text-center">
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>お手元の音声ファイルを直接再生する</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Hidden Native Audio Element if custom file selected */}
            {customAudioUrl && (
              <audio
                ref={customAudioRef}
                src={customAudioUrl}
                onTimeUpdate={handleAudioTimeUpdate}
                onEnded={() => setIsPlaying(false)}
              />
            )}
          </div>

          {/* Right: Synchronized Lyrics Display */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white font-rounded">リアルタイム同期・歌詞カード</span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {FESTIVAL_LYRICS[activeLyricIndex]?.section || 'VERSE'}
              </div>
            </div>

            {/* Scrollable lyrics list */}
            <div
              ref={lyricsContainerRef}
              className="h-[360px] overflow-y-auto space-y-4 pr-3 scrollbar-thin scrollbar-thumb-slate-700"
            >
              {FESTIVAL_LYRICS.map((line, idx) => {
                const isActive = idx === activeLyricIndex;
                const isPast = idx < activeLyricIndex;

                return (
                  <div
                    key={line.id}
                    data-index={idx}
                    onClick={() => {
                      setCurrentTime(line.timeSec);
                      if (customAudioRef.current) {
                        customAudioRef.current.currentTime = line.timeSec;
                      }
                    }}
                    className={`p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-amber-500/20 border-l-4 border-amber-400 pl-4 scale-[1.01]'
                        : isPast
                        ? 'text-slate-400 hover:text-slate-200'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                        {formatTime(line.timeSec)}
                      </span>
                      {line.section && (
                        <span className="text-[10px] text-amber-400/80 font-mono uppercase">
                          {line.section}
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-base md:text-lg font-bold font-rounded leading-snug ${
                        isActive
                          ? 'text-amber-300 chalk-text'
                          : isPast
                          ? 'text-slate-200'
                          : 'text-slate-400'
                      }`}
                    >
                      {line.text}
                    </div>
                    {line.subtext && (
                      <div
                        className={`text-xs md:text-sm mt-0.5 ${
                          isActive ? 'text-white font-medium' : 'text-slate-400'
                        }`}
                      >
                        {line.subtext}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
