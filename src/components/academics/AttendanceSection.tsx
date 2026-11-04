import React, { useState } from 'react';
import { AttendanceSubject, InternalMark } from '../../data/campusStore';
import { 
  CheckSquare, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Calculator, 
  Flame, 
  TrendingUp, 
  Award,
  Sparkles
} from 'lucide-react';

interface AttendanceSectionProps {
  attendanceData: AttendanceSubject[];
  marksData: InternalMark[];
  onUpdateAttendance: (updated: AttendanceSubject[]) => void;
}

export const AttendanceSection: React.FC<AttendanceSectionProps> = ({
  attendanceData,
  marksData,
  onUpdateAttendance,
}) => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'marks'>('attendance');

  // Calculate overall metrics
  const totalAttended = attendanceData.reduce((acc, s) => acc + s.attended, 0);
  const totalClasses = attendanceData.reduce((acc, s) => acc + s.total, 0);
  const overallPercentage = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;

  // Simulate attending or missing a lecture
  const handleSimulate = (id: string, isAttended: boolean) => {
    const updated = attendanceData.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          attended: isAttended ? item.attended + 1 : item.attended,
          total: item.total + 1,
        };
      }
      return item;
    });
    onUpdateAttendance(updated);
  };

  // Calculate consecutive classes needed to cross 75%
  const getLecturesNeeded = (attended: number, total: number) => {
    const currentPct = (attended / total) * 100;
    if (currentPct >= 75) return 0;
    // (attended + x) / (total + x) >= 0.75 => attended + x >= 0.75*total + 0.75*x => 0.25*x >= 0.75*total - attended
    const needed = Math.ceil((0.75 * total - attended) / 0.25);
    return Math.max(0, needed);
  };

  return (
    <div className="space-y-6">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-50 text-[#148A8A]">
              <CheckSquare className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#17324D]">
              Attendance & Academic Performance
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Mandatory 75% examination eligibility health monitor & internal assessment breakdown
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'attendance'
                ? 'bg-[#17324D] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📊 75% Attendance Health
          </button>
          <button
            onClick={() => setActiveTab('marks')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'marks'
                ? 'bg-[#17324D] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📝 Internal Marks & GPA
          </button>
        </div>
      </div>

      {activeTab === 'attendance' ? (
        <div className="space-y-6">
          {/* Quick Health Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase text-slate-400">Overall Attendance</div>
                <div className="text-2xl font-black text-[#17324D] mt-1">
                  {overallPercentage.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {totalAttended} attended out of {totalClasses} classes
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                overallPercentage >= 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {overallPercentage >= 75 ? '✅' : '⚠️'}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase text-slate-400">Exam Eligibility Rule</div>
                <div className="text-2xl font-black text-[#2463A6] mt-1">
                  75.0% Min
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  UGC & University Examination Standard
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2463A6] flex items-center justify-center font-bold text-lg">
                📋
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase text-slate-400">Shortage Warning</div>
                <div className="text-2xl font-black text-red-600 mt-1">
                  1 Subject
                </div>
                <div className="text-xs text-red-600/80 font-medium mt-0.5">
                  Operating Systems Lab (69.2%)
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg">
                🚨
              </div>
            </div>
          </div>

          {/* Subject Cards with 75% Rule and Simulator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attendanceData.map((sub) => {
              const pct = (sub.attended / sub.total) * 100;
              const isSafe = pct >= 75;
              const isWarning = pct >= 65 && pct < 75;
              const isCritical = pct < 65;
              const lecturesNeeded = getLecturesNeeded(sub.attended, sub.total);

              return (
                <div
                  key={sub.id}
                  className={`bg-white rounded-xl p-5 border shadow-xs transition-all ${
                    !isSafe ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          {sub.code}
                        </span>
                        <span className="text-xs text-slate-500">• {sub.credits} Credits</span>
                      </div>
                      <h3 className="text-base font-bold text-[#17324D] mt-0.5">
                        {sub.name}
                      </h3>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Faculty: {sub.faculty}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-xl font-black font-mono ${
                        isSafe ? 'text-emerald-700' : 'text-red-600'
                      }`}>
                        {pct.toFixed(1)}%
                      </div>
                      <span className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        isSafe
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {isSafe ? 'Eligible' : 'Shortage'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
                      <span>Attended: {sub.attended} / {sub.total} classes</span>
                      <span>Cutoff: 75%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
                      {/* 75% cutoff marker */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10" 
                        style={{ left: '75%' }}
                        title="75% Mandatory Cutoff"
                      />
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          isSafe
                            ? 'bg-emerald-500'
                            : isWarning
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Shortage recovery hint */}
                  {!isSafe && (
                    <div className="mt-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                      <Flame className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Shortage Warning:</strong> You must attend the next{' '}
                        <strong>{lecturesNeeded} consecutive lectures</strong> without missing to cross 75%!
                      </div>
                    </div>
                  )}

                  {/* Simulator buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">
                      Live Demo Simulator:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSimulate(sub.id, true)}
                        className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors"
                        title="Simulate attending class today"
                      >
                        + Attended Today
                      </button>
                      <button
                        onClick={() => handleSimulate(sub.id, false)}
                        className="px-2.5 py-1 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 transition-colors"
                        title="Simulate missing class today"
                      >
                        - Missed Today
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Internal Marks Table */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#17324D]">
                Internal Assessment Breakdown (Mid-Term & Practicals)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluated out of 80 internal marks before final external theory exams
              </p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-[#2463A6] border border-blue-200 rounded-lg text-xs font-bold">
              Current SGPA: 8.8 / 10
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-3 text-center">Mid-Term (30)</th>
                  <th className="py-3 px-3 text-center">Practical (20)</th>
                  <th className="py-3 px-3 text-center">Assignment (20)</th>
                  <th className="py-3 px-3 text-center">Attendance (10)</th>
                  <th className="py-3 px-3 text-center">Total (80)</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {marksData.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{m.subjectName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{m.subjectCode}</div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">{m.midTerm}</td>
                    <td className="py-3 px-3 text-center font-mono">{m.practical}</td>
                    <td className="py-3 px-3 text-center font-mono">{m.projectAssignment}</td>
                    <td className="py-3 px-3 text-center font-mono">{m.attendanceMarks}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-[#17324D]">
                      {m.total}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded font-extrabold text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {m.letterGrade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
