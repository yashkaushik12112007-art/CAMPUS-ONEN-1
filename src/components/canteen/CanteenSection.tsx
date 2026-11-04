import React, { useState } from 'react';
import { CanteenItem } from '../../data/campusStore';
import { 
  UtensilsCrossed, 
  Clock, 
  Star, 
  ShoppingBag, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Sparkles,
  Ticket
} from 'lucide-react';

interface CanteenSectionProps {
  canteenItems: CanteenItem[];
  orders: {
    tokenNumber: number;
    items: { name: string; quantity: number; price: number }[];
    total: number;
    status: 'Ready' | 'Preparing' | 'Collected';
    placedAt: string;
  }[];
  onPlaceOrder: (order: {
    tokenNumber: number;
    items: { name: string; quantity: number; price: number }[];
    total: number;
    status: 'Ready' | 'Preparing' | 'Collected';
    placedAt: string;
  }) => void;
  onShowToast: (msg: string) => void;
}

export const CanteenSection: React.FC<CanteenSectionProps> = ({
  canteenItems,
  orders,
  onPlaceOrder,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [tray, setTray] = useState<Record<string, number>>({
    'c-1': 1, // Special Veg Thali default demo item
    'c-3': 1, // Cold coffee default demo item
  });
  const [latestToken, setLatestToken] = useState<number | null>(482);

  const categories = ['All', 'Meals', 'Snacks', 'Beverages', 'Specials'];

  const handleAddToCart = (id: string) => {
    setTray((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (id: string) => {
    setTray((prev) => {
      const copy = { ...prev };
      if (copy[id] > 1) {
        copy[id] -= 1;
      } else {
        delete copy[id];
      }
      return copy;
    });
  };

  // Calculate Tray Total
  const trayItems = Object.entries(tray).map(([id, qty]) => {
    const item = canteenItems.find((c) => c.id === id);
    return {
      item,
      quantity: qty,
      subtotal: (item?.price || 0) * qty,
    };
  }).filter((x) => x.item !== undefined);

  const totalAmount = trayItems.reduce((acc, t) => acc + t.subtotal, 0);

  // Place digital pickup token
  const handlePlaceOrder = () => {
    if (trayItems.length === 0) {
      onShowToast('Your tray is empty! Add items first.');
      return;
    }

    const nextToken = Math.floor(400 + Math.random() * 200);
    const newOrder = {
      tokenNumber: nextToken,
      items: trayItems.map((t) => ({
        name: t.item!.name,
        quantity: t.quantity,
        price: t.item!.price,
      })),
      total: totalAmount,
      status: 'Preparing' as const,
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onPlaceOrder(newOrder);
    setLatestToken(nextToken);
    setTray({});
    onShowToast(`Order placed! Digital Pickup Token #${nextToken} generated.`);
  };

  const filteredItems = selectedCategory === 'All'
    ? canteenItems
    : canteenItems.filter((i) => i.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-orange-50 text-orange-600">
              <UtensilsCrossed className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#17324D]">
              Campus Cafeteria & Digital Pickup Tokens
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Order in advance and skip the physical lunch queues with instant pickup tokens
          </p>
        </div>

        {/* Live Token Status Highlight */}
        {latestToken && (
          <div className="flex items-center gap-3 p-2 px-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
              #{latestToken}
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold uppercase text-emerald-800">
                Active Pickup Token
              </div>
              <div className="text-xs font-bold text-emerald-950">
                Ready at Counter 2 (Hot Tray)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Menu vs Tray */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Menu Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-xl border border-slate-200">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#17324D] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const inTrayCount = tray[item.id] || 0;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-[#2463A6]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded border border-emerald-600 flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{item.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-[#17324D]">{item.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-base font-black text-[#17324D]">
                        ₹{item.price}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.prepTime}</span>
                      </div>
                    </div>

                    {inTrayCount > 0 ? (
                      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-1">
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="w-6 h-6 rounded bg-white text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-[#2463A6] w-4 text-center">
                          {inTrayCount}
                        </span>
                        <button
                          onClick={() => handleAddToCart(item.id)}
                          className="w-6 h-6 rounded bg-[#2463A6] text-white font-bold flex items-center justify-center hover:bg-[#1D538D]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(item.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#2463A6] hover:bg-[#1D538D] shadow-xs transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tray / Checkout Column (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#2463A6]" />
                <h3 className="font-bold text-sm text-[#17324D]">Your Food Tray</h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">
                {trayItems.length} items
              </span>
            </div>

            {trayItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Your tray is currently empty. Click '+ Add' on any menu item.
              </div>
            ) : (
              <div className="py-3 divide-y divide-slate-100 space-y-2">
                {trayItems.map((t) => (
                  <div key={t.item!.id} className="pt-2 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-slate-800 truncate">
                        {t.item!.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        ₹{t.item!.price} × {t.quantity}
                      </div>
                    </div>
                    <div className="font-bold text-[#17324D]">
                      ₹{t.subtotal}
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Campus Digital Fee:</span>
                    <span className="text-emerald-700 font-bold">FREE (₹0)</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-[#17324D] pt-2 border-t border-slate-100">
                    <span>Total Payable:</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#17324D] to-[#2463A6] hover:from-[#13283E] hover:to-[#1D538D] shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Ticket className="w-4 h-4 text-amber-300" />
                    <span>⚡ Place Demo Pickup Token</span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-2">
                    Generates a digital token to collect food without waiting in queue.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Past Demo Tokens History */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Recent Campus Orders
            </h4>
            <div className="space-y-2">
              {orders.map((o) => (
                <div
                  key={o.tokenNumber}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-black text-[#17324D] font-mono">
                      Token #{o.tokenNumber}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {o.items.map((i) => `${i.name} (${i.quantity})`).join(', ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        o.status === 'Ready'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {o.status}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{o.placedAt}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
