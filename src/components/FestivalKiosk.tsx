import React, { useState } from 'react';
import { Plus, Minus, ShoppingBag, Check, Printer, Clock, Sparkles, ChefHat } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MENU_ITEMS } from '../data/festivalData';
import { MenuItem, CartItem, OrderTicket } from '../types/festival';
import { audioService } from '../services/audioService';

interface FestivalKioskProps {
  cart: CartItem[];
  onAddToCart: (item: MenuItem, flavorOption: string, sauceOption: string) => void;
  onUpdateQuantity: (index: number, delta: number) => void;
  onClearCart: () => void;
}

export const FestivalKiosk: React.FC<FestivalKioskProps> = ({
  cart,
  onAddToCart,
  onUpdateQuantity,
  onClearCart,
}) => {
  const [selectedPowder, setSelectedPowder] = useState<string>('スノーシュガー（定番）');
  const [selectedSauce, setSelectedSauce] = useState<string>('特製ケチャマヨ');
  const [activeTab, setActiveTab] = useState<'menu' | 'cart' | 'tickets'>('menu');
  const [customerName, setCustomerName] = useState<string>('');
  const [recentTicket, setRecentTicket] = useState<OrderTicket | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderTicket[]>([]);

  // Calculate cart total
  const cartTotal = cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    audioService.playChime();
    const orderNum = `B-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const pickupMinutes = Math.floor(3 + Math.random() * 4);
    const pickupTimeStr = `${now.getHours()}:${String(now.getMinutes() + pickupMinutes).padStart(2, '0')}`;
    
    // Calculate estimated cheese stretch
    const maxStretch = Math.max(...cart.map(c => c.item.cheeseStretchCm));

    const ticket: OrderTicket = {
      orderNumber: orderNum,
      customerName: customerName.trim() || 'ゲスト様',
      items: [...cart],
      totalPrice: cartTotal,
      pickupTime: pickupTimeStr,
      cheesePullScore: maxStretch + Math.floor(Math.random() * 10),
      timestamp: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
      status: 'frying'
    };

    setRecentTicket(ticket);
    setOrderHistory(prev => [ticket, ...prev]);
    onClearCart();
    setActiveTab('tickets');

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#fbbf24', '#ffffff']
    });
  };

  return (
    <section id="menu-section" className="py-14 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wider mb-2">
              <ChefHat className="w-3.5 h-3.5" />
              <span>3年B組 教室屋台 おしながき</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-white font-rounded">
              極上揚げたてチーズボール Menu
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              「外はサクッ、中はどこまでも伸び〜る！」独自配合の特製米粉ブレンドで揚げる自慢の逸品。
            </p>
          </div>

          {/* Tab selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'menu'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              メニュー一覧
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'cart'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>カート ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'tickets'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              整理券＆厨房状況
            </button>
          </div>
        </div>

        {/* View 1: Menu Items Grid */}
        {activeTab === 'menu' && (
          <div className="space-y-10">
            {/* Featured Delicacy Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
              <div className="lg:col-span-6 space-y-4">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3年B組 自慢の看板スナック</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white font-rounded">
                  驚異のチーズ伸び率 50cm越え！<br />
                  外カリッ中トロ食感の秘密
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  「朝の教室 粉まみれの手 丸めた生地に笑い声割れる」の歌詞通り、今朝8時からクラス全員で一つずつ丁寧に包み上げました。最高品質のモッツァレラ＆チェダーチーズを175℃の黄金油で一気に揚げ抜きます！
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="text-xs text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
                    🧀 <span className="font-bold text-white">独自米粉生地</span> 配合
                  </div>
                  <div className="text-xs text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
                    🔥 <span className="font-bold text-white">注文毎の揚げたて</span> 提供
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl">
                  <img
                    src="/src/assets/images/cheeseball_deluxe_plate_1792126910716.jpg"
                    alt="極上モッツァレラチーズボールのとろ〜りチーズ伸び"
                    referrerPolicy="no-referrer"
                    className="w-full h-[260px] md:h-[300px] object-cover"
                  />
                  <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-400/40 text-xs font-bold text-amber-300">
                    最長伸び記録: 68.4 cm 達成中！
                  </div>
                </div>
              </div>
            </div>

            {/* Customization Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-slate-900/60 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  無料トッピング・パウダー選択
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'スノーシュガー（定番）',
                    'パルメザンチーズ粉',
                    'ハニーバターパウダー',
                    'ピリ辛カレーパウダー'
                  ].map(powder => (
                    <button
                      key={powder}
                      onClick={() => setSelectedPowder(powder)}
                      className={`p-2 rounded-xl text-xs font-bold text-left transition-all border ${
                        selectedPowder === powder
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {selectedPowder === powder ? '✓ ' : ''}{powder}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  無料ディップ・ソース選択
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    '特製ケチャマヨ',
                    'ハニーマスタード',
                    '濃厚練乳ミルク',
                    '旨辛ヤンニョムたれ'
                  ].map(sauce => (
                    <button
                      key={sauce}
                      onClick={() => setSelectedSauce(sauce)}
                      className={`p-2 rounded-xl text-xs font-bold text-left transition-all border ${
                        selectedSauce === sauce
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {selectedSauce === sauce ? '✓ ' : ''}{sauce}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Menu Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MENU_ITEMS.map(item => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg group relative"
                >
                  {item.popular && (
                    <div className="absolute -top-3 right-5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[11px] px-3 py-0.5 rounded-full shadow-md">
                      {item.tag}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{item.japaneseTitle}</span>
                      <span className="font-mono text-amber-400 font-bold">伸び度 ~{item.cheeseStretchCm}cm</span>
                    </div>

                    <h4 className="text-lg font-black text-white font-rounded group-hover:text-amber-300 transition-colors">
                      {item.name}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.flavorNotes.map((note, idx) => (
                        <span key={idx} className="text-[11px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500">学割価格</div>
                      <div className="text-2xl font-black text-white font-mono tabular-nums">
                        ¥{item.price}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onAddToCart(item, selectedPowder, selectedSauce);
                        audioService.playDing();
                      }}
                      className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black rounded-xl hover:brightness-110 active:scale-95 transition-all text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>カートに追加</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View 2: Cart & Checkout View */}
        {activeTab === 'cart' && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
            <h3 className="text-xl font-black text-white font-rounded flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span>注文カート内容</span>
            </h3>

            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="text-4xl">🛒</div>
                <div className="text-slate-400 text-sm">カートに商品が入っていません</div>
                <button
                  onClick={() => setActiveTab('menu')}
                  className="px-5 py-2.5 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
                >
                  メニューから選ぶ
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="divide-y divide-slate-800">
                  {cart.map((ci, idx) => (
                    <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-bold text-white font-rounded">{ci.item.name}</div>
                        <div className="text-xs text-slate-400">
                          {ci.flavorOption} · {ci.sauceOption}
                        </div>
                        <div className="text-xs font-mono text-amber-400 font-bold mt-0.5">
                          ¥{ci.item.price} × {ci.quantity} = ¥{ci.item.price * ci.quantity}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button
                          onClick={() => onUpdateQuantity(idx, -1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-mono font-bold text-white px-1 tabular-nums">
                          {ci.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(idx, 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer name input */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    お受け取りのお名前 / ニックネーム
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="例: たろう（2-A）、ダンス部のアスカ"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Order Summary & Primary CTA */}
                <div className="pt-4 border-t border-slate-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">合計金額 (税込)</span>
                    <span className="text-3xl font-black text-white font-mono tabular-nums">
                      ¥{cartTotal}
                    </span>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="w-full py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 text-slate-950 font-black rounded-xl text-base shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>整理券を発行して注文を確定する</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* View 3: Digital Tickets & Kitchen Status */}
        {activeTab === 'tickets' && (
          <div className="space-y-8">
            {recentTicket && (
              <div className="max-w-xl mx-auto bg-amber-50 text-slate-900 rounded-3xl p-6 md:p-8 border-4 border-amber-400 shadow-2xl relative overflow-hidden">
                {/* Festival Ticket Header */}
                <div className="border-b-2 border-dashed border-amber-400/80 pb-4 mb-4 text-center">
                  <div className="text-[11px] font-bold text-amber-800 tracking-widest uppercase">
                    3-B CHEESE BALL FESTIVAL PASS
                  </div>
                  <h4 className="text-2xl font-black font-rounded mt-1">
                    揚げたて引換 整理券
                  </h4>
                  <div className="text-4xl md:text-5xl font-black font-mono tracking-tight text-amber-600 my-2">
                    {recentTicket.orderNumber}
                  </div>
                  <div className="text-xs text-amber-900 font-bold">
                    お名前: <span className="underline">{recentTicket.customerName}</span> 様
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="space-y-3 text-xs md:text-sm">
                  <div className="flex justify-between py-1 border-b border-amber-200">
                    <span className="text-slate-600">お渡し予定時刻:</span>
                    <span className="font-bold font-mono text-base text-amber-950 flex items-center gap-1">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>{recentTicket.pickupTime} 前後</span>
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-amber-200">
                    <span className="text-slate-600">予想チーズ伸び指数:</span>
                    <span className="font-extrabold text-amber-700 font-mono text-base">
                      {recentTicket.cheesePullScore} cm !!
                    </span>
                  </div>

                  <div className="py-2">
                    <div className="font-bold text-slate-700 mb-1">ご注文内容:</div>
                    {recentTicket.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-slate-800 py-0.5">
                        <span>• {it.item.name} × {it.quantity}</span>
                        <span className="font-mono font-bold">¥{it.item.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between font-bold text-base pt-2 border-t border-amber-300">
                    <span>お支払い金額:</span>
                    <span className="font-mono text-xl text-amber-950">¥{recentTicket.totalPrice}</span>
                  </div>
                </div>

                {/* Footer instructions */}
                <div className="mt-6 pt-4 border-t-2 border-dashed border-amber-400/80 text-center text-[11px] text-amber-800 font-medium">
                  南校舎3F 3年B組 教室の受取口にて本画面をご提示ください！<br />
                  「美味しい？聞いて ハイタッチ！」でお渡しします✨
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>整理券を印刷 / 保存</span>
                  </button>
                </div>
              </div>
            )}

            {/* Live Kitchen Monitor */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-amber-400" />
                <span>3年B組 教室厨房 リアルタイム提供状況</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950/70 border border-amber-500/20 rounded-xl p-4">
                  <div className="text-xs font-bold text-amber-400 mb-2">🔥 フライヤー揚げ中</div>
                  <div className="flex flex-wrap gap-2">
                    {orderHistory.slice(0, 3).map(o => (
                      <span key={o.orderNumber} className="bg-slate-800 text-white font-mono font-bold text-xs px-2.5 py-1 rounded">
                        {o.orderNumber}
                      </span>
                    ))}
                    {orderHistory.length === 0 && (
                      <span className="text-xs text-slate-500">現在揚げ中の注文はありません</span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-yellow-500/20 rounded-xl p-4">
                  <div className="text-xs font-bold text-yellow-300 mb-2">✨ トッピング＆袋詰め中</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-slate-800 text-amber-300 font-mono font-bold text-xs px-2.5 py-1 rounded">
                      #B-201
                    </span>
                    <span className="bg-slate-800 text-amber-300 font-mono font-bold text-xs px-2.5 py-1 rounded">
                      #B-202
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-emerald-500/20 rounded-xl p-4">
                  <div className="text-xs font-bold text-emerald-400 mb-2">📢 お呼び出し中（お渡し口へ！）</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-xs px-2.5 py-1 rounded animate-pulse">
                      #B-198
                    </span>
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-xs px-2.5 py-1 rounded animate-pulse">
                      #B-199
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
