import React, { useState } from 'react';
import { PenTool, Heart, Sparkles, MessageCircle, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_CHALK_NOTES } from '../data/festivalData';
import { ChalkNote } from '../types/festival';
import { audioService } from '../services/audioService';

export const ChalkboardMemorial: React.FC = () => {
  const [notes, setNotes] = useState<ChalkNote[]>(INITIAL_CHALK_NOTES);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newText, setNewText] = useState('');
  const [newColor, setNewColor] = useState<'yellow' | 'pink' | 'cyan' | 'white' | 'orange'>('yellow');
  const [newStamp, setNewStamp] = useState('🧀');

  const colorClasses = {
    yellow: 'text-amber-300 border-amber-300/40 bg-amber-400/10',
    pink: 'text-pink-300 border-pink-300/40 bg-pink-400/10',
    cyan: 'text-cyan-300 border-cyan-300/40 bg-cyan-400/10',
    white: 'text-white border-white/40 bg-white/10',
    orange: 'text-orange-300 border-orange-300/40 bg-orange-400/10'
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !newAuthor.trim()) return;

    audioService.playDing();
    const newNote: ChalkNote = {
      id: `note-${Date.now()}`,
      author: newAuthor.trim(),
      classOrRole: newRole.trim() || '来場者',
      text: newText.trim(),
      color: newColor,
      x: 20 + Math.random() * 50,
      y: 20 + Math.random() * 50,
      stamp: newStamp,
      createdAt: 'たった今'
    };

    setNotes(prev => [newNote, ...prev]);
    setNewText('');
    setNewAuthor('');
    setNewRole('');

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#fef08a', '#f472b6', '#38bdf8', '#ffffff']
    });
  };

  return (
    <section id="blackboard-section" className="py-14 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wider mb-2">
            <PenTool className="w-3.5 h-3.5" />
            <span>文化祭の思い出メッセージボード</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white font-rounded mb-3">
            黒板に残る丸い絵＆メッセージ
          </h2>
          <p className="text-sm md:text-base text-slate-400">
            「片付けのあと 空っぽの箱 黒板に残る丸い絵 明日になっても話そうよ あの行列とあの笑顔」<br />
            チョークで今日の思い出やクラスへの応援メッセージを自由に刻もう！
          </p>
        </div>

        {/* Visual Classroom Blackboard Photo Frame */}
        <div className="mb-8 rounded-3xl overflow-hidden border-2 border-emerald-800/60 shadow-2xl relative">
          <img
            src="/src/assets/images/festival_campus_blackboard_1792126911202.jpg"
            alt="3年B組の文化祭黒板アートとポラロイド写真"
            referrerPolicy="no-referrer"
            className="w-full h-[240px] md:h-[340px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-2 text-white">
            <div>
              <div className="text-xs text-amber-300 font-bold">南校舎3F 3年B組 教室正面黒板</div>
              <div className="text-base md:text-xl font-bold font-rounded">
                「みんなで作った今日の味は 忘れられないよ 文化祭！」
              </div>
            </div>
            <div className="text-xs text-slate-300 font-mono">
              寄書き総数: <span className="text-amber-400 font-bold text-base">{notes.length}</span> 件
            </div>
          </div>
        </div>

        {/* Chalkboard Display Area */}
        <div className="chalk-board rounded-3xl p-6 md:p-8 border-8 border-amber-950 shadow-2xl min-h-[420px] mb-8 relative">
          <div className="text-center pb-4 mb-6 border-b border-emerald-600/30">
            <span className="font-brush text-2xl md:text-3xl text-amber-200 tracking-widest chalk-text">
              ✨ 3年B組 チーズボール屋 感謝＆思い出黒板 ✨
            </span>
          </div>

          {/* Chalk Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map(note => (
              <div
                key={note.id}
                className={`p-4 rounded-xl border-2 backdrop-blur-sm transition-all hover:scale-[1.02] ${colorClasses[note.color]}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{note.stamp}</span>
                    <span className="text-xs font-bold font-rounded">{note.author}</span>
                  </div>
                  <span className="text-[10px] opacity-75 font-mono">{note.classOrRole}</span>
                </div>
                <p className="text-sm font-brush font-bold chalk-text leading-relaxed">
                  {note.text}
                </p>
                <div className="text-right text-[10px] opacity-60 font-mono mt-2">
                  {note.createdAt}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Form to Write Chalk Message */}
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
          <h3 className="text-lg font-bold text-white font-rounded mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-amber-400" />
            <span>黒板にメッセージを書く</span>
          </h3>

          <form onSubmit={handleAddNote} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">お名前</label>
                <input
                  type="text"
                  required
                  value={newAuthor}
                  onChange={e => setNewAuthor(e.target.value)}
                  placeholder="例: たくみ、吹奏楽部の先輩"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">クラス / 所属</label>
                <input
                  type="text"
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  placeholder="例: 1年A組、卒業生、保護者"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">メッセージ内容</label>
              <textarea
                required
                rows={2}
                value={newText}
                onChange={e => setNewText(e.target.value)}
                placeholder="例: チーズの伸びがすごくて美味しかった！後夜祭まで頑張ってね！"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              {/* Color picker */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">チョーク色:</span>
                {(['yellow', 'pink', 'cyan', 'white', 'orange'] as const).map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewColor(color)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      color === 'yellow' ? 'bg-amber-300' :
                      color === 'pink' ? 'bg-pink-400' :
                      color === 'cyan' ? 'bg-cyan-400' :
                      color === 'white' ? 'bg-white' : 'bg-orange-400'
                    } ${newColor === color ? 'scale-125 border-white' : 'border-transparent'}`}
                  />
                ))}
              </div>

              {/* Stamp picker */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400">スタンプ:</span>
                {['🧀', '✨', '✋', '🔥', '🎸', '💮'].map(stamp => (
                  <button
                    key={stamp}
                    type="button"
                    onClick={() => setNewStamp(stamp)}
                    className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                      newStamp === stamp ? 'bg-amber-400/30 scale-110' : 'hover:bg-slate-800'
                    }`}
                  >
                    {stamp}
                  </button>
                ))}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-md ml-auto"
              >
                <Send className="w-3.5 h-3.5" />
                <span>黒板に書き込む</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
