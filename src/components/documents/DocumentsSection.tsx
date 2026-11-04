import React, { useState } from 'react';
import { 
  CampusDocument, 
  FeeRecord, 
  DocumentStatus, 
  Role 
} from '../../data/campusStore';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Send, 
  Upload, 
  Download, 
  CreditCard, 
  Printer, 
  ShieldCheck,
  Plus
} from 'lucide-react';

interface DocumentsSectionProps {
  documents: CampusDocument[];
  fees: FeeRecord[];
  userRole: Role;
  onUpdateDocuments: (updated: CampusDocument[]) => void;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documents,
  fees,
  userRole,
  onUpdateDocuments,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'documents' | 'fees'>('documents');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<FeeRecord | null>(null);

  // New Document form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Affidavit' | 'Clearance' | 'Registration' | 'Concession' | 'Identity'>('Clearance');
  const [newRemarks, setNewRemarks] = useState('');

  const isAdmin = userRole === 'admin';

  // Admin verification or rejection
  const handleAdminAction = (docId: string, newStatus: DocumentStatus, feedbackReason?: string) => {
    const updated = documents.map((doc) => {
      if (doc.id === docId) {
        return {
          ...doc,
          status: newStatus,
          verifiedBy: isAdmin ? 'Academic Office (Dean Desk)' : doc.verifiedBy,
          remarks: feedbackReason || (newStatus === 'Verified' ? 'Approved and officially signed by Academic Administration.' : 'Rejected by Administration. Please rectify and re-submit.'),
          updatedAt: 'Just now',
        };
      }
      return doc;
    });

    onUpdateDocuments(updated);
    onShowToast(
      `Document ${newStatus === 'Verified' ? 'Approved & Verified' : 'Marked as Rejected'} successfully!`,
      newStatus === 'Verified' ? 'success' : 'error'
    );
  };

