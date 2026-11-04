import React, { useState } from 'react';
import { AdminTeacherEvaluation, exportToExcel } from '../../data/campusStore';
import { 
  ShieldCheck, 
  FileSpreadsheet, 
  Save, 
  Award, 
  CheckCircle2, 
  Filter, 
  Plus, 
  Building2,
  TrendingUp,
  X
} from 'lucide-react';

interface AdminTeacherMarkingSectionProps {
  evaluations: AdminTeacherEvaluation[];
  onUpdateEvaluations: (evals: AdminTeacherEvaluation[]) => void;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminTeacherMarkingSection: React.FC<AdminTeacherMarkingSectionProps> = ({
  evaluations,
  onUpdateEvaluations,
  onShowToast,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [localEvals, setLocalEvals] = useState<AdminTeacherEvaluation[]>(evaluations);
  const [showAddModal, setShowAddModal] = useState(false);

  // New faculty audit state
  const [facultyName, setFacultyName] = useState('');
  const [department, setDepartment] = useState<'CSE' | 'IT' | 'ECE' | 'AIML'>('CSE');
  const [courseAssigned, setCourseAssigned] = useState('');
  const [syllabus, setSyllabus] = useState(90);
  const [attendance, setAttendance] = useState(95);
  const [practicalScore, setPracticalScore] = useState(18);
  const [studentFeedback, setStudentFeedback] = useState(9.0);
  const [remarks, setRemarks] = useState('');

  const departments = ['All', 'CSE', 'IT', 'ECE', 'AIML'];

  const filteredEvals = localEvals.filter(
    (e) => selectedDept === 'All' || e.department === selectedDept
  );

  const handleUpdateField = (
    id: string,
    field: keyof AdminTeacherEvaluation,
    value: string | number
  ) => {
    setLocalEvals((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Recalculate admin score
          if (
            field === 'syllabusCompletion' ||
            field === 'attendanceCompliance' ||
            field === 'practicalVivaTimeliness' ||
            field === 'studentFeedbackRating'
          ) {
            const syl = typeof updated.syllabusCompletion === 'number' ? updated.syllabusCompletion : 90;
            const att = typeof updated.attendanceCompliance === 'number' ? updated.attendanceCompliance : 95;
            const pvt = typeof updated.practicalVivaTimeliness === 'number' ? updated.practicalVivaTimeliness : 18;
            const sf = typeof updated.studentFeedbackRating === 'number' ? updated.studentFeedbackRating : 9;
            // 40% syllabus + 30% attendance + 20% viva timeliness + 10% feedback
            const total = Math.round(
              syl * 0.4 + att * 0.3 + (pvt / 20) * 20 + (sf / 10) * 10
            );
            updated.adminAuditScore = Math.min(100, Math.max(0, total));
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleSaveAll = () => {
    onUpdateEvaluations(localEvals);
    onShowToast('Faculty Academic Evaluations & Marks Audit saved to institutional database!');
  };

  const handleDownloadExcel = () => {
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const headers = [
      'Faculty Name',
      'Department',
      'Assigned Course',
      'Syllabus Completion (%)',
      'Attendance Compliance (%)',
      'Practical & Viva Timeliness (Max 20)',
      'Student Feedback Rating (Max 10)',
      'Overall Academic Audit Score (Max 100)',
      'Audit Status',
      'Dean / Registrar Remarks',
      'Last Audit Date',
    ];

    const rows = filteredEvals.map((item) => [
      item.facultyName,
      item.department,
      item.courseAssigned,
      item.syllabusCompletion,
      item.attendanceCompliance,
      item.practicalVivaTimeliness,
      item.studentFeedbackRating,
      item.adminAuditScore,
      item.auditStatus,
      item.remarks,
      item.lastUpdated,
    ]);

    exportToExcel(`Faculty_Marking_Audit_Report_${dateStr.replace(/ /g, '_')}`, headers, rows);
    onShowToast('Teacher marking report successfully exported in Excel format!');
  };

  const handleAddEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyName.trim() || !courseAssigned.trim()) {
      onShowToast('Please provide faculty name and course details.', 'error');
      return;
    }

    const total = Math.round(syllabus * 0.4 + attendance * 0.3 + (practicalScore / 20) * 20 + (studentFeedback / 10) * 10);
    const newEntry: AdminTeacherEvaluation = {
      id: `eval-${Date.now()}`,
      facultyId: `fac-${Date.now()}`,
      facultyName,
      department,
      courseAssigned,
      syllabusCompletion: syllabus,
      attendanceCompliance: attendance,
      practicalVivaTimeliness: practicalScore,
      studentFeedbackRating: studentFeedback,
      adminAuditScore: total,
      auditStatus: 'Approved by Dean',
      remarks: remarks || 'Evaluated and approved by Office of Registrar',
      lastUpdated: '03 Nov 2026',
    };

    const updated = [newEntry, ...localEvals];
    setLocalEvals(updated);
    onUpdateEvaluations(updated);
    setShowAddModal(false);
    setFacultyName('');
    setCourseAssigned('');
    setRemarks('');
    onShowToast(`Evaluation record added for ${facultyName}!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-50 text-[#17324D]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#17324D]">
              Admin Faculty Academic Evaluation & Marks Audit
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Oversee teacher course delivery, practical & viva marking compliance, and attendance across CSE, IT, ECE, and AIML
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Faculty Entry</span>
          </button>
          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#17324D] hover:bg-[#102438] rounded-xl shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Evaluation</span>
          </button>
          <button
            onClick={handleDownloadExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download in Excel</span>
          </button>
        </div>
      </div>

      {/* Department Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <span className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Department:
        </span>
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedDept === dept
                ? 'bg-[#17324D] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {dept === 'All' ? 'All Branches (4)' : `${dept} Branch`}
          </button>
        ))}
      </div>

      {/* Evaluation Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700 uppercase">
            Faculty Performance & Practical/Viva Marks Quality Audit
          </div>
          <div className="text-xs text-slate-500">
            Edit scores directly and click "Save Evaluation" or "Download in Excel"
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Faculty & Course</th>
                <th className="p-3">Dept</th>
                <th className="p-3 text-center">Syllabus %</th>
                <th className="p-3 text-center">Attendance %</th>
                <th className="p-3 text-center">Viva Timeliness (20)</th>
                <th className="p-3 text-center">Feedback (10)</th>
                <th className="p-3 text-center">Score (100)</th>
                <th className="p-3 text-center">Audit Status</th>
                <th className="p-3">Dean Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {filteredEvals.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{item.facultyName}</div>
                    <div className="text-[11px] text-[#2463A6] font-semibold">{item.courseAssigned}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-700 border border-slate-200">
                      {item.department}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={item.syllabusCompletion}
                      onChange={(e) =>
                        handleUpdateField(item.id, 'syllabusCompletion', parseInt(e.target.value) || 0)
                      }
                      className="w-16 px-2 py-1 text-center font-bold text-xs border border-slate-200 rounded-md focus:border-[#2463A6] focus:outline-none"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={item.attendanceCompliance}
                      onChange={(e) =>
                        handleUpdateField(item.id, 'attendanceCompliance', parseInt(e.target.value) || 0)
                      }
                      className="w-16 px-2 py-1 text-center font-bold text-xs border border-slate-200 rounded-md focus:border-[#2463A6] focus:outline-none"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={item.practicalVivaTimeliness}
                      onChange={(e) =>
                        handleUpdateField(item.id, 'practicalVivaTimeliness', parseInt(e.target.value) || 0)
                      }
                      className="w-16 px-2 py-1 text-center font-bold text-xs border border-slate-200 rounded-md focus:border-[#2463A6] focus:outline-none"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={item.studentFeedbackRating}
                      onChange={(e) =>
                        handleUpdateField(item.id, 'studentFeedbackRating', parseFloat(e.target.value) || 0)
                      }
                      className="w-16 px-2 py-1 text-center font-bold text-xs border border-slate-200 rounded-md focus:border-[#2463A6] focus:outline-none"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-black text-sm text-slate-900">
                      {item.adminAuditScore}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <select
                      value={item.auditStatus}
                      onChange={(e) => handleUpdateField(item.id, 'auditStatus', e.target.value as any)}
                      className="text-xs font-bold rounded-lg border border-slate-200 px-2 py-1 bg-white focus:outline-none"
                    >
                      <option value="Approved by Dean">Approved by Dean</option>
                      <option value="Verified">Verified</option>
                      <option value="Pending Review">Pending Review</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={item.remarks}
                      onChange={(e) => handleUpdateField(item.id, 'remarks', e.target.value)}
                      className="w-full min-w-[150px] px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:border-[#2463A6]"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Faculty Evaluation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-base text-[#17324D]">
                Add Faculty Evaluation Entry
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvaluation} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Faculty Name</label>
                <input
                  type="text"
                  required
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  placeholder="e.g. Dr. Ritu Pahwa"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#2463A6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:border-[#2463A6]"
                  >
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="AIML">AIML</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Course</label>
                  <input
                    type="text"
                    required
                    value={courseAssigned}
                    onChange={(e) => setCourseAssigned(e.target.value)}
                    placeholder="e.g. CSE-101: Programming in C"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#2463A6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Syllabus Completion %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={syllabus}
                    onChange={(e) => setSyllabus(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#2463A6]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Attendance Compliance %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={attendance}
                    onChange={(e) => setAttendance(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#2463A6]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Remarks</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. On-time assessment and commendable student feedback."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#2463A6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-bold text-white bg-[#17324D] hover:bg-[#102438]"
                >
                  Add Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
