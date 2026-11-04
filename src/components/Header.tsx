import React from 'react';
import { Role, UserProfile, DEMO_USERS } from '../data/campusStore';
import { 
  GraduationCap, 
  Sparkles, 
  RotateCcw, 
  Presentation, 
  User, 
  ChevronDown,
  LogOut 
} from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  onRoleChange: (role: Role) => void;
  onResetData: () => void;
  onOpenDeck: () => void;
  onOpenBot: () => void;
  onOpenProfile: () => void;
  onNavigateHome: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onRoleChange,
  onResetData,
  onOpenDeck,
  onOpenBot,
  onOpenProfile,
  onNavigateHome,
  onLogout,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={onNavigateHome}
          >
            <div className="w-10 h-10 rounded-xl bg-[#17324D] text-white flex items-center justify-center font-extrabold text-lg shadow-sm border border-slate-700/30">
              C1
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[#17324D]">
                  CampusOne
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  v6 Final
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Your Entire College in One Place
              </p>
            </div>
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Presentation Deck Launcher */}
            <button
              onClick={onOpenDeck}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
              title="Open 9-Slide Hackathon Pitch Deck (Press F for fullscreen)"
            >
              <Presentation className="w-4 h-4 text-[#2463A6]" />
              <span className="hidden sm:inline">Pitch Deck</span>
            </button>

            {/* CampusBot AI Assistant Button */}
            <button
              onClick={onOpenBot}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#17324D] to-[#2463A6] hover:from-[#13283E] hover:to-[#1D538D] rounded-lg shadow-xs transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>CampusBot AI</span>
            </button>

            {/* Demo Role Switcher */}
            <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50 text-xs">
              <span className="text-slate-500 font-medium px-1.5 hidden lg:inline">
                Role:
              </span>
              <select
                aria-label="Select Demo Role"
                value={currentUser.role}
                onChange={(e) => onRoleChange(e.target.value as Role)}
                className="bg-transparent font-bold text-[#17324D] outline-none cursor-pointer pr-1"
              >
                <option value="student">🎓 Student (Aarav)</option>
                <option value="faculty">👨‍🏫 Teacher (Dr. Sunita)</option>
                <option value="admin">🛡️ Admin (Registrar)</option>
              </select>
            </div>

            {/* Reset Demo Data Button */}
            <button
              onClick={onResetData}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Reset all demo data to initial state"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* User Mini Avatar */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:opacity-85 transition-opacity"
              title="View profile details"
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 text-[#17324D] font-bold text-xs flex items-center justify-center border border-slate-300">
                {currentUser.avatar}
              </div>
              <div className="text-left hidden xl:block">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">
                  {currentUser.roleLabel}
                </div>
              </div>
            </button>

            {/* Logout Button Aside Profile */}
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors ml-0.5"
              title="Sign out of CampusOne"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-bold">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
