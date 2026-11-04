import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  RotateCcw, 
  CheckCircle2, 
  Users, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchLiveDemo: () => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  isOpen,
  onClose,
  onLaunchLiveDemo,
}) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 9;

  const nextSlide = () => {
    if (currentSlide < totalSlides) setCurrentSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 1) setCurrentSlide(currentSlide - 1);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullScreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F1F2E] text-white flex flex-col overflow-hidden select-none">
      {/* Top Progress Bar */}
      <div className="w-full h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-[#2463A6] to-[#148A8A] transition-all duration-300"
          style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
        />
      </div>

      {/* Slide Canvas Area */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-6 sm:p-12 flex flex-col justify-center overflow-y-auto">
        {/* Slide 1 */}
        {currentSlide === 1 && (
          <div className="space-y-6 slide-active">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#148A8A]/20 text-cyan-300 border border-[#148A8A]/40 uppercase tracking-widest">
              🚀 Final Hackathon Pitch • 4 November 2026
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-sky-300">
              CampusOne
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-sky-400">
              Your Entire College in One Place
            </p>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              A unified, role-based campus operating portal connecting everyday academic information, administrative clearance workflows, and student services into a single source of truth.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 inline-flex flex-wrap gap-8">
              <div>
                <div className="text-[11px] uppercase font-bold text-slate-400">Team Leader</div>
                <div className="text-base font-extrabold text-white mt-0.5">Yash Kaushik</div>
              </div>
              <div className="border-l border-white/15 pl-8">
                <div className="text-[11px] uppercase font-bold text-slate-400">Team Members</div>
                <div className="text-base font-bold text-slate-200 mt-0.5">Shlok • Nandana • Tejpal</div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 2 */}
        {currentSlide === 2 && (
          <div className="space-y-6 slide-active">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest">
              ⚠️ The Core Problem
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Campus Information is Broken & Fragmented
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-3xl mb-3">📢</div>
                <h3 className="text-lg font-bold text-sky-300">Scattered Notice Boards</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Critical circulars, exam dates, and scholarship notices are scattered across 5 WhatsApp groups, PDF attachments, and physical notice boards.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-3xl mb-3">🚶‍♂️</div>
                <h3 className="text-lg font-bold text-sky-300">Physical Office Queues</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Students stand in long queues at the registrar office just to verify if their hostel clearance or anti-ragging affidavit was verified or rejected.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-3xl mb-3">❓</div>
                <h3 className="text-lg font-bold text-sky-300">Zero Next-Day Preparedness</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Students scramble every morning finding which room has their lab, who is teaching, and whether urgent assignments or fees are due today.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Slide 3 */}
        {currentSlide === 3 && (
          <div className="space-y-6 slide-active">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 uppercase tracking-widest">
              💡 The CampusOne Architecture
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Three Integrated Role-Based Workspaces
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-white/5 border-t-4 border-t-[#148A8A] border border-white/10 rounded-2xl p-6">
                <div className="text-2xl mb-2">🏛️</div>
                <h3 className="text-lg font-bold text-white">1. Campus Home (Public)</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Open institutional repository for circulars, upcoming fests, live cafeteria menu, and 20 faculty cabin locations.
                </p>
              </div>
              <div className="bg-white/5 border-t-4 border-t-[#2463A6] border border-white/10 rounded-2xl p-6">
                <div className="text-2xl mb-2">🎓</div>
                <h3 className="text-lg font-bold text-white">2. Student Portal (Personal)</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Personalized timetable, 75% attendance health monitor, internal marks, My Documents status tracker, and e-receipts.
                </p>
              </div>
              <div className="bg-white/5 border-t-4 border-t-amber-400 border border-white/10 rounded-2xl p-6">
                <div className="text-2xl mb-2">🛡️</div>
                <h3 className="text-lg font-bold text-white">3. Faculty & Admin Portal</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  1-Click document verification/rejection, official notice broadcasting, 40-student attendance marking, and salary slips.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Slide 4 */}
        {currentSlide === 4 && (
          <div className="space-y-6 slide-active">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 uppercase tracking-widest">
              ⭐ Flagship Differentiator
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              "Tomorrow at College"
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl">
              Instead of digging through 5 different pages, CampusOne automatically synthesizes the next academic day into one actionable card:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-white/5 border-l-4 border-l-cyan-400 border border-white/10 rounded-2xl p-6 space-y-2">
                <h4 className="text-base font-bold text-cyan-300">
                  📅 Next-Day Classes & Lab Locations
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Exact time slots, course codes, professors, and classroom numbers (e.g. <strong>LT-204</strong>, <strong>Computer Lab 3</strong>) so students never walk into the wrong room.
                </p>
              </div>
              <div className="bg-white/5 border-l-4 border-l-amber-400 border border-white/10 rounded-2xl p-6 space-y-2">
                <h4 className="text-base font-bold text-amber-300">
                  🚨 Immediate Action Items & Shortage Alert
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pending assignments due tomorrow, urgent document clearance deadlines, and <strong>75% attendance health alerts</strong> warning students of exam shortage.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Slide 5 */}
        {currentSlide === 5 && (
          <div className="space-y-6 slide-active">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-widest">
              🛠️ Backend & Privacy Architecture
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Built with Scale, Privacy & Security
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-base font-bold text-sky-300">Full-Stack Foundation</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Express backend with Gemini API proxy, React 19, TypeScript, Tailwind CSS, and offline-first localStorage sync.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-base font-bold text-sky-300">Cloud Firestore Ready</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Configured with 13 structured collections (users, students, documents, timetables, attendance, notices, canteen, etc.).
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-base font-bold text-sky-300">Privacy-by-Design</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Role-based security via <code>firestore.rules</code>. Lost & Found strictly forbids student phone numbers or personal IDs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Slide 6 */}
        {currentSlide === 6 && (
          <div className="space-y-6 slide-active">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-widest">
              👥 Team Execution Compliance
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              100% Team Member Work Delivered
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-white/10 text-cyan-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Member</th>
                    <th className="p-3">Role & Delivered Module</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-white">Yash Kaushik (Lead)</td>
                    <td className="p-3 text-slate-300">Architecture, CSS Design System, Tomorrow at College Flagship card, Integration.</td>
                    <td className="p-3 text-emerald-400 font-bold">✓ Delivered</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">Shlok</td>
                    <td className="p-3 text-slate-300">Demo Role Login, My Documents (4 statuses), Admin verify/reject, Fee e-receipts.</td>
                    <td className="p-3 text-emerald-400 font-bold">✓ Delivered</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">Nandana</td>
                    <td className="p-3 text-slate-300">Class Timetable (day filters), 75% Attendance Health Calculator, Marks Breakdown.</td>
                    <td className="p-3 text-emerald-400 font-bold">✓ Delivered</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">Tejpal</td>
                    <td className="p-3 text-slate-300">Faculty Finder (20 cabins), Notices broadcaster, Events RSVP, Canteen digital tokens.</td>
                    <td className="p-3 text-emerald-400 font-bold">✓ Delivered</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Slide 7 */}
        {currentSlide === 7 && (
          <div className="space-y-6 slide-active">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest">
              🤖 AI Innovation Highlight
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              CampusBot AI – Grounded Live Intelligence
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Powered by <strong>Gemini 3.8 Flash</strong> on the server, CampusBot AI answers student and faculty queries in natural language from live database records:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h4 className="text-sky-300 font-bold text-sm">"What classes do I have tomorrow?"</h4>
                <p className="text-xs text-slate-400 mt-2">Returns exact lecture time slots, professor names, and classroom numbers (LT-204).</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h4 className="text-amber-300 font-bold text-sm">"Check my attendance health"</h4>
                <p className="text-xs text-slate-400 mt-2">Identifies OS Lab shortage (69.2%) and computes that 4 consecutive classes are needed.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h4 className="text-emerald-300 font-bold text-sm">"Where is Dr. Sunita Rao?"</h4>
                <p className="text-xs text-slate-400 mt-2">Locates Cabin Block B-304, office hours (2-4 PM), and real-time Available status.</p>
              </div>
            </div>
          </div>
        )}

        {/* Slide 8 */}
        {currentSlide === 8 && (
          <div className="space-y-6 slide-active">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-widest">
              🚀 Production Roadmap
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              From Prototype to Enterprise Deployment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-base font-bold text-sky-300">Phase 1: SIS/ERP Connector</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Direct OAuth2 bidirectional sync with university ERPs and Student Information Systems.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-base font-bold text-sky-300">Phase 2: Real-Time Mobile Push</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  FCM Push Notifications for emergency class cancellations, room shifts, and digital hall ticket releases.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-base font-bold text-sky-300">Phase 3: Digital Campus Wallet</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Unified UPI/Smart-card wallet integration for hostel mess, examination fee clearance, and library fines.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Slide 9 */}
        {currentSlide === 9 && (
          <div className="space-y-6 slide-active">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-widest">
              🎉 Thank You Judges & Mentors
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white">
              CampusOne is Ready for Action
            </h2>
            <p className="text-base sm:text-lg text-slate-300 max-w-xl">
              Eliminating paper chaos and physical queues. Let’s dive straight into the live interactive portal demonstration!
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onLaunchLiveDemo}
                className="px-6 py-3 rounded-xl font-extrabold text-sm text-[#0F1F2E] bg-cyan-300 hover:bg-cyan-200 transition-all flex items-center gap-2 shadow-lg"
              >
                <span>Launch Live CampusOne Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentSlide(1)}
                className="px-5 py-3 rounded-xl font-bold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
              >
                ↺ Restart Deck
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Deck Navigation Bar */}
      <div className="h-16 bg-[#0B1722] border-t border-white/10 flex items-center justify-between px-6 sm:px-12">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-white text-sm tracking-wider">CAMPUSONE</span>
          <span className="text-white/30">|</span>
          <span className="text-xs text-slate-400 font-semibold">
            Slide {currentSlide} of {totalSlides}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 1}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/15 disabled:opacity-30 border border-white/10 transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#2463A6] hover:bg-[#1D538D] disabled:opacity-30 transition-colors text-white"
          >
            Next →
          </button>
          <button
            onClick={toggleFullScreen}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-2"
            title="Toggle Fullscreen (F)"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-300 border border-cyan-400/40 hover:bg-cyan-400/10 transition-colors ml-2"
          >
            Close Deck
          </button>
        </div>
      </div>
    </div>
  );
};
