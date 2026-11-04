import React, { useState } from 'react';
import { 
  TeacherCourse, 
  TeacherSalarySlip, 
  UserProfile, 
  StudentRosterEntry, 
  LeaveApplication,
  NoticeItem,
  exportToExcel 
} from '../../data/campusStore';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  DollarSign, 
  FileText, 
  Check, 
  X, 
  Send, 
  Building2,
  Printer,
  Download,
  Award,
  Sparkles,
  BookOpen,
  ClipboardCheck,
  FileSpreadsheet,
  AlertTriangle,
  Plus
} from 'lucide-react';

interface TeacherWorkspaceProps {
  viewMode: 'attendance' | 'practical-viva' | 'salary' | 'notices' | 'leave';
  courses: TeacherCourse[];
  salarySlips: TeacherSalarySlip[];
  currentUser: UserProfile;
  leaveApplications: LeaveApplication[];
  notices: NoticeItem[];
  onUpdateCourses: (courses: TeacherCourse[]) => void;
  onApplyLeave: (leave: LeaveApplication) => void;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const TeacherWorkspace: React.FC<TeacherWorkspaceProps> = ({
  viewMode,
  courses,
  salarySlips,
  currentUser,
  leaveApplications,
  notices,
  onUpdateCourses,
  onApplyLeave,
  onShowToast,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'tc-cse');
  const [selectedMonthId, setSelectedMonthId] = useState<string>(salarySlips[0]?.id || 'sal-2026-10');

  // Leave application modal / form state
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveApplication['leaveType']>('Casual Leave (CL)');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDays, setTotalDays] = useState(1);
  const [substituteFaculty, setSubstituteFaculty] = useState('Mrs. Yukti Mutreja (Associate Professor, ECE)');
  const [reason, setReason] = useState('');

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const selectedSalarySlip = salarySlips.find((s) => s.id === selectedMonthId) || salarySlips[0];

  // 1. Toggle student attendance
  const handleToggleStudent = (studentId: string) => {
    const updated = courses.map((course) => {
      if (course.id === selectedCourseId) {
        return {
          ...course,
          students: course.students.map((stu) =>
            stu.id === studentId ? { ...stu, isPresent: !stu.isPresent } : stu
          ),
        };
      }
      return course;
    });
    onUpdateCourses(updated);
  };

  // Bulk mark all
  const handleMarkAll = (status: boolean) => {
    const updated = courses.map((course) => {
      if (course.id === selectedCourseId) {
        return {
          ...course,
          students: course.students.map((stu) => ({ ...stu, isPresent: status })),
        };
      }
      return course;
    });
    onUpdateCourses(updated);
    onShowToast(`All 40 students marked as ${status ? 'PRESENT' : 'ABSENT'} for ${selectedCourse.code}.`);
  };

  // Save attendance
  const handleSaveAttendance = () => {
    const presentCount = selectedCourse.students.filter((s) => s.isPresent).length;
    onShowToast(
      `Attendance Saved! ${presentCount}/40 students marked present for ${selectedCourse.name} (${selectedCourse.branch}). Stored in institutional database.`
    );
  };

  // Export attendance to Excel (.csv)
  const handleDownloadAttendanceExcel = () => {
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const headers = [
      'Roll Number',
      'Student Name',
      'Branch / Department',
      'Course Code',
      'Course Name',
      'Date',
      'Attendance Status',
    ];
    const rows = selectedCourse.students.map((stu) => [
      stu.roll,
      stu.name,
      selectedCourse.branch,
      selectedCourse.code,
      selectedCourse.name,
      dateStr,
      stu.isPresent ? 'Present' : 'Absent',
    ]);

    exportToExcel(
      `Attendance_${selectedCourse.branch}_${selectedCourse.code}_${dateStr.replace(/ /g, '_')}`,
      headers,
      rows
    );
    onShowToast(`Excel attendance sheet generated for ${selectedCourse.branch} (${selectedCourse.students.length} students)!`);
  };

