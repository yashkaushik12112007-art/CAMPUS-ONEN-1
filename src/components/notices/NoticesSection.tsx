import React, { useState } from 'react';
import { NoticeItem, Role } from '../../data/campusStore';
import { 
  Bell, 
  Pin, 
  FileText, 
  Download, 
  Plus, 
  Search, 
  Calendar, 
  AlertCircle 
} from 'lucide-react';

interface NoticesSectionProps {
  notices: NoticeItem[];
  userRole: Role;
  onAddNotice: (notice: NoticeItem) => void;
  onShowToast: (msg: string) => void;
}

export const NoticesSection: React.FC<NoticesSectionProps> = ({
  notices,
  userRole,
  onAddNotice,
  onShowToast,
}) => {
  const [selectedAudience, setSelectedAudience] = useState<'my-notices' | 'students' | 'faculty' | 'all'>('my-notices');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [activeNoticeModal, setActiveNoticeModal] = useState<NoticeItem | null>(null);

  // New notice form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Academic' | 'Examination' | 'Administration' | 'Cultural' | 'Urgent' | 'Faculty Circular'>('Academic');
  const [targetAudience, setTargetAudience] = useState<'all' | 'students' | 'faculty'>(
    userRole === 'faculty' ? 'faculty' : 'students'
  );
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const categories = ['All', 'Academic', 'Examination', 'Administration', 'Faculty Circular', 'Urgent', 'Cultural'];

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newNotice: NoticeItem = {
      id: `not-${Date.now()}`,
      title,
      category,
      date: 'Today (03 Nov 2026)',
      author: userRole === 'admin' ? 'Academic Administration' : 'Departmental Faculty Office',
      content,
      isPinned,
      hasAttachment: false,
      audience: targetAudience,
    };

    onAddNotice(newNotice);
    setShowBroadcastModal(false);
    setTitle('');
    setContent('');
    onShowToast(`Notice broadcasted live to ${targetAudience} portal!`);
  };

  const filteredNotices = notices.filter((n) => {
    // Audience filter
    if (selectedAudience === 'my-notices') {
      if (userRole === 'faculty' && n.audience === 'students') return false;
      if (userRole === 'student' && n.audience === 'faculty') return false;
    } else if (selectedAudience === 'students' && n.audience === 'faculty') {
      return false;
    } else if (selectedAudience === 'faculty' && n.audience === 'students') {
      return false;
    }

    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-50 text-[#2463A6]">
              <Bell className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#17324D]">
              Campus Notices & Circulars
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official announcements, examination notifications, and administrative circulars
          </p>
        </div>

        {(userRole === 'admin' || userRole === 'faculty') && (
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#2463A6] hover:bg-[#1D538D] rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Broadcast New Circular</span>
          </button>
        )}
      </div>

      {/* Audience Segregation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-500 px-1">Audience:</span>
        <button
          onClick={() => setSelectedAudience('my-notices')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            selectedAudience === 'my-notices'
              ? 'bg-[#17324D] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          ⭐ Tailored For Me ({userRole === 'faculty' ? 'Faculty Desk' : 'Student Portal'})
        </button>
        <button
          onClick={() => setSelectedAudience('students')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            selectedAudience === 'students'
              ? 'bg-[#2463A6] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          🎓 Student Circulars
        </button>
        <button
          onClick={() => setSelectedAudience('faculty')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            selectedAudience === 'faculty'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          👨‍🏫 Faculty / Teacher Directives
        </button>
        <button
          onClick={() => setSelectedAudience('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            selectedAudience === 'all'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          🌐 All Campus Notices
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === c
                  ? 'bg-[#17324D] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search circulars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#2463A6]"
          />
        </div>
      </div>

      {/* Notices Feed */}
      <div className="space-y-3">
        {filteredNotices.map((n) => (
          <div
            key={n.id}
            onClick={() => setActiveNoticeModal(n)}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-[#2463A6]/40 hover:shadow-sm transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                {n.isPinned && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                    <Pin className="w-3 h-3 fill-amber-700" /> Pinned
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                  n.category === 'Urgent'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : n.category === 'Examination'
                    ? 'bg-blue-50 text-[#2463A6] border border-blue-200'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {n.category}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  n.audience === 'faculty'
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : n.audience === 'students'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {n.audience === 'faculty' ? '👨‍🏫 Faculty Only' : n.audience === 'students' ? '🎓 Students' : '🌐 All Campus'}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {n.date}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#17324D] hover:text-[#2463A6] transition-colors">
                {n.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2">
                {n.content}
              </p>
              <div className="text-[11px] text-slate-400">
                Issued by: <strong>{n.author}</strong>
              </div>
            </div>

            {n.hasAttachment && (
              <div className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold">
                <FileText className="w-3.5 h-3.5 text-[#2463A6]" />
                <span className="hidden sm:inline">PDF Attached</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Broadcast Notice Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#17324D] mb-1">
              Broadcast Official Campus Circular
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Announcements will be dispatched to students and visible on all role dashboards.
            </p>

            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Notice Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Schedule for Mid-Term Lab Evaluations"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#2463A6]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Target Audience
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#2463A6] bg-white font-bold"
                  >
                    <option value="students">🎓 Students Only</option>
                    <option value="faculty">👨‍🏫 Faculty / Teachers Only</option>
                    <option value="all">🌐 All Campus (Students + Teachers)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    aria-label="Notice Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#2463A6] bg-white"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Examination">Examination</option>
                    <option value="Administration">Administration</option>
                    <option value="Faculty Circular">Faculty Circular</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Notice Body / Content
                </label>
                <textarea
                  placeholder="Detail the instructions, timings, room numbers, and authority signoff..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#2463A6] h-28"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2463A6] hover:bg-[#1D538D] rounded-lg shadow-xs transition-colors"
                >
                  Publish Circular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Read Notice Modal */}
      {activeNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-300">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-50 text-[#2463A6] border border-blue-200">
                {activeNoticeModal.category}
              </span>
              <span className="text-xs text-slate-400">
                {activeNoticeModal.date}
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#17324D] mb-1">
              {activeNoticeModal.title}
            </h3>
            <div className="text-xs font-semibold text-slate-500 mb-4 pb-3 border-b border-slate-100">
              Issued by: {activeNoticeModal.author}
            </div>

            <div className="text-xs text-slate-700 leading-relaxed space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p>{activeNoticeModal.content}</p>
              {activeNoticeModal.hasAttachment && (
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-[#2463A6]">
                    <FileText className="w-4 h-4" />
                    <span>{activeNoticeModal.attachmentName}</span>
                  </div>
                  <button
                    onClick={() => onShowToast(`Downloaded attachment: ${activeNoticeModal.attachmentName}`)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#17324D] hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveNoticeModal(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#17324D] hover:bg-[#102438] rounded-lg shadow-xs transition-colors"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
