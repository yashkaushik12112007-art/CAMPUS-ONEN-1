import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Sparkles,
  Flame
} from 'lucide-react';
import { AttendanceSubject } from '../data/campusStore';

interface TomorrowCardProps {
  onOpenTimetable: () => void;
  onOpenAttendance: () => void;
  onOpenDocuments: () => void;
  onOpenBot: () => void;
  attendanceData: AttendanceSubject[];
}

export const TomorrowCard: React.FC<TomorrowCardProps> = ({
  onOpenTimetable,
  onOpenAttendance,
  onOpenDocuments,
  onOpenBot,
  attendanceData,
}) => {
  // Find shortage subjects below 75%
  const shortageSubject = attendanceData.find(
    (s) => (s.attended / s.total) * 100 < 75
  );

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#17324D] via-[#1F466E] to-[#2463A6] text-white p-6 sm:p-7 shadow-lg border border-slate-700/40 mb-8">
      {/* Background subtle geometric glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Header bar of the card */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10 border-b border-white/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#148A8A] text-white uppercase tracking-wider">
              ⭐ Flagship Feature
            </span>
            <span className="text-xs font-semibold text-cyan-200">
              Personalized Next-Day Academic Briefing
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
            Tomorrow at College <span className="text-cyan-300 font-medium text-lg sm:text-xl">(Wednesday)</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBot}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors border border-white/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ask CampusBot</span>
          </button>
          <button
            onClick={onOpenTimetable}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-[#17324D] hover:bg-slate-100 transition-colors shadow-xs"
          >
            <span>Full Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Schedule vs Urgent Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left Column: Tomorrow's Lecture Lineup (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-300" />
            <span>Lecture & Lab Schedule (5 Slots)</span>
          </div>

          <div className="space-y-2.5">
            {/* Slot 1 */}
            <div className="flex items-start justify-between bg-white/10 hover:bg-white/15 transition-colors backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-amber-300 font-mono">09:00 - 10:00 AM</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-500/30 text-blue-200">Theory</span>
                </div>
                <div className="font-bold text-sm text-white">Programming in C (CS-101)</div>
                <div className="text-xs text-slate-300">Dr. Ritu Pahwa • Professor & HOD</div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-white/20 text-white border border-white/10">
                  <MapPin className="w-3 h-3 text-cyan-300" />
                  <span>LT-204</span>
                </span>
                <div className="text-[10px] text-slate-300 mt-1">Lecture Block B</div>
              </div>
            </div>

            {/* Slot 2 */}
            <div className="flex items-start justify-between bg-white/10 hover:bg-white/15 transition-colors backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-amber-300 font-mono">10:00 - 11:00 AM</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-500/30 text-blue-200">Theory</span>
                </div>
                <div className="font-bold text-sm text-white">Digital Electronics (EC-102)</div>
                <div className="text-xs text-slate-300">Mrs. Yukti Mutreja • Associate Professor</div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-white/20 text-white border border-white/10">
                  <MapPin className="w-3 h-3 text-cyan-300" />
                  <span>LT-204</span>
                </span>
                <div className="text-[10px] text-slate-300 mt-1">Same Room</div>
              </div>
            </div>

            {/* Slot 3 - Digital Electronics Lab */}
            <div className="flex items-start justify-between bg-gradient-to-r from-teal-500/20 to-cyan-500/20 hover:bg-white/15 transition-colors backdrop-blur-md rounded-xl p-3 border border-teal-400/30">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-amber-300 font-mono">01:00 - 03:00 PM</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#148A8A] text-white">2-Hr Practical Lab</span>
                </div>
                <div className="font-bold text-sm text-white">Digital Electronics Lab (EC-102P)</div>
                <div className="text-xs text-cyan-200 font-medium">Mrs. Yukti Mutreja • Logic Gates & Flip-Flops Practical</div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-extrabold bg-[#148A8A] text-white shadow-xs">
                  <MapPin className="w-3 h-3 text-white" />
                  <span>Digital Lab 2</span>
                </span>
                <div className="text-[10px] text-teal-200 font-bold mt-1">Shortage Alert!</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Urgent Action Items & 75% Health Alert (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-200 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
            <span>Immediate Deadlines & Health</span>
          </div>

          <div className="space-y-2.5">
            {/* 75% Attendance Warning Badge */}
            {shortageSubject && (
              <div 
                onClick={onOpenAttendance}
                className="bg-red-500/20 hover:bg-red-500/25 transition-colors border border-red-400/40 rounded-xl p-3.5 cursor-pointer backdrop-blur-md"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-600/80 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Flame className="w-4 h-4 text-amber-200" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-red-200 uppercase tracking-wide">
                        Attendance Warning
                      </span>
                      <span className="text-xs font-extrabold text-white bg-red-600/60 px-2 py-0.5 rounded">
                        {((shortageSubject.attended / shortageSubject.total) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {shortageSubject.name}
                    </div>
                    <p className="text-xs text-red-100/90 mt-1">
                      Must attend tomorrow's 2-hour lab! You need <strong>4 consecutive sessions</strong> to cross the mandatory 75% examination threshold.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pending Assignment Card */}
            <div className="bg-white/10 hover:bg-white/15 transition-colors border border-white/10 rounded-xl p-3 backdrop-blur-md">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/30 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 uppercase">
                      Assignment Due
                    </span>
                    <span className="text-[11px] font-semibold text-slate-300">
                      Tomorrow 11:59 PM
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    Programming in C - Pointers & Memory Allocation Assignment
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    CS-101 • Dr. Ritu Pahwa (Weightage: 10 Marks)
                  </div>
                </div>
              </div>
            </div>

            {/* Document Clearance Notice */}
            <div 
              onClick={onOpenDocuments}
              className="bg-white/10 hover:bg-white/15 transition-colors border border-white/10 rounded-xl p-3 backdrop-blur-md cursor-pointer"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/30 text-cyan-200 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-200 uppercase">
                      Clearance Status
                    </span>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/40 px-2 py-0.5 rounded">
                      Anti-Ragging Verified
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    Hostel Clearance Under Review
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    1 clearance pending signature at Dean Office
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
