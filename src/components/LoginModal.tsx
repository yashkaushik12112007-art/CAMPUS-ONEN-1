import React, { useState } from 'react';
import { Role, DEMO_USERS, UserProfile } from '../data/campusStore';
import { 
  Lock, 
  Mail, 
  Key, 
  CheckCircle2, 
  UserPlus, 
  ArrowRight, 
  ShieldCheck, 
  X,
  GraduationCap,
  Sparkles
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onShowToast,
}) => {
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [email, setEmail] = useState('aarav.sharma@campusone.edu');
  const [password, setPassword] = useState('student123');
  const [showCreateAccount, setShowCreateAccount] = useState(false);

  // New Student state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newDept, setNewDept] = useState('');

  if (!isOpen) return null;

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    if (role === 'student') {
      setEmail('aarav.sharma@campusone.edu');
      setPassword('student123');
    } else if (role === 'faculty') {
      setEmail('ritu.pahwa@campusone.edu');
      setPassword('teacher123');
    } else {
      setEmail('admin.desk@campusone.edu');
      setPassword('staff123');
    }
  };

  const handleLoginForm = (e: React.FormEvent) => {
    e.preventDefault();

    // Verify credentials
    let user = DEMO_USERS[selectedRole];
    onLoginSuccess(user);
    onShowToast(`Signed in successfully as ${user.name} (${user.roleLabel})!`);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      onShowToast('Please enter your full name and campus email.', 'error');
      return;
    }

    const initials = newName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const customUser: UserProfile = {
      id: `usr-custom-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: 'student',
      roleLabel: 'Student',
      avatar: initials || 'ST',
      studentId: `STU${Math.floor(202400 + Math.random() * 99)}`,
      rollNumber: `24CSE${Math.floor(100 + Math.random() * 899)}`,
      course: newDept || 'B.Tech Computer Science & Engineering - 5th Sem',
      department: 'Computer Science & Engineering',
    };

    onLoginSuccess(customUser);
    onShowToast(`Student profile created! Welcome to CampusOne, ${newName}.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#17324D] text-white flex items-center justify-center font-extrabold text-xl mx-auto mb-2 shadow-sm">
            C1
          </div>
          <h2 className="text-xl font-bold text-[#17324D]">
            CampusOne Portal Sign In
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select your campus workspace and enter credentials
          </p>
        </div>

        {/* 1-Click Role Selector Cards */}
        <div className="space-y-2 mb-4">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            🔐 Choose how you are entering CampusOne:
          </div>

          {/* Student */}
          <div
            onClick={() => handleSelectRole('student')}
            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
              selectedRole === 'student'
                ? 'bg-blue-50/70 border-[#2463A6] ring-2 ring-blue-100'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-base">
                🎓
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#17324D]">1. Student Workspace</div>
                <div className="text-[11px] text-slate-500">Aarav Sharma • 1st Year B.Tech CSE</div>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                selectedRole === 'student'
                  ? 'bg-[#2463A6] text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {selectedRole === 'student' ? 'Selected' : 'Select'}
            </span>
          </div>

          {/* Teacher */}
          <div
            onClick={() => handleSelectRole('faculty')}
            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
              selectedRole === 'faculty'
                ? 'bg-teal-50/70 border-[#148A8A] ring-2 ring-teal-100'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-base">
                👨‍🏫
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#17324D]">2. Teacher Workspace</div>
                <div className="text-[11px] text-slate-500">Dr. Ritu Pahwa • CSE Faculty & HOD</div>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                selectedRole === 'faculty'
                  ? 'bg-[#148A8A] text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {selectedRole === 'faculty' ? 'Selected' : 'Select'}
            </span>
          </div>

          {/* Admin / Staff */}
          <div
            onClick={() => handleSelectRole('admin')}
            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
              selectedRole === 'admin'
                ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-100'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-base">
                🛡️
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#17324D]">3. Other Staff / Admin</div>
                <div className="text-[11px] text-slate-500">Academic Office & Registrar</div>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                selectedRole === 'admin'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {selectedRole === 'admin' ? 'Selected' : 'Select'}
            </span>
          </div>
        </div>

        {/* Credentials Form */}
        {!showCreateAccount ? (
          <form onSubmit={handleLoginForm} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Campus Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#2463A6] font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#2463A6] font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#17324D] to-[#2463A6] hover:from-[#13283E] hover:to-[#1D538D] shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Log In to Campus Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowCreateAccount(true)}
              className="w-full py-2 rounded-xl font-semibold text-xs text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              ＋ Create / Use Another Campus Profile
            </button>
          </form>
        ) : (
          /* Student Self-Registration Form */
          <form onSubmit={handleCreateStudent} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-[#17324D]">Create Student Account</span>
              <button
                type="button"
                onClick={() => setShowCreateAccount(false)}
                className="text-[11px] font-bold text-[#2463A6] hover:underline"
              >
                Back to Sign In
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Mehta"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                Campus Email
              </label>
              <input
                type="email"
                placeholder="rahul.mehta@campusone.edu"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                Program / Department
              </label>
              <input
                type="text"
                placeholder="e.g. B.Tech IT - 3rd Sem"
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg font-bold text-xs text-white bg-[#2463A6] hover:bg-[#1D538D] shadow-xs transition-colors"
            >
              Create Profile & Enter
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