  // 2. Practical & Viva Marks Handler
  const handleUpdateStudentMarks = (
    studentId: string,
    field: 'practicalMarks' | 'vivaMarks' | 'recordMarks',
    value: number
  ) => {
    const updated = courses.map((course) => {
      if (course.id === selectedCourseId) {
        return {
          ...course,
          students: course.students.map((stu) => {
            if (stu.id === studentId) {
              const practicalMarks = field === 'practicalMarks' ? Math.min(20, Math.max(0, value)) : stu.practicalMarks;
              const vivaMarks = field === 'vivaMarks' ? Math.min(15, Math.max(0, value)) : stu.vivaMarks;
              const recordMarks = field === 'recordMarks' ? Math.min(10, Math.max(0, value)) : stu.recordMarks;
              const total = practicalMarks + vivaMarks + recordMarks;
              const grade = total >= 40 ? 'A+' : total >= 35 ? 'A' : total >= 30 ? 'B+' : total >= 25 ? 'B' : 'C';

              return {
                ...stu,
                practicalMarks,
                vivaMarks,
                recordMarks,
                totalPracticalViva: total,
                grade,
              };
            }
            return stu;
          }),
        };
      }
      return course;
    });
    onUpdateCourses(updated);
  };

  const handleSavePracticalVivaMarks = () => {
    onShowToast(
      `Practical & Viva Marks Saved for ${selectedCourse.name} (${selectedCourse.branch}). 40 records submitted to Academic Records Section.`
    );
  };

  const handleDownloadPracticalVivaExcel = () => {
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const headers = [
      'Roll Number',
      'Student Name',
      'Branch',
      'Course Code',
      'Course Name',
      'Practical Performance (Max 20)',
      'Viva Voce (Max 15)',
      'Lab Record & Journal (Max 10)',
      'Total Marks (Max 45)',
      'Letter Grade',
      'Teacher Evaluation Remarks',
    ];
    const rows = selectedCourse.students.map((stu) => [
      stu.roll,
      stu.name,
      selectedCourse.branch,
      selectedCourse.code,
      selectedCourse.name,
      stu.practicalMarks,
      stu.vivaMarks,
      stu.recordMarks,
      stu.totalPracticalViva,
      stu.grade,
      stu.remarks || 'Evaluated',
    ]);

    exportToExcel(
      `Practical_Viva_Marks_${selectedCourse.branch}_${selectedCourse.code}_${dateStr.replace(/ /g, '_')}`,
      headers,
      rows
    );
    onShowToast(`Excel practical & viva marksheet generated for ${selectedCourse.branch}!`);
  };

