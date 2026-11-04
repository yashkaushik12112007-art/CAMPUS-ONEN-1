import React, { useState } from 'react';
import { LostFoundItem } from '../../data/campusStore';
import { 
  HelpCircle, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface LostFoundSectionProps {
  items: LostFoundItem[];
  onAddItem: (item: LostFoundItem) => void;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const LostFoundSection: React.FC<LostFoundSectionProps> = ({
  items,
  onAddItem,
  onShowToast,
}) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Claimed'>('All');

  // Report Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Electronics' | 'Accessories' | 'Documents' | 'Books'>('Electronics');
  const [locationFound, setLocationFound] = useState('');
  const [description, setDescription] = useState('');

  // Enforce Privacy Check: Reject personal phone numbers or student IDs
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check for phone numbers or roll numbers in text
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/;
    if (phoneRegex.test(description) || phoneRegex.test(title)) {
      onShowToast(
        'Privacy Policy Violation: Personal phone numbers are strictly prohibited. Items must be claimed via Central Security Desk.',
        'error'
      );
      return;
    }

    const newItem: LostFoundItem = {
      id: `lf-${Date.now()}`,
      title,
      category,
      locationFound,
      date: 'Today (03 Nov 2026)',
      claimAt: 'Central Security Desk (Admin Block Gate 1)',
      status: 'Available',
      description,
    };

    onAddItem(newItem);
    setShowReportModal(false);
    setTitle('');
    setLocationFound('');
    setDescription('');
    onShowToast('Item reported to Campus Lost & Found securely!');
  };

  const filteredItems = items.filter((item) => {
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.locationFound.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header with Privacy Notice */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-50 text-[#148A8A]">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#17324D]">
              Campus Lost & Found Bulletin
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Privacy-by-Design Enforced: No student phone numbers or personal roll numbers are published.
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#2463A6] hover:bg-[#1D538D] rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Report Lost / Found Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5">
          {(['All', 'Available', 'Claimed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-[#17324D] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st} ({st === 'All' ? items.length : items.filter((i) => i.status === st).length})
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items, rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#2463A6]"
          />
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const isAvail = item.status === 'Available';

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                    {item.category}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      isAvail
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isAvail ? '🟢 Unclaimed' : '✓ Claimed'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#17324D]">{item.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {item.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#148A8A] shrink-0" />
                    <span>Location: <strong>{item.locationFound}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Reported on: {item.date}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Claim at: <strong>{item.claimAt}</strong>
                </span>
                <button
                  onClick={() =>
                    onShowToast(`Claim inquiry logged. Please present institutional ID at ${item.claimAt}.`)
                  }
                  className="px-3 py-1.5 rounded-lg font-bold text-xs bg-slate-100 hover:bg-slate-200 text-[#17324D] transition-colors"
                >
                  Claim Item →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Item Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#17324D] mb-1">
              Report a Lost or Found Campus Item
            </h3>
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 mb-4 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Privacy Policy:</strong> Do not include your personal phone number, WhatsApp contact, or student ID. All claimants verify through Central Security.
              </div>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Blue Dell Laptop Charger / Water Bottle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#2463A6]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    aria-label="Item Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#2463A6] bg-white"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Documents">Documents / ID</option>
                    <option value="Books">Books / Notes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Location Found / Lost
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. LT-204 Desk 14"
                    value={locationFound}
                    onChange={(e) => setLocationFound(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#2463A6]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Description & Distinguishing Marks
                </label>
                <textarea
                  placeholder="Describe color, brand, condition without giving away personal passwords or sensitive info..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#2463A6] h-24"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#17324D] hover:bg-[#102438] rounded-lg shadow-xs transition-colors"
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
