import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Star, Users, Flame } from 'lucide-react';
import { FESTIVAL_SCHEDULE } from '../data/festivalData';

export const CampusGuide: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('3b');

  const campusSpots = [
    {
      id: '3b',
      floor: '南校舎 3F',
      name: '3年B組 伝説のチーズボール屋',
      type: '模擬店（食品）',
      desc: '「今日だけのこの教室が 街で一番熱い場所！」大行列の揚げたてチーズボール！出来立てサクサクをぜひどうぞ！',
      hottest: true,
      time: '終日開催 (完売次第終了)',
    },
    {
      id: '3a',
      floor: '南校舎 3F',
      name: '3年A組 戦慄の廃校舎迷路',
      type: 'アトラクション',
      desc: '本格的な特殊メイクと暗闇迷路。入ったら最後、叫ばずには出られない恐怖体験。',
      time: '終日開催',
    },
    {
      id: 'gym',
      floor: '屋内アリーナ',
      name: '体育館 メインステージ (軽音部フェス)',
      type: 'ステージ公演',
      desc: '軽音部・吹奏楽部・有志バンドによる白熱の生ライブ！テーマソング演奏あり！',
      time: '14:30〜15:45',
    },
    {
      id: 'courtyard',
      floor: '中庭広場',
      name: '中庭 センターステージ＆青空カフェ',
      type: '屋外イベント',
      desc: 'ダンス部パフォーマンスや大道芸、各クラスの食べ歩き休憩スペース。',
      time: '終日開放',
    },
    {
      id: 'ground',
      floor: 'グラウンド',
      name: '後夜祭 キャンプファイヤー＆花火',
      type: 'フィナーレ行事',
      desc: '全校生徒集合！巨大な炎を囲んでフォークダンスとフィナーレ花火打ち上げ。',
      time: '16:30〜18:00',
    }
  ];

  return (
    <section id="campus-section" className="py-14 bg-[#0c1017] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>秋桜祭 校内マップ＆タイムテーブル</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white font-rounded mb-3">
            校内フロア案内＆ステージ予定表
          </h2>
          <p className="text-sm md:text-base text-slate-400">
            南校舎3Fの3年B組をはじめ、校内各所で開催される見どころをチェックしよう！
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Campus Map View */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-base font-bold text-white font-rounded flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>桜ヶ丘高校 校内見取り図</span>
              </span>
              <span className="text-xs text-amber-400 font-mono font-bold">
                南校舎 3F 最注目！
              </span>
            </div>

            {/* Simulated Campus Layout Blocks */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {campusSpots.map(spot => {
                const isSelected = selectedLocation === spot.id;
                return (
                  <button
                    key={spot.id}
                    onClick={() => setSelectedLocation(spot.id)}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    {spot.hottest && (
                      <span className="absolute top-2 right-2 text-[10px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Flame className="w-3 h-3 fill-slate-950" />
                        <span>熱気MAX</span>
                      </span>
                    )}
                    <div className="text-[11px] font-mono text-slate-400 mb-1">{spot.floor}</div>
                    <div className={`text-sm font-bold font-rounded line-clamp-1 ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                      {spot.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{spot.type}</div>
                  </button>
                );
              })}
            </div>

            {/* Selected Location Card */}
            {(() => {
              const spot = campusSpots.find(s => s.id === selectedLocation) || campusSpots[0];
              return (
                <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {spot.floor}
                      </span>
                      <h4 className="text-lg font-black text-white font-rounded mt-1">
                        {spot.name}
                      </h4>
                    </div>
                    <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{spot.time}</span>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {spot.desc}
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Right: Stage & Event Timetable */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-base font-bold text-white font-rounded flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>当日の進行タイムテーブル</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                10月16日 (金)
              </span>
            </div>

            <div className="space-y-3">
              {FESTIVAL_SCHEDULE.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all ${
                    item.highlight
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-slate-950/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-amber-400 tabular-nums">
                      {item.time}
                    </span>
                    <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                      {item.place}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white font-rounded">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
