import React, { useState, useEffect } from 'react';
import { 
  loadSavedState, 
  saveState, 
  resetAllState, 
  CampusOneState, 
  Role, 
  DEMO_USERS, 
  UserProfile,
  FacultyMember,
  AttendanceSubject,
  CampusDocument,
  TeacherCourse,
  NoticeItem,
  LeaveApplication,
  AdminTeacherEvaluation
} from './data/campusStore';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { TomorrowCard } from './components/TomorrowCard';
import { TimetableSection } from './components/academics/TimetableSection';
import { AttendanceSection } from './components/academics/AttendanceSection';
import { DocumentsSection } from './components/documents/DocumentsSection';
import { FacultyFinderSection } from './components/faculty/FacultyFinderSection';
import { CanteenSection } from './components/canteen/CanteenSection';
import { NoticesSection } from './components/notices/NoticesSection';
import { EventsSection } from './components/events/EventsSection';
import { LostFoundSection } from './components/lostfound/LostFoundSection';
import { TeacherWorkspace } from './components/teacher/TeacherWorkspace';
import { LeaveSection } from './components/leave/LeaveSection';
import { AdminTeacherMarkingSection } from './components/admin/AdminTeacherMarkingSection';
import { CampusBotModal } from './components/CampusBotModal';
import { PresentationModal } from './components/PresentationModal';
import { LoginModal } from './components/LoginModal';
import { 
  Building2, 
  GraduationCap, 
  ShieldAlert, 
  ArrowRight, 
  Calendar, 
  Sparkles, 
  UtensilsCrossed, 
  Users, 
  CheckCircle2, 
  X,
  FileCheck2,
  FileText,
  LogOut,
  PlaneTakeoff,
  Award,
  FileSpreadsheet
} from 'lucide-react';