  // 3. Submit Leave Application
  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      onShowToast('Please complete all leave fields.', 'error');
      return;
    }

    const newLeave: LeaveApplication = {
      id: `leave-fac-${Date.now()}`,
      applicantId: currentUser.id,
      applicantName: currentUser.name,
      applicantRole: 'faculty',
      applicantDetail: `${currentUser.designation || 'Professor & HOD'}, ${currentUser.department || 'CSE'}`,
      leaveType,
      startDate,
      endDate,
      totalDays: Math.max(1, totalDays),
      reason,
      substituteFaculty,
      status: 'Pending',
      appliedOn: 'Today (03 Nov 2026)',
      remarks: 'Submitted for Dean / Registrar approval',
    };

    onApplyLeave(newLeave);
    setShowLeaveModal(false);
    setReason('');
    setStartDate('');
    setEndDate('');
    onShowToast('Leave application submitted successfully for administrative approval!');
  };

  // Branch Course Switcher Component
  const CourseTabs = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {courses.map((c) => {
        const isSelected = c.id === selectedCourseId;
        return (
          <button
            key={c.id}
            onClick={() => setSelectedCourseId(c.id)}
            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
              isSelected
                ? 'bg-[#17324D] text-white border-[#17324D] shadow-md ring-2 ring-[#2463A6]/40'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  isSelected ? 'bg-[#2463A6] text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {c.branch} Branch
              </span>
              <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                {c.code}
              </span>
            </div>
            <div className="font-bold text-sm truncate mt-2">{c.name}</div>
            <div className="text-xs opacity-75 mt-1 flex items-center justify-between">
              <span>{c.room}</span>
              <span className="font-bold">40 Students</span>
            </div>
          </button>
        );
      })}
    </div>
  );

  // VIEW 1: ATTENDANCE ROSTER
  if (viewMode === 'attendance') {
    const presentCount = selectedCourse.students.filter((s) => s.isPresent).length;
    const attendancePercentage = ((presentCount / selectedCourse.students.length) * 100).toFixed(1);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-teal-50 text-[#148A8A]">
                <Users className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-[#17324D]">
                Department-Wise Class Attendance (40 Students)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select one of the 4 department courses (CSE, IT, ECE, AIML) to mark attendance, save, and download in Excel
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleMarkAll(true)}
              className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
            >
              ✓ Mark All Present
            </button>
            <button
              onClick={() => handleMarkAll(false)}
              className="px-3 py-1.5 text-xs font-bold text-red-800 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
            >
              ✕ Mark All Absent
            </button>
            <button
              onClick={handleSaveAttendance}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#148A8A] hover:bg-[#107070] rounded-lg shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Save Attendance</span>
            </button>
            <button
              onClick={handleDownloadAttendanceExcel}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Download in Excel</span>
            </button>
          </div>
        </div>

        {/* 4 Course Selection Tabs */}
        <CourseTabs />

        {/* Selected Course Stats Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-base font-bold text-[#17324D] flex items-center gap-2">
              <span>{selectedCourse.name}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-100 text-[#2463A6] font-bold">
                {selectedCourse.code} • {selectedCourse.branch}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Schedule: <strong>{selectedCourse.schedule}</strong> • Room: <strong>{selectedCourse.room}</strong>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              Present: {presentCount} / 40
            </span>
            <span className="text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
              Attendance: {attendancePercentage}%
            </span>
          </div>
        </div>

        {/* 40-Student Roster Grid */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              {selectedCourse.branch} Student Roster ({selectedCourse.students.length} Enrolled)
            </div>
            <div className="text-xs text-slate-500">
              Click any card to toggle Present / Absent
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
            {selectedCourse.students.map((stu, idx) => (
              <div
                key={stu.id}
                onClick={() => handleToggleStudent(stu.id)}
                className={`p-3 rounded-xl border cursor-pointer select-none transition-all flex items-center justify-between ${
                  stu.isPresent
                    ? 'bg-emerald-50/70 border-emerald-300 hover:bg-emerald-100/70'
                    : 'bg-red-50/70 border-red-300 hover:bg-red-100/70'
                }`}
              >
                <div>
                  <div className="text-[10px] font-mono font-bold text-slate-500">
                    #{idx + 1} • {stu.roll}
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                    {stu.name}
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs ${
                    stu.isPresent ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                  }`}
                >
                  {stu.isPresent ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // VIEW 2: PRACTICAL & VIVA MARKING SYSTEM
  if (viewMode === 'practical-viva') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-blue-50 text-[#2463A6]">
                <Award className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-[#17324D]">
                Practical & Viva Voce Marking System
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Grade 40 students per course across Practical Performance (20), Viva Concept (15), and Lab Record (10). Save and download in Excel.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSavePracticalVivaMarks}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#2463A6] hover:bg-[#1D538D] rounded-lg shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Save Marks Roster</span>
            </button>
            <button
              onClick={handleDownloadPracticalVivaExcel}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Download in Excel</span>
            </button>
          </div>
        </div>

        {/* 4 Course Selection Tabs */}
        <CourseTabs />

        {/* Marks Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="text-xs font-bold text-slate-700 uppercase">
              {selectedCourse.branch} Practical Marks Roster (Max Total: 45 Marks)
            </div>
            <div className="text-xs font-bold text-slate-500">
              Auto-calculates total marks and assigned letter grade
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-12 text-center">#</th>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3 text-center">Practical (20)</th>
                  <th className="p-3 text-center">Viva Voce (15)</th>
                  <th className="p-3 text-center">Lab Record (10)</th>
                  <th className="p-3 text-center">Total (45)</th>
                  <th className="p-3 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {selectedCourse.students.map((stu, idx) => (
                  <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-mono font-bold text-slate-600">{stu.roll}</td>
                    <td className="p-3 font-bold text-slate-900">{stu.name}</td>
                    
                    {/* Practical performance input */}
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={stu.practicalMarks}
                        onChange={(e) =>
                          handleUpdateStudentMarks(stu.id, 'practicalMarks', parseInt(e.target.value) || 0)
                        }
                        className="w-16 px-2 py-1 text-center font-bold text-xs border border-slate-200 rounded-md focus:border-[#2463A6] focus:outline-none"
                      />
                    </td>

                    {/* Viva Voce input */}
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="15"
                        value={stu.vivaMarks}
                        onChange={(e) =>
                          handleUpdateStudentMarks(stu.id, 'vivaMarks', parseInt(e.target.value) || 0)
                        }
                        className="w-16 px-2 py-1 text-center font-bold text-xs border border-slate-200 rounded-md focus:border-[#2463A6] focus:outline-none"
                      />
                    </td>

                    {/* Lab Record input */}
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={stu.recordMarks}
                        onChange={(e) =>
                          handleUpdateStudentMarks(stu.id, 'recordMarks', parseInt(e.target.value) || 0)
                        }
                        className="w-16 px-2 py-1 text-center font-bold text-xs border border-slate-200 rounded-md focus:border-[#2463A6] focus:outline-none"
                      />
                    </td>

                    {/* Total */}
                    <td className="p-3 text-center font-black text-slate-900">
                      {stu.totalPracticalViva} / 45
                    </td>

                    {/* Grade Badge */}
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-black text-[10px] ${
                          stu.grade === 'A+'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : stu.grade === 'A'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {stu.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // VIEW 3: MULTI-MONTH SALARY SLIPS
  if (viewMode === 'salary') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <DollarSign className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-[#17324D]">
                Faculty Compensation & Monthly Salary Slips
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select any past month to view the full pay voucher, allowances, deductions, and tax withholdings
            </p>
          </div>

          {/* Month Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Month:</span>
            <select
              value={selectedMonthId}
              onChange={(e) => setSelectedMonthId(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-[#17324D] focus:outline-none focus:border-[#2463A6]"
            >
              {salarySlips.map((slip) => (
                <option key={slip.id} value={slip.id}>
                  {slip.month} ({slip.status})
                </option>
              ))}
            </select>

            <button
              onClick={() => onShowToast(`Payslip for ${selectedSalarySlip.month} downloaded as PDF!`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#17324D] hover:bg-[#102438] rounded-xl shadow-xs transition-colors shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Official Payslip Voucher Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-300 shadow-md max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="font-black text-lg text-[#17324D]">
                CAMPUSONE INSTITUTE OF ENGINEERING & TECHNOLOGY
              </div>
              <div className="text-xs text-slate-500">
                Official Monthly Salary Voucher & Tax Withholding Slip
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-500">Period: {selectedSalarySlip.month}</div>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Status: {selectedSalarySlip.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <div className="text-slate-400">Employee Name</div>
              <div className="font-bold text-slate-800">{currentUser.name}</div>
            </div>
            <div>
              <div className="text-slate-400">Designation</div>
              <div className="font-bold text-slate-800">{currentUser.designation || 'Professor & HOD'}</div>
            </div>
            <div>
              <div className="text-slate-400">Department</div>
              <div className="font-bold text-slate-800">{currentUser.department || 'Computer Science'}</div>
            </div>
            <div>
              <div className="text-slate-400">Bank Ref / NEFT ID</div>
              <div className="font-mono text-slate-700">{selectedSalarySlip.bankRef}</div>
            </div>
            <div>
              <div className="text-slate-400">PF Account No.</div>
              <div className="font-mono text-slate-700">PF-DL-2018-0912</div>
            </div>
            <div>
              <div className="text-slate-400">Credited Date</div>
              <div className="font-mono font-bold text-emerald-700">{selectedSalarySlip.creditDate}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-xs">
            {/* Earnings */}
            <div className="space-y-2">
              <div className="font-bold text-slate-700 uppercase tracking-wider pb-1 border-b border-slate-200">
                Earnings (A)
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Basic Pay:</span>
                <span className="font-bold">₹{selectedSalarySlip.basicPay.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dearness Allowance (DA 30%):</span>
                <span>₹{selectedSalarySlip.da.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">House Rent Allowance (HRA 24%):</span>
                <span>₹{selectedSalarySlip.hra.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transport & Special Allowance:</span>
                <span>₹{(selectedSalarySlip.travelAllowance + selectedSalarySlip.specialAllowance).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-sm text-[#17324D]">
                <span>Gross Earnings:</span>
                <span>₹{selectedSalarySlip.grossPay.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Deductions */}
            <div className="space-y-2">
              <div className="font-bold text-slate-700 uppercase tracking-wider pb-1 border-b border-slate-200">
                Deductions (B)
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Provident Fund (EPF):</span>
                <span>₹{selectedSalarySlip.providentFund.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Income Tax (TDS Section 192):</span>
                <span>₹{selectedSalarySlip.taxDeduction.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Professional Tax:</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-sm text-red-700">
                <span>Total Deductions:</span>
                <span>₹{selectedSalarySlip.totalDeductions.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Net Credit Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-800 uppercase">
                Net Salary Credited to Bank Account
              </div>
              <div className="text-2xl font-black text-emerald-950 mt-0.5">
                ₹{selectedSalarySlip.netCredit.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-right text-xs text-emerald-800">
              <div className="font-bold">HDFC Bank Salary A/C</div>
              <div className="text-[11px] opacity-75">Credited on {selectedSalarySlip.creditDate}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VIEW 4: FACULTY LEAVE APPLICATION
  if (viewMode === 'leave') {
    const facultyLeaves = leaveApplications.filter((l) => l.applicantRole === 'faculty');

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Calendar className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-[#17324D]">
                Faculty Leave Application & Substitution Desk
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Apply for Casual Leave (CL), Earned Leave (EL), or Academic On-Duty (OD) with designated lecture substitution
            </p>
          </div>

          <button
            onClick={() => setShowLeaveModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#2463A6] hover:bg-[#1D538D] rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for New Leave</span>
          </button>
        </div>

        {/* Leave Application History Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="text-xs font-bold text-slate-700 uppercase">
              Submitted Faculty Leave Applications ({facultyLeaves.length})
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {facultyLeaves.map((leave) => (
              <div key={leave.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
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
                  <div className="text-slate-600">
                    Duration: <strong>{leave.startDate}</strong> to <strong>{leave.endDate}</strong> ({leave.totalDays} day{leave.totalDays > 1 ? 's' : ''})
                  </div>
                  <div className="text-slate-500">Reason: {leave.reason}</div>
                  {leave.substituteFaculty && (
                    <div className="text-cyan-800 font-medium">
                      Substituted By: {leave.substituteFaculty}
                    </div>
                  )}
                  {leave.remarks && <div className="text-slate-400 italic">Remark: {leave.remarks}</div>}
                </div>

                <div className="text-right shrink-0">
                  <div className="text-slate-400 text-[11px]">Applied On: {leave.appliedOn}</div>
                  {leave.reviewedBy && (
                    <div className="text-emerald-700 font-bold mt-1">Reviewed By: {leave.reviewedBy}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Applying Leave */}
        {showLeaveModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <h3 className="font-bold text-base text-[#17324D]">
                  Submit Faculty Leave Application
                </h3>
                <button
                  onClick={() => setShowLeaveModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitLeave} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Leave Type</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:border-[#2463A6]"
                  >
                    <option value="Casual Leave (CL)">Casual Leave (CL)</option>
                    <option value="Earned Leave (EL)">Earned Leave (EL)</option>
                    <option value="Academic / On Duty (OD)">Academic / On Duty (OD - Conference)</option>
                    <option value="Sick / Medical">Sick / Medical Leave</option>
                  </select>
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
                  <label className="block font-bold text-slate-700 mb-1">
                    Designated Substitute Faculty for Teaching Duties
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

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reason for Leave</label>
                  <textarea
                    rows={3}
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Provide detailed justification (e.g. conference keynote presentation or personal commitment)..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#2463A6]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLeaveModal(false)}
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
  }

  // VIEW 5: FACULTY CIRCULARS
  const facultyNotices = notices.filter((n) => n.audience === 'faculty' || n.audience === 'all');

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-blue-50 text-[#2463A6]">
            <FileText className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-[#17324D]">
              Faculty Communication Desk & Official Circulars
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Exclusive administrative directives, research funding notifications, and examiner rosters for professors
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {facultyNotices.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-[#2463A6] border border-blue-200">
                  {item.category}
                </span>
                <span className="text-xs text-slate-400">{item.date}</span>
                <span className="text-xs text-slate-500 font-medium">• By {item.author}</span>
              </div>
              <h3 className="text-base font-bold text-[#17324D]">{item.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.content}</p>
            </div>
            {item.hasAttachment && (
              <button
                onClick={() => onShowToast(`Opened faculty attachment: ${item.attachmentName || 'document.pdf'}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors shrink-0"
              >
                <FileText className="w-3.5 h-3.5 text-[#2463A6]" />
                <span>{item.attachmentName || 'Attachment.pdf'}</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
