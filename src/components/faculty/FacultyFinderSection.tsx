import React, { useState } from 'react';
import { FacultyMember, Role } from '../../data/campusStore';
import { 
  Users, 
  Search, 
  MapPin, 
  Clock, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  Building2,
  PhoneCall
} from 'lucide-react';

interface FacultyFinderProps {
  facultyList: FacultyMember[];
  userRole: Role;
  onUpdateFaculty: (updated: FacultyMember[]) => void;
  onAskBotAboutFaculty: (name: string) => void;
  onShowToast: (msg: string) => void;
}

export const FacultyFinderSection: React.FC<FacultyFinderProps> = ({
  facultyList,
  userRole,
  onUpdateFaculty,
  onAskBotAboutFaculty,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');

  const departments = ['All', 'CSE', 'IT', 'ECE', 'AI ML'];

  // Toggle availability for logged-in teacher (Dr. Sunita Rao)
  const handleToggleMyStatus = (newStatus: 'Available' | 'In Lecture' | 'In Office') => {
    const updated = facultyList.map((f) => {
      if (f.id === 'fac-cse-1') {
        return { ...f, status: newStatus };
      }
      return f;
    });
    onUpdateFaculty(updated);
    onShowToast(`Your cabin availability updated to: ${newStatus}`);
  };

  const filteredFaculty = facultyList.filter((f) => {
    const matchesDept = selectedDept === 'All' || f.department === selectedDept;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      f.name.toLowerCase().includes(q) ||
      f.cabin.toLowerCase().includes(q) ||
      f.specialization.toLowerCase().includes(q) ||
      f.department.toLowerCase().includes(q);
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-50 text-[#148A8A]">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#17324D]">
              Faculty Directory & Cabin Locator
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            20 faculty members across 4 engineering departments with published office hours & cabin locations
          </p>
        </div>

        {/* Teacher status update shortcut if logged in as teacher */}
        {userRole === 'faculty' && (
          <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs font-bold text-[#17324D] px-2">
              My Cabin Status:
            </span>
            <button
              onClick={() => handleToggleMyStatus('Available')}
              className="px-2 py-1 text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-md border border-emerald-200"
            >
              🟢 Available
            </button>
            <button
              onClick={() => handleToggleMyStatus('In Office')}
              className="px-2 py-1 text-xs font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-md border border-amber-200"
            >
              🟡 In Office
            </button>
            <button
              onClick={() => handleToggleMyStatus('In Lecture')}
              className="px-2 py-1 text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-md border border-slate-300"
            >
              🔴 In Lecture
            </button>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        {/* Department Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedDept === dept
                  ? 'bg-[#17324D] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept === 'All' ? 'All Departments (20)' : `${dept} (5)`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by professor, cabin, specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#2463A6] bg-slate-50/50"
          />
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFaculty.map((f) => {
          const isAvail = f.status === 'Available';
          const isInLecture = f.status === 'In Lecture';
          const isInOffice = f.status === 'In Office';

          return (
            <div
              key={f.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-[#2463A6]/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-[#2463A6] border border-blue-200">
                    {f.department} Department
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      isAvail
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isInOffice
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isAvail
                          ? 'bg-emerald-500'
                          : isInOffice
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                      }`}
                    />
                    {f.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#17324D]">{f.name}</h3>
                <div className="text-xs font-semibold text-[#2463A6]">{f.designation}</div>
                <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {f.specialization}
                </div>

                {/* Cabin & Office Hours */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#148A8A] shrink-0" />
                    <span className="font-bold text-[#17324D]">{f.cabin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{f.officeHours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{f.email}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onAskBotAboutFaculty(f.name)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#2463A6] hover:text-[#17324D] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ask CampusBot</span>
                </button>
                <button
                  onClick={() => onShowToast(`Cabin directions for ${f.name} sent to your student portal.`)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
                >
                  Directions
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