export default function App() {
  const [state, setState] = useState<CampusOneState>(loadSavedState);
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [botInitialPrompt, setBotInitialPrompt] = useState<string | undefined>();
  const [isDeckOpen, setIsDeckOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Sync to localStorage on state change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  const handleLogout = () => {
    setIsProfileModalOpen(false);
    setIsLoginModalOpen(true);
    showToast('Signed out of session. Please choose your role or enter credentials.', 'error');
  };

  // Switch demo role
  const handleRoleChange = (role: Role) => {
    const newUser = DEMO_USERS[role];
    setState((prev) => ({
      ...prev,
      currentUser: newUser,
    }));
    // Redirect to relevant dashboard
    setCurrentTab('dashboard');
    showToast(`Switched to ${newUser.roleLabel} mode (${newUser.name})`);
  };

  // Reset demo data
  const handleResetData = () => {
    const fresh = resetAllState();
    setState(fresh);
    setCurrentTab('dashboard');
    showToast('Demo data reset to pristine initial state for hackathon judges.');
  };

  // Open CampusBot with query
  const handleAskBot = (prompt: string) => {
    setBotInitialPrompt(prompt);
    setIsBotOpen(true);
  };

  // Leave Management Handlers
  const handleApplyLeave = (newLeave: LeaveApplication) => {
    setState((prev) => ({
      ...prev,
      leaveApplications: [newLeave, ...prev.leaveApplications],
    }));
  };

  const handleUpdateLeaveStatus = (id: string, status: 'Approved' | 'Rejected', remarks?: string) => {
    setState((prev) => ({
      ...prev,
      leaveApplications: prev.leaveApplications.map((l) =>
        l.id === id
          ? {
              ...l,
              status,
              remarks: remarks || (status === 'Approved' ? 'Approved by Registrar & HoD.' : 'Declined per university regulations.'),
              reviewedBy: 'Office of the Registrar',
            }
          : l
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col font-sans">
      {/* Official Hackathon Demo Disclaimer Banner */}
      <div className="demo-disclaimer-banner">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-amber-400 text-[#17324D]">
            Demo Mode
          </span>
          <span className="font-medium">
            DEMO DATA – NOT OFFICIAL. Internal Hackathon Prototype (4 November 2026).
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDeckOpen(true)}
            className="text-[11px] font-bold text-cyan-300 hover:underline flex items-center gap-1"
          >
            <span>Pitch Deck (9 Slides)</span>
          </button>
          <span className="text-white/30 hidden sm:inline">|</span>
          <button
            onClick={handleResetData}
            className="text-[11px] font-semibold text-slate-300 hover:text-white transition-colors hidden sm:inline"
          >
            ↺ Reset Demo Data
          </button>
        </div>
      </div>

      {/* Main Top Header */}
      <Header
        currentUser={state.currentUser}
        onRoleChange={handleRoleChange}
        onResetData={handleResetData}
        onOpenDeck={() => setIsDeckOpen(true)}
        onOpenBot={() => {
          setBotInitialPrompt(undefined);
          setIsBotOpen(true);
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onNavigateHome={() => setCurrentTab('home')}
        onLogout={handleLogout}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          currentUser={state.currentUser}
          onLogout={handleLogout}
        />

        {/* Main Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {/* View 1: Campus Home (Public Gateway) */}
          {currentTab === 'home' && (
            <div className="space-y-8">
              {/* Hero Banner */}
              <div className="rounded-2xl bg-gradient-to-br from-[#17324D] via-[#1D4366] to-[#2463A6] text-white p-8 sm:p-10 shadow-lg border border-slate-700/40 relative overflow-hidden">
                <div className="max-w-2xl relative z-10 space-y-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#148A8A] text-white">
                    Unified Campus Platform
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
                    Your Entire College Experience in One Place
                  </h1>
                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                    Eliminating fragmented notice boards, physical office queues, and scattered schedules. CampusOne provides role-based workspaces for students, faculty, and administration.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => setCurrentTab('dashboard')}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs text-[#17324D] bg-white hover:bg-slate-100 shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>Open Role Dashboard →</span>
                    </button>
                    <button
                      onClick={() => setCurrentTab('faculty')}
                      className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
                    >
                      Locate Faculty Cabins
                    </button>
                    <button
                      onClick={() => setCurrentTab('notices')}
                      className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
                    >
                      Campus Circulars
                    </button>
                  </div>
                </div>
              </div>

              {/* Three Workspaces Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:border-[#148A8A] transition-all">
                  <div className="text-3xl mb-3">🏛️</div>
                  <h3 className="text-base font-bold text-[#17324D]">1. Campus Home</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Public institutional repository for official circulars, upcoming campus workshops, live cafeteria menu, and 20 faculty cabin locations.
                  </p>
                  <button
                    onClick={() => setCurrentTab('notices')}
                    className="mt-4 text-xs font-bold text-[#148A8A] hover:underline"
                  >
                    Browse Notices →
                  </button>
                </div>

                <div className="bg-white p-6 rounded-xl border-t-4 border-t-[#2463A6] border border-slate-200 shadow-xs hover:border-[#2463A6] transition-all">
                  <div className="text-3xl mb-3">🎓</div>
                  <h3 className="text-base font-bold text-[#17324D]">2. Student Portal</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Personalized daily timetable, 75% attendance health tracker, internal marks, pending document checklist, and fee receipts.
                  </p>
                  <button
                    onClick={() => {
                      handleRoleChange('student');
                      setCurrentTab('dashboard');
                    }}
                    className="mt-4 text-xs font-bold text-[#2463A6] hover:underline"
                  >
                    Enter Student Portal →
                  </button>
                </div>

                <div className="bg-white p-6 rounded-xl border-t-4 border-t-[#148A8A] border border-slate-200 shadow-xs hover:border-[#148A8A] transition-all">
                  <div className="text-3xl mb-3">🛡️</div>
                  <h3 className="text-base font-bold text-[#17324D]">3. Faculty & Admin Portal</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Verify or reject submitted student documents, broadcast official circulars, update office availability, and mark 40-student attendance.
                  </p>
                  <button
                    onClick={() => {
                      handleRoleChange('admin');
                      setCurrentTab('dashboard');
                    }}
                    className="mt-4 text-xs font-bold text-[#148A8A] hover:underline"
                  >
                    Enter Admin Portal →
                  </button>
                </div>
              </div>

              {/* Live Feeds Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="font-bold text-base text-[#17324D]">
                        📢 Latest Official Notices
                      </h3>
                      <p className="text-xs text-slate-500">Verified announcements across all departments</p>
                    </div>
                    <button
                      onClick={() => setCurrentTab('notices')}
                      className="text-xs font-bold text-[#2463A6] hover:underline"
                    >
                      View All ({state.notices.length})
                    </button>
                  </div>

                  <div className="space-y-3">
                    {state.notices.slice(0, 3).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => setCurrentTab('notices')}
                        className="p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-[#2463A6] border border-blue-200">
                            {n.category}
                          </span>
                          <span className="text-[11px] text-slate-400">{n.date}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800">{n.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{n.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-4">
                  {/* Canteen Specials Highlight */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                        <h4 className="font-bold text-xs text-[#17324D]">Canteen Specials</h4>
                      </div>
                      <button
                        onClick={() => setCurrentTab('canteen')}
                        className="text-xs font-bold text-[#2463A6] hover:underline"
                      >
                        Order
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-50 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-800">Special Veg Thali Meal</div>
                          <div className="text-[10px] text-slate-400">Lunch • ★ 4.9</div>
                        </div>
                        <span className="font-black text-[#17324D]">₹90</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-800">Cold Coffee with Ice Cream</div>
                          <div className="text-[10px] text-slate-400">Beverages • ★ 4.9</div>
                        </div>
                        <span className="font-black text-[#17324D]">₹40</span>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Hackathon Card */}
                  <div className="bg-gradient-to-br from-[#17324D] to-[#2463A6] text-white p-5 rounded-xl shadow-xs">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-400 text-[#17324D] uppercase">
                      HackCampus 2026
                    </span>
                    <h4 className="font-bold text-sm mt-2 text-white">48-Hour National Hackathon</h4>
                    <p className="text-xs text-slate-200 mt-1">12-14 Nov • Cash Prizes ₹1,50,000</p>
                    <button
                      onClick={() => setCurrentTab('events')}
                      className="mt-3 w-full py-1.5 rounded-lg font-bold text-xs bg-white text-[#17324D] hover:bg-slate-100 transition-colors"
                    >
                      RSVP Free Entry Pass →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View 2: Role Dashboard */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Student Role: Tomorrow at College Flagship Card + Quick Actions */}
              {state.currentUser.role === 'student' && (
                <>
                  {/* Flagship Differentiator: Tomorrow at College */}
                  <TomorrowCard
                    onOpenTimetable={() => setCurrentTab('timetable')}
                    onOpenAttendance={() => setCurrentTab('academics')}
                    onOpenDocuments={() => setCurrentTab('documents')}
                    onOpenBot={() => setIsBotOpen(true)}
                    attendanceData={state.attendance}
                  />

                  {/* Quick Campus Shortcuts */}
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
                    <div className="mb-4">
                      <h3 className="text-base font-bold text-[#17324D]">
                        🚀 Campus Quick Actions
                      </h3>
                      <p className="text-xs text-slate-500">Jump directly into your daily academic workflows</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <button
                        onClick={() => setCurrentTab('documents')}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-[#2463A6] hover:bg-slate-50 transition-all font-bold text-[#17324D] text-left flex items-center gap-2"
                      >
                        <span>📁 My Document Tracker</span>
                      </button>
                      <button
                        onClick={() => setCurrentTab('timetable')}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-[#2463A6] hover:bg-slate-50 transition-all font-bold text-[#17324D] text-left flex items-center gap-2"
                      >
                        <span>📅 Full Class Timetable</span>
                      </button>
                      <button
                        onClick={() => setCurrentTab('academics')}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-[#2463A6] hover:bg-slate-50 transition-all font-bold text-[#17324D] text-left flex items-center gap-2"
                      >
                        <span>📊 75% Attendance Health</span>
                      </button>
                      <button
                        onClick={() => setCurrentTab('faculty')}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-[#2463A6] hover:bg-slate-50 transition-all font-bold text-[#17324D] text-left flex items-center gap-2"
                      >
                        <span>👨‍🏫 Locate Faculty Cabins</span>
                      </button>
                      <button
                        onClick={() => setCurrentTab('canteen')}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-[#2463A6] hover:bg-slate-50 transition-all font-bold text-[#17324D] text-left flex items-center gap-2"
                      >
                        <span>🍽️ Cafeteria Live Menu</span>
                      </button>
                      <button
                        onClick={() => setCurrentTab('lost-found')}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-[#2463A6] hover:bg-slate-50 transition-all font-bold text-[#17324D] text-left flex items-center gap-2"
                      >
                        <span>🔍 Campus Lost & Found</span>
                      </button>
                      <button
                        onClick={() => setCurrentTab('events')}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-[#2463A6] hover:bg-slate-50 transition-all font-bold text-[#17324D] text-left flex items-center gap-2"
                      >
                        <span>🎟️ Event Registrations</span>
                      </button>
                      <button
                        onClick={() => setCurrentTab('documents')}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-[#2463A6] hover:bg-slate-50 transition-all font-bold text-[#17324D] text-left flex items-center gap-2"
                      >
                        <span>💳 Fee Receipts Viewer</span>
                      </button>
                      <button
                        onClick={() => setCurrentTab('apply-leave')}
                        className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 hover:border-[#2463A6] transition-all font-bold text-[#17324D] text-left flex items-center gap-2"
                      >
                        <span>✈️ Apply for Student Leave</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Teacher Role Dashboard */}
              {state.currentUser.role === 'faculty' && (
                <div className="space-y-6">
                  {/* Teacher Welcome & Overview Card */}
                  <div className="rounded-2xl bg-gradient-to-r from-[#17324D] to-[#1F466E] text-white p-6 sm:p-7 shadow-md">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#148A8A] text-white uppercase">
                          Faculty Management Portal
                        </span>
                        <h2 className="text-2xl font-bold mt-1 text-white">
                          Welcome, {state.currentUser.name} 👋
                        </h2>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {state.currentUser.designation || 'Professor & HOD'}, {state.currentUser.department || 'Computer Science & Engineering'} • Cabin {state.currentUser.cabin || 'Block B-304'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentTab('teacher-attendance')}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-[#17324D] bg-white hover:bg-slate-100 shadow-xs"
                        >
                          Mark Class Attendance (40) →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Teaching Tomorrow Highlights */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                    <h3 className="text-base font-bold text-[#17324D] mb-4">
                      👨‍🏫 Tomorrow's Teaching Schedule (Wednesday)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                        <div className="flex items-center justify-between text-xs font-bold text-[#2463A6]">
                          <span>09:00 - 10:00 AM</span>
                          <span>LT-204</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#17324D] mt-1">
                          CS-101: Programming in C (1st Year, Sec A)
                        </h4>
                        <div className="text-xs text-slate-500 mt-1">
                          40 Enrolled Students • Pointers & Memory Allocation Lecture
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200">
                        <div className="flex items-center justify-between text-xs font-bold text-[#148A8A]">
                          <span>02:00 - 04:00 PM</span>
                          <span>Block B-304</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#17324D] mt-1">
                          Official Student Office Hours & Mentorship
                        </h4>
                        <div className="text-xs text-slate-500 mt-1">
                          Walk-in consultations & project guide reviews
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Teacher Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div
                      onClick={() => setCurrentTab('teacher-attendance')}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-[#2463A6] hover:shadow-md cursor-pointer transition-all group"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📋</div>
                      <h4 className="font-bold text-sm text-[#17324D] flex items-center justify-between">
                        <span>Mark Class Attendance</span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">4 Branches</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        40 students per course (CSE, IT, ECE, AIML). 1-click batch marking, save & Excel export.
                      </p>
                    </div>

                    <div
                      onClick={() => setCurrentTab('teacher-practical-viva')}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-[#2463A6] hover:shadow-md cursor-pointer transition-all group"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🔬</div>
                      <h4 className="font-bold text-sm text-[#17324D] flex items-center justify-between">
                        <span>Practical & Viva Marking</span>
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Out of 45</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Grade Practical (20), Viva (15), Lab Record (10) for 40 students each with Excel download.
                      </p>
                    </div>

                    <div
                      onClick={() => setCurrentTab('teacher-salary')}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-[#2463A6] hover:shadow-md cursor-pointer transition-all group"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">💵</div>
                      <h4 className="font-bold text-sm text-[#17324D] flex items-center justify-between">
                        <span>Monthly Salary Slips</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">6 Months</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        October 2026 slip (₹1,52,900) & past 5 months history with itemized tax and PDF slip.
                      </p>
                    </div>

                    <div
                      onClick={() => setCurrentTab('apply-leave')}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-[#2463A6] hover:shadow-md cursor-pointer transition-all group"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">✈️</div>
                      <h4 className="font-bold text-sm text-[#17324D] flex items-center justify-between">
                        <span>Apply for Faculty Leave</span>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">OD / CL</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Submit Casual Leave, Academic Duty (OD) or Medical leave with colleague substitution.
                      </p>
                    </div>

                    <div
                      onClick={() => setCurrentTab('teacher-notices')}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-[#2463A6] hover:shadow-md cursor-pointer transition-all group"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📑</div>
                      <h4 className="font-bold text-sm text-[#17324D] flex items-center justify-between">
                        <span>Faculty Circulars</span>
                        <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded">Directives</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Targeted UGC research grants, end-term evaluation deadlines, and committee notices.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Role Dashboard */}
              {state.currentUser.role === 'admin' && (
                <div className="space-y-6">
                  <div className="rounded-2xl bg-gradient-to-r from-[#17324D] to-[#2463A6] text-white p-6 sm:p-7 shadow-md flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-400 text-[#17324D] uppercase">
                        Administrative Command
                      </span>
                      <h2 className="text-2xl font-bold mt-1 text-white">
                        Office of the Registrar & Student Welfare
                      </h2>
                      <p className="text-xs text-slate-200 mt-0.5">
                        Manage document clearances, broadcast circulars, and monitor campus services
                      </p>
                    </div>

                    <button
                      onClick={() => setCurrentTab('documents')}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#17324D] bg-white hover:bg-slate-100 shadow-xs"
                    >
                      Review Pending Documents ({state.documents.filter((d) => d.status === 'Pending' || d.status === 'Submitted').length}) →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                      <div className="text-xs font-bold uppercase text-slate-400">Total Clearances</div>
                      <div className="text-2xl font-black text-[#17324D] mt-1">
                        {state.documents.length} Records
                      </div>
                      <div className="text-xs text-emerald-700 font-bold mt-1">
                        {state.documents.filter((d) => d.status === 'Verified').length} Verified
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                      <div className="text-xs font-bold uppercase text-slate-400">Faculty Cabins Active</div>
                      <div className="text-2xl font-black text-[#2463A6] mt-1">
                        20 Professors
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Across 4 Engineering Depts</div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                      <div className="text-xs font-bold uppercase text-slate-400">Cafeteria Tokens Today</div>
                      <div className="text-2xl font-black text-orange-600 mt-1">
                        {state.canteenOrders.length} Issued
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Zero physical queue congestion</div>
                    </div>
                  </div>

                  {/* Direct Document Verification Table for Admin */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
                    <h3 className="font-bold text-base text-[#17324D] mb-3">
                      ⚡ Quick Action: Verify Student Submissions
                    </h3>
                    <div className="space-y-3">
                      {state.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3.5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <span className="font-mono font-bold text-slate-400">{doc.refNumber}</span>
                            <span className="font-bold text-slate-800 ml-2">{doc.title}</span>
                            <div className="text-slate-500 mt-0.5">{doc.remarks}</div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-2 py-0.5 rounded font-extrabold text-[10px] bg-slate-100 text-slate-700">
                              {doc.status}
                            </span>
                            {doc.status !== 'Verified' && (
                              <button
                                onClick={() => {
                                  const updated = state.documents.map((d) =>
                                    d.id === doc.id
                                      ? { ...d, status: 'Verified' as const, remarks: 'Approved by Registrar Office.' }
                                      : d
                                  );
                                  setState((prev) => ({ ...prev, documents: updated }));
                                  showToast(`Document ${doc.refNumber} approved!`);
                                }}
                                className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-md"
                              >
                                ✓ Verify
                              </button>
                            )}
                            {doc.status !== 'Rejected' && (
                              <button
                                onClick={() => {
                                  const updated = state.documents.map((d) =>
                                    d.id === doc.id
                                      ? { ...d, status: 'Rejected' as const, remarks: 'Missing required attestation stamp.' }
                                      : d
                                  );
                                  setState((prev) => ({ ...prev, documents: updated }));
                                  showToast(`Document ${doc.refNumber} marked Rejected.`, 'error');
                                }}
                                className="px-2.5 py-1 text-xs font-bold text-red-800 bg-red-100 hover:bg-red-200 rounded-md"
                              >
                                ✕ Reject
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Admin Command Quick Portals */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      onClick={() => setCurrentTab('admin-teacher-marking')}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-[#2463A6] hover:shadow-md cursor-pointer transition-all flex items-start gap-3.5 group"
                    >
                      <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform">
                        <Award className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-[#17324D]">
                            Faculty Performance & Marking System
                          </h4>
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            Audit Deck
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Audit syllabus %, attendance %, viva timeliness, student feedback out of 100 with Excel export.
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => setCurrentTab('apply-leave')}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-[#2463A6] hover:shadow-md cursor-pointer transition-all flex items-start gap-3.5 group"
                    >
                      <div className="p-3 rounded-lg bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
                        <PlaneTakeoff className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-[#17324D]">
                            Staff & Student Leave Approvals
                          </h4>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            {state.leaveApplications.filter((l) => l.status === 'Pending').length} Pending
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Review, sanction or reject faculty academic duties, casual leaves, and student hackathon permissions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* View 3: Class Timetable */}
          {currentTab === 'timetable' && (
            <TimetableSection slots={state.timetable} />
          )}

          {/* View 4: Attendance & Marks */}
          {currentTab === 'academics' && (
            <AttendanceSection
              attendanceData={state.attendance}
              marksData={state.marks}
              onUpdateAttendance={(updated) =>
                setState((prev) => ({ ...prev, attendance: updated }))
              }
            />
          )}

          {/* View 5: My Documents & Fees */}
          {currentTab === 'documents' && (
            <DocumentsSection
              documents={state.documents}
              fees={state.fees}
              userRole={state.currentUser.role}
              onUpdateDocuments={(updated) =>
                setState((prev) => ({ ...prev, documents: updated }))
              }
              onShowToast={showToast}
            />
          )}

          {/* View 6: Faculty Finder */}
          {currentTab === 'faculty' && (
            <FacultyFinderSection
              facultyList={state.faculty}
              userRole={state.currentUser.role}
              onUpdateFaculty={(updated) =>
                setState((prev) => ({ ...prev, faculty: updated }))
              }
              onAskBotAboutFaculty={(name) =>
                handleAskBot(`Where is ${name}'s cabin and office hours?`)
              }
              onShowToast={showToast}
            />
          )}

          {/* View 7: Notices & Circulars */}
          {currentTab === 'notices' && (
            <NoticesSection
              notices={state.notices}
              userRole={state.currentUser.role}
              onAddNotice={(n) =>
                setState((prev) => ({ ...prev, notices: [n, ...prev.notices] }))
              }
              onShowToast={showToast}
            />
          )}

          {/* View 8: Events & Workshops */}
          {currentTab === 'events' && (
            <EventsSection
              events={state.events}
              onToggleRsvp={(id) => {
                const updated = state.events.map((e) =>
                  e.id === id ? { ...e, isRsvp: !e.isRsvp } : e
                );
                setState((prev) => ({ ...prev, events: updated }));
              }}
              onShowToast={showToast}
            />
          )}

          {/* View 9: Canteen Live Menu & Pickup Tokens */}
          {currentTab === 'canteen' && (
            <CanteenSection
              canteenItems={state.canteen}
              orders={state.canteenOrders}
              onPlaceOrder={(ord) =>
                setState((prev) => ({
                  ...prev,
                  canteenOrders: [ord, ...prev.canteenOrders],
                }))
              }
              onShowToast={showToast}
            />
          )}

          {/* View 10: Lost & Found */}
          {currentTab === 'lost-found' && (
            <LostFoundSection
              items={state.lostFound}
              onAddItem={(item) =>
                setState((prev) => ({ ...prev, lostFound: [item, ...prev.lostFound] }))
              }
              onShowToast={showToast}
            />
          )}

          {/* View 11: Teacher Attendance */}
          {currentTab === 'teacher-attendance' && (
            <TeacherWorkspace
              viewMode="attendance"
              courses={state.teacherCourses}
              salarySlips={state.teacherSalarySlips}
              currentUser={state.currentUser}
              leaveApplications={state.leaveApplications}
              notices={state.notices}
              onUpdateCourses={(c) =>
                setState((prev) => ({ ...prev, teacherCourses: c }))
              }
              onApplyLeave={handleApplyLeave}
              onShowToast={showToast}
            />
          )}

          {/* View 12: Teacher Practical & Viva Marking */}
          {currentTab === 'teacher-practical-viva' && (
            <TeacherWorkspace
              viewMode="practical-viva"
              courses={state.teacherCourses}
              salarySlips={state.teacherSalarySlips}
              currentUser={state.currentUser}
              leaveApplications={state.leaveApplications}
              notices={state.notices}
              onUpdateCourses={(c) =>
                setState((prev) => ({ ...prev, teacherCourses: c }))
              }
              onApplyLeave={handleApplyLeave}
              onShowToast={showToast}
            />
          )}

          {/* View 13: Teacher Salary */}
          {currentTab === 'teacher-salary' && (
            <TeacherWorkspace
              viewMode="salary"
              courses={state.teacherCourses}
              salarySlips={state.teacherSalarySlips}
              currentUser={state.currentUser}
              leaveApplications={state.leaveApplications}
              notices={state.notices}
              onUpdateCourses={(c) =>
                setState((prev) => ({ ...prev, teacherCourses: c }))
              }
              onApplyLeave={handleApplyLeave}
              onShowToast={showToast}
            />
          )}

          {/* View 14: Teacher Notices */}
          {currentTab === 'teacher-notices' && (
            <TeacherWorkspace
              viewMode="notices"
              courses={state.teacherCourses}
              salarySlips={state.teacherSalarySlips}
              currentUser={state.currentUser}
              leaveApplications={state.leaveApplications}
              notices={state.notices}
              onUpdateCourses={(c) =>
                setState((prev) => ({ ...prev, teacherCourses: c }))
              }
              onApplyLeave={handleApplyLeave}
              onShowToast={showToast}
            />
          )}

          {/* View 15: Apply for Leave (Teacher & Student) */}
          {currentTab === 'apply-leave' && (
            <LeaveSection
              leaveApplications={state.leaveApplications}
              currentUser={state.currentUser}
              onApplyLeave={handleApplyLeave}
              onUpdateLeaveStatus={handleUpdateLeaveStatus}
              onShowToast={showToast}
            />
          )}

          {/* View 16: Admin Teacher Marking & Audit Section */}
          {currentTab === 'admin-teacher-marking' && (
            <AdminTeacherMarkingSection
              evaluations={state.adminTeacherEvaluations}
              onUpdateEvaluations={(evals) =>
                setState((prev) => ({ ...prev, adminTeacherEvaluations: evals }))
              }
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Floating CampusBot AI Launcher Button */}
      <button
        onClick={() => {
          setBotInitialPrompt(undefined);
          setIsBotOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#17324D] to-[#2463A6] hover:from-[#13283E] hover:to-[#1D538D] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-xl flex items-center gap-2.5 transition-all transform hover:scale-105 border border-white/20"
        title="Open CampusBot AI Assistant"
      >
        <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
        <span className="font-extrabold text-xs tracking-wide hidden sm:inline">
          CampusBot AI
        </span>
      </button>

      {/* CampusBot AI Modal */}
      <CampusBotModal
        isOpen={isBotOpen}
        onClose={() => setIsBotOpen(false)}
        initialPrompt={botInitialPrompt}
      />

      {/* Pitch Deck Modal */}
      <PresentationModal
        isOpen={isDeckOpen}
        onClose={() => setIsDeckOpen(false)}
        onLaunchLiveDemo={() => {
          setIsDeckOpen(false);
          setCurrentTab('dashboard');
        }}
      />

      {/* User Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-300 text-center">
            <div className="w-16 h-16 rounded-full bg-[#17324D] text-white text-xl font-bold flex items-center justify-center mx-auto mb-3 shadow-md">
              {state.currentUser.avatar}
            </div>
            <h3 className="text-lg font-bold text-[#17324D]">{state.currentUser.name}</h3>
            <p className="text-xs text-slate-500 font-semibold">{state.currentUser.roleLabel}</p>
            <div className="text-xs font-mono text-slate-400 mt-0.5">{state.currentUser.email}</div>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
              {state.currentUser.studentId && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Student ID:</span>
                  <span className="font-mono font-bold">{state.currentUser.studentId}</span>
                </div>
              )}
              {state.currentUser.rollNumber && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Roll Number:</span>
                  <span className="font-mono font-bold">{state.currentUser.rollNumber}</span>
                </div>
              )}
              {state.currentUser.course && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Program:</span>
                  <span className="font-medium text-right">{state.currentUser.course}</span>
                </div>
              )}
              {state.currentUser.cabin && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Cabin:</span>
                  <span className="font-bold">{state.currentUser.cabin}</span>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="w-1/2 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
              >
                Close Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-1/2 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200 flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login & Role Selection Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          setState((prev) => ({ ...prev, currentUser: user }));
          setIsLoginModalOpen(false);
          setCurrentTab('dashboard');
        }}
        onShowToast={showToast}
      />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2 text-white ${
              toast.type === 'error'
                ? 'bg-red-600 border-red-700'
                : 'bg-emerald-700 border-emerald-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