  // Submit new document
  const handleSubmitDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      onShowToast('Please provide a document title', 'error');
      return;
    }

    const newDoc: CampusDocument = {
      id: `doc-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      submissionDate: 'Today (03 Nov 2026)',
      status: 'Submitted',
      refNumber: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      remarks: newRemarks || 'Queued for institutional verification.',
      updatedAt: 'Just now',
    };

    onUpdateDocuments([newDoc, ...documents]);
    setShowUploadModal(false);
    setNewTitle('');
    setNewRemarks('');
    onShowToast('Document submitted successfully! Status set to Submitted.');
  };

  const filteredDocs = statusFilter === 'All' 
    ? documents 
    : documents.filter((d) => d.status === statusFilter);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-50 text-[#2463A6]">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#17324D]">
              My Documents & Fee Clearances
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track status across 4 stages: Submitted, Pending, Verified, and Rejected
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'documents'
                  ? 'bg-[#17324D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📁 Document Tracker ({documents.length})
            </button>
            <button
              onClick={() => setActiveTab('fees')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'fees'
                  ? 'bg-[#17324D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💳 Fee Status & Receipts
            </button>
          </div>

          {activeTab === 'documents' && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#2463A6] hover:bg-[#1D538D] rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Document</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'documents' ? (
        <div className="space-y-4">
          {/* Status Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['All', 'Verified', 'Pending', 'Rejected', 'Submitted'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-[#17324D] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st}
                <span className="ml-1 text-[11px] opacity-80">
                  (
                  {st === 'All'
                    ? documents.length
                    : documents.filter((d) => d.status === st).length}
                  )
                </span>
              </button>
            ))}
          </div>

          {/* Documents List */}
          <div className="grid grid-cols-1 gap-3.5">
            {filteredDocs.map((doc) => {
              const isVerified = doc.status === 'Verified';
              const isPending = doc.status === 'Pending';
              const isRejected = doc.status === 'Rejected';
              const isSubmitted = doc.status === 'Submitted';

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        {doc.refNumber}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {doc.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        Submitted: {doc.submissionDate}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#17324D]">
                      {doc.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <strong>Remarks:</strong> {doc.remarks}
                      {doc.verifiedBy && (
                        <span className="block text-[11px] text-slate-500 mt-1">
                          Authority: {doc.verifiedBy} ({doc.updatedAt})
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Status Badge & Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2.5 shrink-0">
                    <span
                      className={`badge-tag ${
                        isVerified
                          ? 'badge-verified'
                          : isPending
                          ? 'badge-pending'
                          : isRejected
                          ? 'badge-rejected'
                          : 'badge-submitted'
                      }`}
                    >
                      {isVerified && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {isPending && <Clock className="w-3.5 h-3.5" />}
                      {isRejected && <XCircle className="w-3.5 h-3.5" />}
                      {isSubmitted && <Send className="w-3.5 h-3.5" />}
                      <span>{doc.status}</span>
                    </span>

                    {/* Admin Action Buttons */}
                    {isAdmin && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          onClick={() => handleAdminAction(doc.id, 'Verified')}
                          className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors"
                          title="Approve & Verify this document"
                        >
                          ✓ Verify
                        </button>
                        <button
                          onClick={() => handleAdminAction(doc.id, 'Rejected')}
                          className="px-2.5 py-1 text-xs font-bold text-red-800 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                          title="Reject with remarks"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Fee Records & Digital Receipts */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fees.map((f) => (
              <div
                key={f.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      Academic Due
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-extrabold uppercase ${
                        f.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {f.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#17324D]">{f.title}</h3>
                  <div className="text-2xl font-black text-[#17324D] mt-2">
                    ₹{f.amount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Due Date: <strong>{f.dueDate}</strong>
                  </div>
                  {f.paidDate && (
                    <div className="text-xs text-emerald-700 font-medium mt-1">
                      Paid on {f.paidDate} via {f.paymentMode}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  {f.status === 'Paid' ? (
                    <button
                      onClick={() => setSelectedReceipt(f)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-[#17324D] transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#2463A6]" />
                      <span>View Official Receipt</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onShowToast('Demo Payment Gateway: ₹2,500 Exam Fee paid successfully!', 'success')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#2463A6] hover:bg-[#1D538D] text-white shadow-xs transition-colors"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay Examination Fee</span>
                    </button>
                  )}
                  {f.receiptNumber && (
                    <span className="font-mono text-[11px] text-slate-400 font-semibold">
                      #{f.receiptNumber}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#17324D] mb-1">
              Submit Document for Campus Clearance
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              All submissions are timestamped and assigned an official verification reference.
            </p>

            <form onSubmit={handleSubmitDocument} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hostel Clearance Form / Fee Concession Certificate"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#2463A6]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category
                </label>
                <select
                  aria-label="Document Category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#2463A6] bg-white"
                >
                  <option value="Clearance">Clearance Form</option>
                  <option value="Affidavit">Affidavit</option>
                  <option value="Concession">Fee Concession</option>
                  <option value="Registration">Semester Registration</option>
                  <option value="Identity">Identity Card</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Remarks / Supporting Notes
                </label>
                <textarea
                  placeholder="Mention relevant roll number, semester, or certificate authority..."
                  value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#2463A6] h-20"
                />
              </div>

              {/* Mock File Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-[#2463A6] transition-colors cursor-pointer bg-slate-50">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-700">
                  Click to select PDF or scan copy
                </div>
                <div className="text-[11px] text-slate-400">PDF, PNG, JPG up to 10MB</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2463A6] hover:bg-[#1D538D] rounded-lg shadow-xs transition-colors"
                >
                  Submit for Clearance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-300">
            {/* Institution Receipt Header */}
            <div className="text-center pb-4 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-[#17324D] text-white flex items-center justify-center font-extrabold text-base mx-auto mb-2">
                C1
              </div>
              <h3 className="font-extrabold text-base text-[#17324D]">
                CAMPUSONE INSTITUTE OF TECHNOLOGY
              </h3>
              <p className="text-[11px] text-slate-500">
                Official E-Receipt & Accounts Clearance Voucher
              </p>
              <div className="mt-2 inline-block font-mono text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                RECEIPT #{selectedReceipt.receiptNumber}
              </div>
            </div>

            {/* Receipt Details */}
            <div className="py-4 space-y-2 text-xs text-slate-700 border-b border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-400">Student Name:</span>
                <span className="font-bold">Aarav Sharma</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Roll Number:</span>
                <span className="font-mono font-bold">24CSE042</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Academic Term:</span>
                <span>B.Tech CSE - 5th Semester</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Purpose / Fee Head:</span>
                <span className="font-semibold text-right">{selectedReceipt.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Date:</span>
                <span>{selectedReceipt.paidDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Mode:</span>
                <span>{selectedReceipt.paymentMode}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 text-sm">
                <span className="font-bold text-[#17324D]">Total Amount Paid:</span>
                <span className="font-black text-emerald-700">
                  ₹{selectedReceipt.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Digitally Signed
              </span>
              <span>Computer Generated Voucher</span>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onShowToast('Receipt downloaded to downloads folder.');
                  setSelectedReceipt(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#17324D] hover:bg-[#102438] rounded-lg shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
