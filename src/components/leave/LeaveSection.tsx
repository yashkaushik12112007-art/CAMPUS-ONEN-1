import React, { useState } from 'react';
import { LeaveApplication, UserProfile, Role } from '../../data/campusStore';
import { 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Clock, 
  X, 
  Send, 
  AlertCircle, 
  User, 
  Check, 
  FileText,
  Filter
} from 'lucide-react';

interface LeaveSectionProps {
  leaveApplications: LeaveApplication[];
  currentUser: UserProfile;
  onApplyLeave: (leave: LeaveApplication) => void;
  onUpdateLeaveStatus?: (id: string, status: 'Approved' | 'Rejected', remarks?: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const LeaveSection: React.FC<LeaveSectionProps> = ({
  leaveApplications,
  currentUser,
  onApplyLeave,
  onUpdateLeaveStatus,
  onShowToast,
}) => {
  const [filter, setFilter] = useState<'All' | 'Approved' | 'Pending' | 'Rejected'>('All');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const isFaculty = currentUser.role === 'faculty';
  const isAdmin = currentUser.role === 'admin';

  const [leaveType, setLeaveType] = useState<LeaveApplication['leaveType']>(
    isFaculty ? 'Casual Leave (CL)' : 'Sick / Medical'
  );
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDays, setTotalDays] = useState(1);
  const [reason, setReason] = useState('');
  const [substituteFaculty, setSubstituteFaculty] = useState('Mrs. Yukti Mutreja (Associate Professor, ECE)');

  const filteredLeaves = leaveApplications.filter((leave) => {
    // If student, show only student's leaves
    if (currentUser.role === 'student' && leave.applicantId !== currentUser.id) return false;
    // If faculty, show only faculty's leaves
    if (currentUser.role === 'faculty' && leave.applicantId !== currentUser.id) return false;
    // If admin, show all
    if (filter === 'All') return true;
    return leave.status === filter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      onShowToast('Please fill out all required dates and reason.', 'error');
      return;
    }

    const newLeave: LeaveApplication = {
      id: `leave-${Date.now()}`,
      applicantId: currentUser.id,
      applicantName: currentUser.name,
      applicantRole: currentUser.role as 'student' | 'faculty',
      applicantDetail: isFaculty
        ? `${currentUser.designation || 'Faculty'}, ${currentUser.department || 'CSE'}`
        : `${currentUser.rollNumber || '24CSE042'} • ${currentUser.course || '1st Year B.Tech CSE'}`,
      leaveType,
      startDate,
      endDate,
      totalDays: Math.max(1, totalDays),
      reason,
      substituteFaculty: isFaculty ? substituteFaculty : undefined,
      status: 'Pending',
      appliedOn: 'Today (03 Nov 2026)',
      remarks: 'Application logged in institutional ERP queue',
    };

    onApplyLeave(newLeave);
    setShowModal(false);
    setReason('');
    setStartDate('');
    setEndDate('');
    onShowToast('Leave application submitted successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-50 text-[#2463A6]">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#17324D]">
              {isAdmin
                ? 'Institutional Leave Clearance & Approval Desk'
                : isFaculty
                ? 'Faculty Leave Application & Substitution Desk'
                : 'Student Leave & Absence Application Desk'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin
              ? 'Review and approve/reject leave applications submitted by students and faculty'
              : 'Submit digital leave slips for medical emergencies, official duties, and personal leaves with automatic attendance protection'}
          </p>
        </div>

        {!isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#2463A6] hover:bg-[#1D538D] rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for Leave</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <span className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Status:
        </span>
        {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === tab
                ? 'bg-[#17324D] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Leave Cards List */}
      <div className="space-y-3">
        {filteredLeaves.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
            No leave records found under this filter.
          </div>
        ) : (
          filteredLeaves.map((leave) => (
            <div
              key={leave.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      leave.applicantRole === 'faculty'
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {leave.applicantRole === 'faculty' ? 'Faculty Leave' : 'Student Leave'}
                  </span>
                  <span className="font-bold text-sm text-[#17324D]">{leave.leaveType}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      leave.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : leave.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {leave.status}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-800">
                  Applicant: {leave.applicantName} ({leave.applicantDetail})
                </div>

                <div className="text-xs text-slate-600">
                  Duration: <strong>{leave.startDate}</strong> to <strong>{leave.endDate}</strong> ({leave.totalDays} day{leave.totalDays > 1 ? 's' : ''})
                </div>

                <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 max-w-2xl">
                  <strong>Reason:</strong> {leave.reason}
                </div>

                {leave.substituteFaculty && (
                  <div className="text-xs text-cyan-900 font-semibold">
                    Lecture Substitution: {leave.substituteFaculty}
                  </div>
                )}

                {leave.remarks && (
                  <div className="text-xs text-slate-500 italic">
                    Administrative Remarks: {leave.remarks}
                  </div>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="text-[11px] text-slate-400 font-mono">
                  Applied on: {leave.appliedOn}
                </div>

                {leave.reviewedBy && (
                  <div className="text-xs font-bold text-emerald-700">
                    Sign-Off: {leave.reviewedBy}
                  </div>
                )}

                {isAdmin && leave.status === 'Pending' && onUpdateLeaveStatus && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        onUpdateLeaveStatus(leave.id, 'Approved', 'Approved by Registrar & Student Affairs');
                        onShowToast(`Leave for ${leave.applicantName} approved!`);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => {
                        onUpdateLeaveStatus(leave.id, 'Rejected', 'Insufficient justification or clash with scheduled test');
                        onShowToast(`Leave for ${leave.applicantName} rejected.`, 'error');
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-xs"
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for applying leave */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-base text-[#17324D]">
                {isFaculty ? 'Apply for Faculty Leave' : 'Apply for Student Leave'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Leave Category</label>
                {isFaculty ? (
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:border-[#2463A6]"
                  >
                    <option value="Casual Leave (CL)">Casual Leave (CL)</option>
                    <option value="Earned Leave (EL)">Earned Leave (EL)</option>
                    <option value="Academic / On Duty (OD)">Academic / On Duty (OD - Conference / FDP)</option>
                    <option value="Sick / Medical">Sick / Medical Leave</option>
                  </select>
                ) : (
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:border-[#2463A6]"
                  >
                    <option value="Sick / Medical">Sick / Medical Leave (Doctor slip verification)</option>
                    <option value="Duty / Hackathon">Duty / Hackathon Leave (Official campus credit)</option>
                    <option value="Personal Emergency">Personal / Family Emergency</option>
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#2463A6]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#2463A6]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Total Number of Days</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={totalDays}
                  onChange={(e) => setTotalDays(parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#2463A6]"
                />
              </div>

              {isFaculty && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Designated Colleague for Lecture Substitution
                  </label>
                  <select
                    value={substituteFaculty}
                    onChange={(e) => setSubstituteFaculty(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:border-[#2463A6]"
                  >
                    <option value="Mrs. Yukti Mutreja (Associate Professor, ECE)">Mrs. Yukti Mutreja (Associate Professor, ECE)</option>
                    <option value="Mr. Ankush (Assistant Professor, CSE)">Mr. Ankush (Assistant Professor, CSE)</option>
                    <option value="Dr. Deeksha (Associate Professor, Applied Sciences)">Dr. Deeksha (Associate Professor, Applied Sciences)</option>
                    <option value="Mr. Ashish Tyagi (Assistant Professor, Mech)">Mr. Ashish Tyagi (Assistant Professor, Mech)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Reason for Absence</label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="State clear reasons (e.g. participation in hackathon finals, medical illness, or personal emergency)..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#2463A6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-bold text-white bg-[#2463A6] hover:bg-[#1D538D]"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
