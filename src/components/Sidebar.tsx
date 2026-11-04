import React from 'react';
import { UserProfile, Role } from '../data/campusStore';
import {
  Home,
  LayoutDashboard,
  CalendarDays,
  Calendar,
  CheckSquare,
  FileText,
  Users,
  Bell,
  Ticket,
  UtensilsCrossed,
  HelpCircle,
  FileCheck2,
  DollarSign,
  ClipboardList,
  Sparkles,
  Search,
  LogOut,
} from 'lucide-react';

export type NavTab =
  | 'home'
  | 'dashboard'
  | 'timetable'
  | 'academics'
  | 'documents'
  | 'faculty'
  | 'notices'
  | 'events'
  | 'canteen'
  | 'lost-found'
  | 'teacher-attendance'
  | 'teacher-practical-viva'
  | 'teacher-salary'
  | 'teacher-notices'
  | 'apply-leave'
  | 'admin-teacher-marking';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentUser: UserProfile;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
}) => {
  const role = currentUser.role;

  const NavItem = ({
    tab,
    label,
    icon: Icon,
    badge,
  }: {
    tab: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }) => {
    const isActive = currentTab === tab;
    return (
      <button
        onClick={() => onSelectTab(tab)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all select-none text-left ${
          isActive
            ? 'bg-[#2463A6] text-white shadow-xs'
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
          <span>{label}</span>
        </div>
        {badge && (
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              isActive
                ? 'bg-white/20 text-white'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Scrollable nav list */}
      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        {/* Core Campus Workspaces */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Campus Workspaces
          </div>
          <div className="space-y-1">
            <NavItem tab="home" label="Campus Home" icon={Home} />
            <NavItem
              tab="dashboard"
              label={
                role === 'student'
                  ? 'Student Dashboard'
                  : role === 'faculty'
                  ? 'Teacher Dashboard'
                  : 'Admin Control Center'
              }
              icon={LayoutDashboard}
              badge={role === 'student' ? 'Tomorrow' : undefined}
            />
          </div>
        </div>

        {/* Role-Specific Workspaces */}
        {role === 'student' && (
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Student Academic Portal
            </div>
            <div className="space-y-1">
              <NavItem tab="timetable" label="Class Timetable" icon={CalendarDays} />
              <NavItem
                tab="academics"
                label="Attendance & Marks"
                icon={CheckSquare}
                badge="75% Health"
              />
              <NavItem tab="documents" label="My Documents & Fees" icon={FileText} />
              <NavItem tab="apply-leave" label="Apply for Leave" icon={Calendar} badge="Leave Slip" />
            </div>
          </div>
        )}

        {role === 'faculty' && (
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Faculty Management
            </div>
            <div className="space-y-1">
              <NavItem
                tab="teacher-attendance"
                label="Attendance (4 Branches)"
                icon={ClipboardList}
                badge="Excel Export"
              />
              <NavItem
                tab="teacher-practical-viva"
                label="Practical & Viva (40)"
                icon={CheckSquare}
                badge="Save & Excel"
              />
              <NavItem tab="teacher-salary" label="Monthly Salary Slips" icon={DollarSign} badge="Multi-Month" />
              <NavItem tab="apply-leave" label="Apply for Leave" icon={Calendar} badge="Substitute" />
              <NavItem tab="teacher-notices" label="Faculty Circulars" icon={Bell} />
            </div>
          </div>
        )}

        {role === 'admin' && (
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Administrative Control
            </div>
            <div className="space-y-1">
              <NavItem
                tab="documents"
                label="Verify Documents"
                icon={FileCheck2}
                badge="Live Action"
              />
              <NavItem
                tab="admin-teacher-marking"
                label="Faculty Marks & Audit"
                icon={ClipboardList}
                badge="Excel Audit"
              />
              <NavItem
                tab="apply-leave"
                label="Leave Approvals"
                icon={Calendar}
                badge="Approve/Reject"
              />
              <NavItem tab="notices" label="Notice Broadcaster" icon={Bell} />
            </div>
          </div>
        )}

        {/* Campus Services - Shared */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Campus Services
          </div>
          <div className="space-y-1">
            <NavItem
              tab="faculty"
              label="Faculty Finder"
              icon={Users}
              badge="20 Cabins"
            />
            <NavItem tab="notices" label="Notices & Circulars" icon={Bell} />
            <NavItem tab="events" label="Events & Workshops" icon={Ticket} />
            <NavItem
              tab="canteen"
              label="Canteen Live Menu"
              icon={UtensilsCrossed}
              badge="Pickup Token"
            />
            <NavItem tab="lost-found" label="Lost & Found" icon={HelpCircle} />
          </div>
        </div>
      </div>

      {/* Mini Profile Card in Sidebar Footer */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#17324D] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {currentUser.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-800 truncate">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {currentUser.roleLabel}
            </div>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors shrink-0"
            title="Sign out of CampusOne"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
