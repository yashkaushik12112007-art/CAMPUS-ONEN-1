/**
 * CampusOne - Unified Campus Store & State Management
 * Persistent offline-first architecture with dual localStorage + API sync.
 */

export type Role = 'student' | 'faculty' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  roleLabel: string;
  avatar: string;
  studentId?: string;
  rollNumber?: string;
  course?: string;
  department?: string;
  cabin?: string;
  designation?: string;
}

export interface TimetableSlot {
  id: string;
  time: string;
  subject: string;
  code: string;
  faculty: string;
  room: string;
  type: 'Theory' | 'Lab' | 'Tutorial';
  day: string; // 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
}

export interface AttendanceSubject {
  id: string;
  code: string;
  name: string;
  faculty: string;
  attended: number;
  total: number;
  credits: number;
}

export interface InternalMark {
  id: string;
  subjectCode: string;
  subjectName: string;
  midTerm: number; // max 30
  practical: number; // max 20
  projectAssignment: number; // max 20
  attendanceMarks: number; // max 10
  total: number; // max 80
  letterGrade: string;
}

export type DocumentStatus = 'Submitted' | 'Pending' | 'Verified' | 'Rejected';

export interface CampusDocument {
  id: string;
  title: string;
  category: 'Affidavit' | 'Clearance' | 'Registration' | 'Concession' | 'Identity';
  submissionDate: string;
  status: DocumentStatus;
  refNumber: string;
  remarks: string;
  fileUrl?: string;
  verifiedBy?: string;
  updatedAt: string;
}

export interface FeeRecord {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  receiptNumber?: string;
  paidDate?: string;
  paymentMode?: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  department: 'CSE' | 'IT' | 'ECE' | 'AI ML';
  designation: string;
  cabin: string;
  officeHours: string;
  email: string;
  status: 'Available' | 'In Lecture' | 'In Office' | 'On Leave';
  specialization: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  category: 'Academic' | 'Examination' | 'Administration' | 'Cultural' | 'Urgent' | 'Faculty Circular';
  date: string;
  author: string;
  content: string;
  isPinned: boolean;
  hasAttachment: boolean;
  attachmentName?: string;
  audience: 'all' | 'students' | 'faculty';
}

export interface EventItem {
  id: string;
  title: string;
  category: 'Hackathon' | 'Tech Fest' | 'Workshop' | 'Cultural';
  date: string;
  venue: string;
  organizer: string;
  description: string;
  isRsvp: boolean;
  badge: string;
}

export interface CanteenItem {
  id: string;
  name: string;
  category: 'Meals' | 'Snacks' | 'Beverages' | 'Specials';
  price: number;
  isVeg: boolean;
  prepTime: string;
  rating: number;
  inStock: boolean;
  description: string;
}

export interface LostFoundItem {
  id: string;
  title: string;
  category: 'Electronics' | 'Accessories' | 'Documents' | 'Books';
  locationFound: string;
  date: string;
  claimAt: string; // Strict privacy: Central Security Desk, never personal phone
  status: 'Available' | 'Claimed';
  description: string;
}

export interface StudentRosterEntry {
  id: string;
  roll: string;
  name: string;
  isPresent: boolean;
  // Practical & Viva Marks
  practicalMarks: number;     // max 20
  vivaMarks: number;          // max 15
  recordMarks: number;        // max 10
  totalPracticalViva: number; // max 45
  grade: string;              // 'A+', 'A', 'B+', 'B', 'C', 'F'
  remarks?: string;
}

export interface TeacherCourse {
  id: string;
  code: string;
  name: string;
  branch: 'CSE' | 'IT' | 'ECE' | 'AIML';
  department: string;
  semester: string;
  batch: string;
  room: string;
  schedule: string;
  enrolledStudentsCount: number;
  students: StudentRosterEntry[];
}

export interface TeacherSalarySlip {
  id: string;
  month: string;
  year: number;
  basicPay: number;
  da: number;
  hra: number;
  travelAllowance: number;
  specialAllowance: number;
  grossPay: number;
  providentFund: number;
  taxDeduction: number;
  totalDeductions: number;
  netCredit: number;
  status: 'Credited' | 'Processing';
  bankRef: string;
  creditDate: string;
}

export interface LeaveApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantRole: 'student' | 'faculty';
  applicantDetail: string; // Roll number or Designation
  leaveType: 'Sick / Medical' | 'Duty / Hackathon' | 'Casual Leave (CL)' | 'Earned Leave (EL)' | 'Academic / On Duty (OD)' | 'Personal Emergency';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  substituteFaculty?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
  reviewedBy?: string;
  remarks?: string;
}

export interface AdminTeacherEvaluation {
  id: string;
  facultyId: string;
  facultyName: string;
  department: 'CSE' | 'IT' | 'ECE' | 'AIML';
  courseAssigned: string;
  syllabusCompletion: number; // percentage (e.g. 94)
  attendanceCompliance: number; // percentage (e.g. 96)
  practicalVivaTimeliness: number; // score out of 20
  studentFeedbackRating: number; // score out of 10
  adminAuditScore: number; // total score out of 100
  auditStatus: 'Approved by Dean' | 'Verified' | 'Pending Review';
  remarks: string;
  lastUpdated: string;
}

// Utility to download CSV in Excel format
export function exportToExcel(filename: string, headers: string[], rows: (string | number)[][]): void {
  const sanitize = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = '\uFEFF' + [
    headers.map(sanitize).join(','),
    ...rows.map((row) => row.map(sanitize).join(',')),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 20 Faculty Members (4 departments x 5 members)
export const INITIAL_FACULTY: FacultyMember[] = [
  // Core Engineering Faculty
  {
    id: 'fac-cse-1',
    name: 'Dr. Ritu Pahwa',
    department: 'CSE',
    designation: 'Professor & HOD',
    cabin: 'Block B-304 (3rd Floor)',
    officeHours: 'Mon - Thu: 2:00 PM - 4:00 PM',
    email: 'ritu.pahwa@campusone.edu',
    status: 'Available',
    specialization: 'Programming in C, Compilers & Data Structures',
  },
  {
    id: 'fac-cse-2',
    name: 'Mrs. Yukti Mutreja',
    department: 'ECE',
    designation: 'Associate Professor',
    cabin: 'Block B-310 (3rd Floor)',
    officeHours: 'Mon - Fri: 11:00 AM - 1:00 PM',
    email: 'yukti.mutreja@campusone.edu',
    status: 'In Lecture',
    specialization: 'Digital Electronics, Microprocessors & Logic Design',
  },
  {
    id: 'fac-cse-3',
    name: 'Mr. Ankush',
    department: 'CSE',
    designation: 'Assistant Professor',
    cabin: 'Block B-312 (3rd Floor)',
    officeHours: 'Tue - Fri: 3:00 PM - 5:00 PM',
    email: 'ankush@campusone.edu',
    status: 'Available',
    specialization: 'System Modelling Techniques, UML & Simulation',
  },
  {
    id: 'fac-cse-4',
    name: 'Dr. Deeksha',
    department: 'CSE',
    designation: 'Associate Professor',
    cabin: 'Block C-201 (2nd Floor)',
    officeHours: 'Wed - Fri: 10:00 AM - 12:00 PM',
    email: 'deeksha@campusone.edu',
    status: 'In Office',
    specialization: 'Engineering Physics, Optics & Solid State Electronics',
  },
  {
    id: 'fac-cse-5',
    name: 'Mr. Ashish Tyagi',
    department: 'CSE',
    designation: 'Assistant Professor',
    cabin: 'Block D-101 (1st Floor)',
    officeHours: 'Mon - Wed: 1:00 PM - 3:00 PM',
    email: 'ashish.tyagi@campusone.edu',
    status: 'Available',
    specialization: 'Engineering Mechanics, Statics, Dynamics & Kinematics',
  },

  // Information Technology (IT)
  {
    id: 'fac-it-1',
    name: 'Dr. Amitav Ghosh',
    department: 'IT',
    designation: 'Professor & HOD',
    cabin: 'Block C-201 (2nd Floor)',
    officeHours: 'Mon - Thu: 11:00 AM - 1:00 PM',
    email: 'amitav.ghosh@campusone.edu',
    status: 'Available',
    specialization: 'Cloud Computing Architecture & Distributed Systems',
  },
  {
    id: 'fac-it-2',
    name: 'Prof. Sneha Kulkarni',
    department: 'IT',
    designation: 'Associate Professor',
    cabin: 'Block C-205 (2nd Floor)',
    officeHours: 'Tue - Fri: 2:00 PM - 4:00 PM',
    email: 'sneha.kulkarni@campusone.edu',
    status: 'In Lecture',
    specialization: 'Full-Stack Web Engineering & Microservices',
  },
  {
    id: 'fac-it-3',
    name: 'Dr. Rohan Verma',
    department: 'IT',
    designation: 'Assistant Professor',
    cabin: 'Block C-208 (2nd Floor)',
    officeHours: 'Mon - Wed: 10:00 AM - 12:00 PM',
    email: 'rohan.verma@campusone.edu',
    status: 'Available',
    specialization: 'Information Security & Cryptographic Systems',
  },
  {
    id: 'fac-it-4',
    name: 'Prof. Pooja Nair',
    department: 'IT',
    designation: 'Assistant Professor',
    cabin: 'Block C-211 (2nd Floor)',
    officeHours: 'Wed - Fri: 3:00 PM - 5:00 PM',
    email: 'pooja.nair@campusone.edu',
    status: 'In Office',
    specialization: 'Software Quality Assurance & Agile Methodologies',
  },
  {
    id: 'fac-it-5',
    name: 'Prof. Kunal Singhal',
    department: 'IT',
    designation: 'Assistant Professor',
    cabin: 'Block C-214 (2nd Floor)',
    officeHours: 'Mon - Fri: 1:00 PM - 2:00 PM',
    email: 'kunal.singhal@campusone.edu',
    status: 'Available',
    specialization: 'Mobile Application Frameworks & Edge Computing',
  },

  // Electronics & Communication (ECE)
  {
    id: 'fac-ece-1',
    name: 'Dr. Meenakshi Sundaram',
    department: 'ECE',
    designation: 'Professor & HOD',
    cabin: 'Block D-101 (1st Floor)',
    officeHours: 'Mon - Thu: 10:00 AM - 12:00 PM',
    email: 'meenakshi.s@campusone.edu',
    status: 'Available',
    specialization: 'Digital Signal Processing & Image Reconstruction',
  },
  {
    id: 'fac-ece-2',
    name: 'Prof. Harish Chander',
    department: 'ECE',
    designation: 'Associate Professor',
    cabin: 'Block D-104 (1st Floor)',
    officeHours: 'Tue - Fri: 2:00 PM - 4:00 PM',
    email: 'harish.c@campusone.edu',
    status: 'In Office',
    specialization: 'Embedded Systems & Industrial IoT Devices',
  },
  {
    id: 'fac-ece-3',
    name: 'Dr. Priyanka Joshi',
    department: 'ECE',
    designation: 'Assistant Professor',
    cabin: 'Block D-108 (1st Floor)',
    officeHours: 'Mon - Wed: 3:00 PM - 5:00 PM',
    email: 'priyanka.j@campusone.edu',
    status: 'Available',
    specialization: 'VLSI Circuit Design & Semiconductor Fabrication',
  },
  {
    id: 'fac-ece-4',
    name: 'Prof. Sandeep Reddy',
    department: 'ECE',
    designation: 'Assistant Professor',
    cabin: 'Block D-112 (1st Floor)',
    officeHours: 'Wed - Fri: 11:00 AM - 1:00 PM',
    email: 'sandeep.r@campusone.edu',
    status: 'In Lecture',
    specialization: 'Microprocessor Architecture & ARM Embedded C',
  },
  {
    id: 'fac-ece-5',
    name: 'Prof. Ritu Bansal',
    department: 'ECE',
    designation: 'Assistant Professor',
    cabin: 'Block D-115 (1st Floor)',
    officeHours: 'Mon - Fri: 9:00 AM - 10:00 AM',
    email: 'ritu.b@campusone.edu',
    status: 'Available',
    specialization: '5G Wireless Networks & Fiber Optic Communication',
  },

  // Artificial Intelligence & Machine Learning (AI ML)
  {
    id: 'fac-aiml-1',
    name: 'Dr. Arvind Narayanan',
    department: 'AI ML',
    designation: 'Professor & Program Chair',
    cabin: 'Block E-401 (4th Floor)',
    officeHours: 'Mon - Thu: 1:00 PM - 3:00 PM',
    email: 'arvind.n@campusone.edu',
    status: 'Available',
    specialization: 'Deep Learning, LLM Foundation Models & Transformers',
  },
  {
    id: 'fac-aiml-2',
    name: 'Dr. Kavita Krishnan',
    department: 'AI ML',
    designation: 'Associate Professor',
    cabin: 'Block E-404 (4th Floor)',
    officeHours: 'Tue - Fri: 11:00 AM - 1:00 PM',
    email: 'kavita.k@campusone.edu',
    status: 'In Office',
    specialization: 'Natural Language Processing & Speech Synthesis',
  },
  {
    id: 'fac-aiml-3',
    name: 'Prof. Devendra Joshi',
    department: 'AI ML',
    designation: 'Assistant Professor',
    cabin: 'Block E-408 (4th Floor)',
    officeHours: 'Mon - Wed: 2:00 PM - 4:00 PM',
    email: 'devendra.j@campusone.edu',
    status: 'Available',
    specialization: 'Computer Vision, Object Detection & Autonomous Systems',
  },
  {
    id: 'fac-aiml-4',
    name: 'Prof. Tanvi Roy',
    department: 'AI ML',
    designation: 'Assistant Professor',
    cabin: 'Block E-412 (4th Floor)',
    officeHours: 'Wed - Fri: 10:00 AM - 12:00 PM',
    email: 'tanvi.r@campusone.edu',
    status: 'In Lecture',
    specialization: 'Reinforcement Learning & Multi-Agent Robotics',
  },
  {
    id: 'fac-aiml-5',
    name: 'Prof. Siddharth Mehta',
    department: 'AI ML',
    designation: 'Assistant Professor',
    cabin: 'Block E-415 (4th Floor)',
    officeHours: 'Mon - Fri: 3:00 PM - 5:00 PM',
    email: 'siddharth.m@campusone.edu',
    status: 'Available',
    specialization: 'AI Ethics, Algorithmic Fairness & Data Mining',
  },
];

// Timetable data featuring the 5 official subjects and faculty
export const INITIAL_TIMETABLE: TimetableSlot[] = [
  // Wednesday (Tomorrow)
  { id: 'tt-w1', day: 'Wednesday', time: '09:00 - 10:00 AM', subject: 'Programming in C', code: 'CS-101', faculty: 'Dr. Ritu Pahwa', room: 'LT-204 (Lecture Block)', type: 'Theory' },
  { id: 'tt-w2', day: 'Wednesday', time: '10:00 - 11:00 AM', subject: 'Digital Electronics', code: 'EC-102', faculty: 'Mrs. Yukti Mutreja', room: 'LT-204 (Lecture Block)', type: 'Theory' },
  { id: 'tt-w3', day: 'Wednesday', time: '11:15 - 12:15 PM', subject: 'System Modelling Techniques', code: 'CS-103', faculty: 'Mr. Ankush', room: 'LT-201 (Lecture Block)', type: 'Theory' },
  { id: 'tt-w4', day: 'Wednesday', time: '01:00 - 03:00 PM', subject: 'Digital Electronics Lab', code: 'EC-102P', faculty: 'Mrs. Yukti Mutreja', room: 'Digital Hardware Lab 2', type: 'Lab' },
  { id: 'tt-w5', day: 'Wednesday', time: '03:15 - 04:15 PM', subject: 'Engineering Physics', code: 'PH-101', faculty: 'Dr. Deeksha', room: 'LT-204', type: 'Theory' },

  // Thursday
  { id: 'tt-th1', day: 'Thursday', time: '09:00 - 10:00 AM', subject: 'Engineering Mechanics', code: 'ME-101', faculty: 'Mr. Ashish Tyagi', room: 'LT-103', type: 'Theory' },
  { id: 'tt-th2', day: 'Thursday', time: '10:00 - 11:00 AM', subject: 'Programming in C', code: 'CS-101', faculty: 'Dr. Ritu Pahwa', room: 'LT-201', type: 'Theory' },
  { id: 'tt-th3', day: 'Thursday', time: '11:15 - 12:15 PM', subject: 'Digital Electronics', code: 'EC-102', faculty: 'Mrs. Yukti Mutreja', room: 'LT-204', type: 'Theory' },
  { id: 'tt-th4', day: 'Thursday', time: '01:00 - 03:00 PM', subject: 'Programming in C Practical Lab', code: 'CS-101P', faculty: 'Dr. Ritu Pahwa', room: 'Computer Lab 3', type: 'Lab' },
  { id: 'tt-th5', day: 'Thursday', time: '03:15 - 04:15 PM', subject: 'System Modelling Techniques Tutorial', code: 'CS-103T', faculty: 'Mr. Ankush', room: 'LT-201', type: 'Tutorial' },

  // Friday
  { id: 'tt-f1', day: 'Friday', time: '09:00 - 10:00 AM', subject: 'Engineering Physics', code: 'PH-101', faculty: 'Dr. Deeksha', room: 'LT-204', type: 'Theory' },
  { id: 'tt-f2', day: 'Friday', time: '10:00 - 11:00 AM', subject: 'Engineering Mechanics', code: 'ME-101', faculty: 'Mr. Ashish Tyagi', room: 'LT-103', type: 'Theory' },
  { id: 'tt-f3', day: 'Friday', time: '11:15 - 01:15 PM', subject: 'Engineering Physics Practical Lab', code: 'PH-101P', faculty: 'Dr. Deeksha', room: 'Physics Lab 1', type: 'Lab' },
  { id: 'tt-f4', day: 'Friday', time: '02:00 - 04:00 PM', subject: 'Digital Electronics Simulation Lab', code: 'EC-102P', faculty: 'Mrs. Yukti Mutreja', room: 'Digital Hardware Lab 2', type: 'Lab' },

  // Monday
  { id: 'tt-m1', day: 'Monday', time: '09:00 - 10:00 AM', subject: 'Programming in C', code: 'CS-101', faculty: 'Dr. Ritu Pahwa', room: 'LT-204', type: 'Theory' },
  { id: 'tt-m2', day: 'Monday', time: '10:00 - 11:00 AM', subject: 'Digital Electronics', code: 'EC-102', faculty: 'Mrs. Yukti Mutreja', room: 'LT-204', type: 'Theory' },
  { id: 'tt-m3', day: 'Monday', time: '11:15 - 12:15 PM', subject: 'System Modelling Techniques', code: 'CS-103', faculty: 'Mr. Ankush', room: 'LT-201', type: 'Theory' },
  { id: 'tt-m4', day: 'Monday', time: '01:00 - 03:00 PM', subject: 'Programming in C Coding Lab', code: 'CS-101P', faculty: 'Dr. Ritu Pahwa', room: 'Computer Lab 1', type: 'Lab' },

  // Tuesday
  { id: 'tt-tu1', day: 'Tuesday', time: '09:00 - 10:00 AM', subject: 'Engineering Mechanics', code: 'ME-101', faculty: 'Mr. Ashish Tyagi', room: 'LT-103', type: 'Theory' },
  { id: 'tt-tu2', day: 'Tuesday', time: '10:00 - 11:00 AM', subject: 'Engineering Physics', code: 'PH-101', faculty: 'Dr. Deeksha', room: 'LT-204', type: 'Theory' },
  { id: 'tt-tu3', day: 'Tuesday', time: '11:15 - 12:15 PM', subject: 'System Modelling Techniques Seminar', code: 'CS-103', faculty: 'Mr. Ankush', room: 'LT-201', type: 'Theory' },
  { id: 'tt-tu4', day: 'Tuesday', time: '01:00 - 03:00 PM', subject: 'Engineering Mechanics Workshop', code: 'ME-101P', faculty: 'Mr. Ashish Tyagi', room: 'Mechanics Workshop', type: 'Lab' },
];

// Attendance Records with 75% rule for all 5 subjects
export const INITIAL_ATTENDANCE: AttendanceSubject[] = [
  { id: 'att-1', code: 'CS-101', name: 'Programming in C', faculty: 'Dr. Ritu Pahwa', attended: 28, total: 32, credits: 4 },
  { id: 'att-2', code: 'EC-102', name: 'Digital Electronics', faculty: 'Mrs. Yukti Mutreja', attended: 26, total: 30, credits: 4 },
  { id: 'att-3', code: 'CS-103', name: 'System Modelling Techniques', faculty: 'Mr. Ankush', attended: 25, total: 30, credits: 4 },
  { id: 'att-4', code: 'PH-101', name: 'Engineering Physics', faculty: 'Dr. Deeksha', attended: 24, total: 29, credits: 4 },
  { id: 'att-5', code: 'ME-101', name: 'Engineering Mechanics', faculty: 'Mr. Ashish Tyagi', attended: 22, total: 28, credits: 4 },
  { id: 'att-6', code: 'EC-102P', name: 'Digital Electronics Lab', faculty: 'Mrs. Yukti Mutreja', attended: 18, total: 26, credits: 2 }, // 69.2% - CRITICAL SHORTAGE
  { id: 'att-7', code: 'CS-101P', name: 'Programming in C Lab', faculty: 'Dr. Ritu Pahwa', attended: 23, total: 26, credits: 2 },
];

// Internal Marks for the 5 subjects
export const INITIAL_MARKS: InternalMark[] = [
  { id: 'mrk-1', subjectCode: 'CS-101', subjectName: 'Programming in C (Dr. Ritu Pahwa)', midTerm: 28, practical: 18, projectAssignment: 19, attendanceMarks: 10, total: 75, letterGrade: 'A+' },
  { id: 'mrk-2', subjectCode: 'EC-102', subjectName: 'Digital Electronics (Mrs. Yukti Mutreja)', midTerm: 26, practical: 19, projectAssignment: 18, attendanceMarks: 10, total: 73, letterGrade: 'A' },
  { id: 'mrk-3', subjectCode: 'CS-103', subjectName: 'System Modelling Techniques (Mr. Ankush)', midTerm: 25, practical: 17, projectAssignment: 18, attendanceMarks: 9, total: 69, letterGrade: 'B+' },
  { id: 'mrk-4', subjectCode: 'PH-101', subjectName: 'Engineering Physics (Dr. Deeksha)', midTerm: 27, practical: 18, projectAssignment: 17, attendanceMarks: 9, total: 71, letterGrade: 'A' },
  { id: 'mrk-5', subjectCode: 'ME-101', subjectName: 'Engineering Mechanics (Mr. Ashish Tyagi)', midTerm: 24, practical: 16, projectAssignment: 17, attendanceMarks: 8, total: 65, letterGrade: 'B+' },
  { id: 'mrk-6', subjectCode: 'EC-102P', subjectName: 'Digital Electronics Lab', midTerm: 22, practical: 16, projectAssignment: 15, attendanceMarks: 7, total: 60, letterGrade: 'B' },
];

// Campus Documents Tracker (4 official statuses)
export const INITIAL_DOCUMENTS: CampusDocument[] = [
  {
    id: 'doc-1',
    title: 'UGC Mandatory Anti-Ragging Affidavit (2026-27)',
    category: 'Affidavit',
    submissionDate: '28 Oct 2026',
    status: 'Verified',
    refNumber: 'AR-2026-8821',
    remarks: 'Verified by Office of the Proctor & Student Welfare. Validated against national database.',
    verifiedBy: 'Prof. R.C. Verma (Proctor Office)',
    updatedAt: '29 Oct 2026, 04:15 PM',
  },
  {
    id: 'doc-2',
    title: 'Hostel No-Dues & Room Clearance Form',
    category: 'Clearance',
    submissionDate: '01 Nov 2026',
    status: 'Pending',
    refNumber: 'HC-2026-9042',
    remarks: 'Awaiting final signature from Block-A Hostel Warden regarding key handover and electricity reading.',
    updatedAt: '01 Nov 2026, 11:30 AM',
  },
  {
    id: 'doc-3',
    title: 'Merit-cum-Means Fee Concession Undertaking',
    category: 'Concession',
    submissionDate: '25 Oct 2026',
    status: 'Rejected',
    refNumber: 'FC-2026-7819',
    remarks: 'Rejected: Income certificate from Sub-Divisional Magistrate / Tehsildar is missing official seal. Please re-upload.',
    verifiedBy: 'Accounts Section (Desk 4)',
    updatedAt: '27 Oct 2026, 02:45 PM',
  },
  {
    id: 'doc-4',
    title: 'Semester 5 Academic Registration Form',
    category: 'Registration',
    submissionDate: '02 Nov 2026',
    status: 'Submitted',
    refNumber: 'SR-2026-9150',
    remarks: 'Submitted online. Currently queued for academic advisor verification and subject allocation.',
    updatedAt: '02 Nov 2026, 09:10 AM',
  },
  {
    id: 'doc-5',
    title: 'RFID Smart Campus Identity Card Reissue Request',
    category: 'Identity',
    submissionDate: '15 Oct 2026',
    status: 'Verified',
    refNumber: 'ID-2026-6701',
    remarks: 'Verified and smart RFID encoded. Collect card from Central Security Office counter with old receipt.',
    verifiedBy: 'Administrative Head (Central Desk)',
    updatedAt: '18 Oct 2026, 12:00 PM',
  },
];

// Fee Records
export const INITIAL_FEES: FeeRecord[] = [
  { id: 'fee-1', title: 'Semester 5 Tuition Fee', amount: 65000, dueDate: '15 Aug 2026', status: 'Paid', receiptNumber: 'REC-2026-8812', paidDate: '12 Aug 2026', paymentMode: 'Net Banking HDFC' },
  { id: 'fee-2', title: 'Hostel & Mess Boarding Fee (Odd Sem)', amount: 32000, dueDate: '20 Aug 2026', status: 'Paid', receiptNumber: 'REC-2026-8813', paidDate: '14 Aug 2026', paymentMode: 'UPI Axis Bank' },
  { id: 'fee-3', title: 'End-Semester Examination Fee', amount: 2500, dueDate: '15 Nov 2026', status: 'Pending' },
  { id: 'fee-4', title: 'Campus Wi-Fi & Digital Library Fee', amount: 1500, dueDate: '10 Aug 2026', status: 'Paid', receiptNumber: 'REC-2026-8814', paidDate: '08 Aug 2026', paymentMode: 'Debit Card SBI' },
];

// Notices & Circulars (Separated for Students and Teachers)
export const INITIAL_NOTICES: NoticeItem[] = [
  // Student Notices
  {
    id: 'not-s1',
    title: 'Official Notification: End-Semester Theory & Practical Examination Schedule',
    category: 'Examination',
    date: '02 Nov 2026',
    author: 'Controller of Examinations',
    isPinned: true,
    hasAttachment: true,
    attachmentName: 'Exam_Schedule_Winter_2026.pdf',
    audience: 'students',
    content: 'The comprehensive timetable for Odd Semester 2026-27 examinations has been published. Theory exams will commence on 28 November 2026. Admit cards will be issued only to candidates having at least 75% attendance.',
  },
  {
    id: 'not-s2',
    title: 'Registration Open: Smart India Hackathon & CampusOne Ideathon 2026',
    category: 'Academic',
    date: '01 Nov 2026',
    author: 'Innovation & Incubation Council',
    isPinned: true,
    hasAttachment: true,
    attachmentName: 'SIH_Internal_Selection_Guidelines.pdf',
    audience: 'students',
    content: 'All B.Tech students across CSE, IT, ECE, and AIML are invited to register team proposals. Shortlisted campus teams will receive ₹25,000 prototype funding and direct lab mentorship.',
  },
  {
    id: 'not-s3',
    title: 'Mandatory Fee Clearance Deadline for Examination Admit Card Generation',
    category: 'Urgent',
    date: '30 Oct 2026',
    author: 'Finance & Accounts Division',
    isPinned: false,
    hasAttachment: true,
    attachmentName: 'Fee_Clearance_Notice_Nov2026.pdf',
    audience: 'students',
    content: 'All students are notified to clear outstanding examination dues before 15 November 2026 to ensure unconditional issuance of digital hall tickets.',
  },
  {
    id: 'not-s4',
    title: 'Annual Inter-College Sports & Cultural Meet "Aura 2026"',
    category: 'Cultural',
    date: '28 Oct 2026',
    author: 'Student Activity Council',
    isPinned: false,
    hasAttachment: true,
    attachmentName: 'Aura_2026_Event_Rulebook.pdf',
    audience: 'students',
    content: 'Auditions for music, dance, theatrical, and esports tournaments begin this Friday. Register with your respective departmental cultural coordinators.',
  },

  // Faculty / Teacher Circulars
  {
    id: 'not-f1',
    title: 'UGC Major & Minor Research Grant Proposals (2026-27): Window Open',
    category: 'Faculty Circular',
    date: '03 Nov 2026',
    author: 'Dean (Research & Development)',
    isPinned: true,
    hasAttachment: true,
    attachmentName: 'UGC_Research_Grant_Template_2026.pdf',
    audience: 'faculty',
    content: 'All faculty members are invited to submit research funding proposals under AI, IoT Hardware, and Renewable Energy streams. Seed grants up to ₹5,00,000 available per project.',
  },
  {
    id: 'not-f2',
    title: 'End-Semester Practical & Viva External Examiner Duty Roster',
    category: 'Examination',
    date: '02 Nov 2026',
    author: 'Office of the Academic Registrar',
    isPinned: true,
    hasAttachment: true,
    attachmentName: 'External_Examiner_Duties_Winter2026.pdf',
    audience: 'faculty',
    content: 'Practical examination and viva voce external duties across affiliated engineering institutes have been assigned. Faculty must acknowledge assigned dates and complete marks entry within 24 hours.',
  },
  {
    id: 'not-f3',
    title: 'Annual Faculty Performance Appraisal & API Score Submission Deadline',
    category: 'Administration',
    date: '31 Oct 2026',
    author: 'Internal Quality Assurance Cell (IQAC)',
    isPinned: false,
    hasAttachment: true,
    attachmentName: 'API_Appraisal_Form_2026.pdf',
    audience: 'faculty',
    content: 'Professors and lecturers must submit their annual Academic Performance Indicator (API) self-assessment portfolio with published papers and conference proceedings by 20 November 2026.',
  },
  {
    id: 'not-f4',
    title: 'Board of Studies (BOS) Meeting: Curriculum Revision for 1st Year Engineering',
    category: 'Academic',
    date: '29 Oct 2026',
    author: 'Head, Academic Affairs',
    isPinned: false,
    hasAttachment: false,
    audience: 'faculty',
    content: 'The statutory BOS committee will convene in Conference Room 1 on 10 November 2026 to finalize industry-aligned syllabi for Programming in C, Digital Electronics, and AI foundations.',
  },
  {
    id: 'not-f5',
    title: 'Faculty Invigilation Schedule & Guidelines for Winter 2026 Examinations',
    category: 'Examination',
    date: '27 Oct 2026',
    author: 'Controller of Examinations',
    isPinned: false,
    hasAttachment: true,
    attachmentName: 'Invigilation_Roster_Nov2026.pdf',
    audience: 'faculty',
    content: 'Detailed invigilation duty allocations for morning and afternoon shifts. Any substitution or mutual exchange must be submitted in writing to the exam cell 48 hours prior.',
  },

  // General Campus Notices
  {
    id: 'not-a1',
    title: 'Central Library Extended 24x7 Hours during Study Preparatory Week',
    category: 'Administration',
    date: '31 Oct 2026',
    author: 'Chief Librarian',
    isPinned: false,
    hasAttachment: false,
    audience: 'all',
    content: 'Starting 10 November 2026, reading halls on 2nd and 3rd floors will remain accessible 24/7. High-speed campus Wi-Fi, air conditioning, and tea/coffee dispensers will operate continuously.',
  },
  {
    id: 'not-a2',
    title: 'Diwali & Mid-Semester Campus Recess Schedule',
    category: 'Administration',
    date: '25 Oct 2026',
    author: 'Office of the Registrar',
    isPinned: false,
    hasAttachment: false,
    audience: 'all',
    content: 'Administrative offices and academic lectures will remain suspended as per the published university gazette calendar. Central server maintenance scheduled during this window.',
  },
];

// Events & Workshops
export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'HackCampus 2026: 48-Hour National Hackathon',
    category: 'Hackathon',
    date: '12 - 14 Nov 2026',
    venue: 'Convention Centre & Auditorium A',
    organizer: 'CSE & AI ML Departments',
    description: 'Build production-ready prototypes across Generative AI, Campus Utilities, and Green Tech. Cash prizes worth ₹1,50,000 + cloud credits.',
    isRsvp: true,
    badge: 'Flagship Event',
  },
  {
    id: 'evt-2',
    title: 'Technova 2026: Annual Technical Festival',
    category: 'Tech Fest',
    date: '20 - 22 Nov 2026',
    venue: 'Main Campus Grounds & All Engineering Blocks',
    organizer: 'Institute Student Council',
    description: '18 technical competitions including RoboWars, Bug Hunt, Web3 Sprint, and Paper Presentations with IEEE student branch.',
    isRsvp: false,
    badge: 'Popular',
  },
  {
    id: 'evt-3',
    title: 'Masterclass: Deploying Generative AI at Scale with Gemini Models',
    category: 'Workshop',
    date: '08 Nov 2026 (4:00 PM)',
    venue: 'Seminar Hall 1 (Live streaming in Audi B)',
    organizer: 'Google Developer Student Club',
    description: 'Hands-on session with industry engineers on building real-time full-stack applications with Google AI Studio and Firebase.',
    isRsvp: true,
    badge: 'Certified',
  },
];

// Canteen Live Menu Items
export const INITIAL_CANTEEN: CanteenItem[] = [
  { id: 'c-1', name: 'Special Veg Thali Meal', category: 'Meals', price: 90, isVeg: true, prepTime: '5 mins', rating: 4.9, inStock: true, description: 'Shahi Paneer, Dal Makhani, 3 Butter Rotis, Jeera Rice, Fresh Salad & Gulab Jamun.' },
  { id: 'c-2', name: 'South Indian Masala Dosa', category: 'Meals', price: 60, isVeg: true, prepTime: '8 mins', rating: 4.8, inStock: true, description: 'Crisp golden crepe filled with spiced potato masala, served with piping hot sambar & fresh coconut chutney.' },
  { id: 'c-3', name: 'Cold Coffee with Ice Cream', category: 'Beverages', price: 40, isVeg: true, prepTime: 'Instant', rating: 4.9, inStock: true, description: 'Rich blended espresso shake topped with a generous scoop of vanilla ice cream and chocolate drizzle.' },
  { id: 'c-4', name: 'Spicy Paneer Kathi Roll', category: 'Snacks', price: 70, isVeg: true, prepTime: '6 mins', rating: 4.7, inStock: true, description: 'Char-grilled cottage cheese cubes rolled in flaky paratha with sliced onions and mint dressing.' },
  { id: 'c-5', name: 'Crispy Samosa Platter (2 pcs)', category: 'Snacks', price: 20, isVeg: true, prepTime: 'Instant', rating: 4.6, inStock: true, description: 'Freshly fried potato samosas served with sweet tamarind and spicy mint chutneys.' },
  { id: 'c-6', name: 'Fresh Seasonal Fruit Juice', category: 'Beverages', price: 45, isVeg: true, prepTime: '3 mins', rating: 4.8, inStock: true, description: '100% pure cold-pressed Valencia orange juice without added sugar.' },
  { id: 'c-7', name: 'Amritsari Chole Bhature (2 pcs)', category: 'Specials', price: 80, isVeg: true, prepTime: '7 mins', rating: 4.9, inStock: true, description: 'Fluffy fried bhature served with slow-cooked pindi chole, pickled carrots, and green chillies.' },
  { id: 'c-8', name: 'Veg Hakka Noodles with Manchurian', category: 'Specials', price: 85, isVeg: true, prepTime: '8 mins', rating: 4.7, inStock: true, description: 'Wok-tossed noodles with crunchy vegetables, paired with vegetable Manchurian in savory garlic sauce.' },
];

// Lost & Found Items (Strict Privacy Compliance: No phone or student IDs)
export const INITIAL_LOST_FOUND: LostFoundItem[] = [
  {
    id: 'lf-1',
    title: 'Casio fx-991CW Scientific Calculator (Black)',
    category: 'Electronics',
    locationFound: 'Left on Desk 14 in Lecture Theatre LT-204',
    date: '02 Nov 2026',
    claimAt: 'Central Security Desk (Admin Block Gate 1)',
    status: 'Available',
    description: 'Black scientific calculator in hard plastic case with a blue mathematical sticker on the back cover.',
  },
  {
    id: 'lf-2',
    title: 'Dell USB-C 65W Laptop Charger Adapter',
    category: 'Electronics',
    locationFound: 'Central Library 2nd Floor Silent Reading Cubicle #8',
    date: '01 Nov 2026',
    claimAt: 'Library Circulation & Lost Items Desk',
    status: 'Available',
    description: 'Black original Dell Type-C adapter with coiled cable. Please show your laptop model to claim.',
  },
  {
    id: 'lf-3',
    title: 'Noise ColorFit Pulse 2 Smartwatch with Grey Strap',
    category: 'Accessories',
    locationFound: 'Cafeteria Outdoor Seating Lawn near Fountain',
    date: '30 Oct 2026',
    claimAt: 'Campus Security Office',
    status: 'Claimed',
    description: 'Rectangular dial smartwatch with metallic grey silicone strap. Successfully returned to verified owner.',
  },
  {
    id: 'lf-4',
    title: 'Blue Spiral Notebook (Programming in C, Digital Electronics & System Modelling Notes)',
    category: 'Books',
    locationFound: 'Block B Ground Floor Student Lounge',
    date: '03 Nov 2026',
    claimAt: 'CSE Departmental Office (Desk 2)',
    status: 'Available',
    description: '300-page notebook containing handwritten lecture notes on C Pointers, Logic Gates, System Modelling & Mechanics.',
  },
];

// Teacher Assigned Courses with 40-Student Rosters for 4 Branches: CSE, IT, ECE, AIML
function generateStudentRoster(count: number, branch: 'CSE' | 'IT' | 'ECE' | 'AIML'): StudentRosterEntry[] {
  const names = [
    'Aarav Sharma', 'Aditya Sen', 'Ananya Gupta', 'Arjun Verma', 'Bhavya Patel',
    'Chirag Joshi', 'Deepak Rao', 'Divya Nair', 'Esha Kulkarni', 'Gaurav Mehta',
    'Harsh Vardhan', 'Isha Singhal', 'Jayant Roy', 'Khushi Bansal', 'Lakshya Bhatia',
    'Manish Reddy', 'Navya Saxena', 'Omkar Pillai', 'Pooja Tiwari', 'Pranav Menon',
    'Rahul Deshmukh', 'Rhea Kapoor', 'Rohan Mittal', 'Sanya Narang', 'Siddharth Iyer',
    'Sneha Choudhury', 'Tanmay Das', 'Utkarsh Sethi', 'Varun Malhotra', 'Vidhi Agarwal',
    'Yash Kaushik', 'Nandana Nair', 'Shlok Trivedi', 'Tejpal Singh', 'Zoya Khan',
    'Aryan Khurana', 'Kritika Roy', 'Mohit Agnihotri', 'Riddhi Shah', 'Sumit Pandey',
  ];

  return Array.from({ length: count }, (_, i) => {
    const roll = `24${branch}${String(i + 1).padStart(3, '0')}`;
    const practicalMarks = 14 + ((i * 7) % 7); // 14 to 20
    const vivaMarks = 10 + ((i * 5) % 6);      // 10 to 15
    const recordMarks = 7 + ((i * 3) % 4);     // 7 to 10
    const total = practicalMarks + vivaMarks + recordMarks; // out of 45
    const grade = total >= 40 ? 'A+' : total >= 35 ? 'A' : total >= 30 ? 'B+' : total >= 25 ? 'B' : 'C';

    return {
      id: `stu-${branch.toLowerCase()}-${i + 1}`,
      roll,
      name: names[i % names.length] + (i >= names.length ? ` (${i + 1})` : ''),
      isPresent: (i % 7 !== 0), // ~86% baseline attendance
      practicalMarks,
      vivaMarks,
      recordMarks,
      totalPracticalViva: total,
      grade,
      remarks: total >= 40 ? 'Excellent performance' : total >= 34 ? 'Good laboratory technique' : 'Average conceptual clarity',
    };
  });
}

export const INITIAL_TEACHER_COURSES: TeacherCourse[] = [
  {
    id: 'tc-cse',
    code: 'CSE-101',
    name: 'Programming in C & Data Structures',
    branch: 'CSE',
    department: 'Computer Science & Engineering',
    semester: '1st Year',
    batch: 'Section A (40 Students)',
    room: 'LT-204 & Comp Lab 1',
    schedule: 'Mon, Wed, Thu 09:00 - 10:00 AM',
    enrolledStudentsCount: 40,
    students: generateStudentRoster(40, 'CSE'),
  },
  {
    id: 'tc-it',
    code: 'IT-101',
    name: 'System Modelling & Web Technology',
    branch: 'IT',
    department: 'Information Technology',
    semester: '1st Year',
    batch: 'Section B (40 Students)',
    room: 'LT-201 & Web Lab 2',
    schedule: 'Mon, Wed 11:15 - 12:15 PM',
    enrolledStudentsCount: 40,
    students: generateStudentRoster(40, 'IT'),
  },
  {
    id: 'tc-ece',
    code: 'ECE-102',
    name: 'Digital Electronics & Logic Design',
    branch: 'ECE',
    department: 'Electronics & Communication Engineering',
    semester: '1st Year',
    batch: 'Section C (40 Students)',
    room: 'LT-102 & Digital Hardware Lab 2',
    schedule: 'Tue, Fri 10:00 - 11:00 AM',
    enrolledStudentsCount: 40,
    students: generateStudentRoster(40, 'ECE'),
  },
  {
    id: 'tc-aiml',
    code: 'AIML-101',
    name: 'Foundations of AI & Python Programming',
    branch: 'AIML',
    department: 'Artificial Intelligence & Machine Learning',
    semester: '1st Year',
    batch: 'Section D (40 Students)',
    room: 'LT-304 & AI Computing Lab',
    schedule: 'Wed, Fri 01:00 - 03:00 PM',
    enrolledStudentsCount: 40,
    students: generateStudentRoster(40, 'AIML'),
  },
];

// Multi-Month Teacher Salary Slips
export const INITIAL_SALARY_SLIPS: TeacherSalarySlip[] = [
  {
    id: 'sal-2026-10',
    month: 'October 2026',
    year: 2026,
    basicPay: 115000,
    da: 34500, // 30% of basic
    hra: 27600, // 24% of basic
    travelAllowance: 4800,
    specialAllowance: 5000,
    grossPay: 186900,
    providentFund: 13800,
    taxDeduction: 15200,
    totalDeductions: 29000,
    netCredit: 157900,
    status: 'Credited',
    bankRef: 'NEFT-HDFC0001248-261031-1982',
    creditDate: '31 Oct 2026',
  },
  {
    id: 'sal-2026-09',
    month: 'September 2026',
    year: 2026,
    basicPay: 115000,
    da: 34500,
    hra: 27600,
    travelAllowance: 4800,
    specialAllowance: 5000,
    grossPay: 186900,
    providentFund: 13800,
    taxDeduction: 15200,
    totalDeductions: 29000,
    netCredit: 157900,
    status: 'Credited',
    bankRef: 'NEFT-HDFC0001248-260930-4412',
    creditDate: '30 Sep 2026',
  },
  {
    id: 'sal-2026-08',
    month: 'August 2026',
    year: 2026,
    basicPay: 112000,
    da: 33600,
    hra: 26880,
    travelAllowance: 4800,
    specialAllowance: 4500,
    grossPay: 181780,
    providentFund: 13440,
    taxDeduction: 14800,
    totalDeductions: 28240,
    netCredit: 153540,
    status: 'Credited',
    bankRef: 'NEFT-HDFC0001248-260831-8891',
    creditDate: '31 Aug 2026',
  },
  {
    id: 'sal-2026-07',
    month: 'July 2026',
    year: 2026,
    basicPay: 112000,
    da: 33600,
    hra: 26880,
    travelAllowance: 4800,
    specialAllowance: 4500,
    grossPay: 181780,
    providentFund: 13440,
    taxDeduction: 14800,
    totalDeductions: 28240,
    netCredit: 153540,
    status: 'Credited',
    bankRef: 'NEFT-HDFC0001248-260731-3320',
    creditDate: '31 Jul 2026',
  },
  {
    id: 'sal-2026-06',
    month: 'June 2026',
    year: 2026,
    basicPay: 110000,
    da: 33000,
    hra: 26400,
    travelAllowance: 4800,
    specialAllowance: 4000,
    grossPay: 178200,
    providentFund: 13200,
    taxDeduction: 14500,
    totalDeductions: 27700,
    netCredit: 150500,
    status: 'Credited',
    bankRef: 'NEFT-HDFC0001248-260630-1049',
    creditDate: '30 Jun 2026',
  },
  {
    id: 'sal-2026-05',
    month: 'May 2026',
    year: 2026,
    basicPay: 110000,
    da: 33000,
    hra: 26400,
    travelAllowance: 4800,
    specialAllowance: 4000,
    grossPay: 178200,
    providentFund: 13200,
    taxDeduction: 14500,
    totalDeductions: 27700,
    netCredit: 150500,
    status: 'Credited',
    bankRef: 'NEFT-HDFC0001248-260531-9921',
    creditDate: '31 May 2026',
  },
];

// Initial Leave Applications (For Students and Teachers)
export const INITIAL_LEAVES: LeaveApplication[] = [
  {
    id: 'leave-s1',
    applicantId: 'usr-student',
    applicantName: 'Aarav Sharma',
    applicantRole: 'student',
    applicantDetail: 'Roll: 24CSE042 (1st Year CSE)',
    leaveType: 'Duty / Hackathon',
    startDate: '12 Nov 2026',
    endDate: '14 Nov 2026',
    totalDays: 3,
    reason: 'Representing institute at SIH National Hackathon Finals in Pune.',
    status: 'Approved',
    appliedOn: '01 Nov 2026',
    reviewedBy: 'Dr. Ritu Pahwa (HOD)',
    remarks: 'Approved with full attendance credit for lab and theory sessions.',
  },
  {
    id: 'leave-s2',
    applicantId: 'usr-student',
    applicantName: 'Aarav Sharma',
    applicantRole: 'student',
    applicantDetail: 'Roll: 24CSE042 (1st Year CSE)',
    leaveType: 'Sick / Medical',
    startDate: '05 Nov 2026',
    endDate: '06 Nov 2026',
    totalDays: 2,
    reason: 'Down with viral flu and fever. Campus dispensary medical slip attached.',
    status: 'Pending',
    appliedOn: '03 Nov 2026',
    remarks: 'Awaiting doctor endorsement validation from health center.',
  },
  {
    id: 'leave-f1',
    applicantId: 'usr-faculty',
    applicantName: 'Dr. Ritu Pahwa',
    applicantRole: 'faculty',
    applicantDetail: 'Professor & HOD, Computer Science & Engineering',
    leaveType: 'Academic / On Duty (OD)',
    startDate: '18 Nov 2026',
    endDate: '19 Nov 2026',
    totalDays: 2,
    reason: 'Keynote Speaker & Session Chair at IEEE National Computing Conference.',
    substituteFaculty: 'Mrs. Yukti Mutreja (Associate Professor, ECE)',
    status: 'Approved',
    appliedOn: '28 Oct 2026',
    reviewedBy: 'Dean (Academic Affairs)',
    remarks: 'Approved. Alternate lecture schedule submitted and verified.',
  },
  {
    id: 'leave-f2',
    applicantId: 'usr-faculty',
    applicantName: 'Dr. Ritu Pahwa',
    applicantRole: 'faculty',
    applicantDetail: 'Professor & HOD, Computer Science & Engineering',
    leaveType: 'Casual Leave (CL)',
    startDate: '25 Nov 2026',
    endDate: '25 Nov 2026',
    totalDays: 1,
    reason: 'Personal family engagement.',
    substituteFaculty: 'Mr. Ankush (Assistant Professor, CSE)',
    status: 'Pending',
    appliedOn: '02 Nov 2026',
    remarks: 'Queued for Registrar sign-off.',
  },
];

// Admin Section: Faculty Academic Evaluation & Marks Audit
export const INITIAL_ADMIN_TEACHER_EVALUATIONS: AdminTeacherEvaluation[] = [
  {
    id: 'eval-1',
    facultyId: 'fac-cse-1',
    facultyName: 'Dr. Ritu Pahwa',
    department: 'CSE',
    courseAssigned: 'CSE-101: Programming in C & Data Structures',
    syllabusCompletion: 94,
    attendanceCompliance: 97,
    practicalVivaTimeliness: 19,
    studentFeedbackRating: 9.4,
    adminAuditScore: 96,
    auditStatus: 'Approved by Dean',
    remarks: 'Exemplary lecture delivery, 100% practical lab log completion, zero student grievances.',
    lastUpdated: '03 Nov 2026',
  },
  {
    id: 'eval-2',
    facultyId: 'fac-ece-2',
    facultyName: 'Mrs. Yukti Mutreja',
    department: 'ECE',
    courseAssigned: 'ECE-102: Digital Electronics & Logic Design',
    syllabusCompletion: 91,
    attendanceCompliance: 94,
    practicalVivaTimeliness: 18,
    studentFeedbackRating: 9.1,
    adminAuditScore: 92,
    auditStatus: 'Approved by Dean',
    remarks: 'Consistent hardware kit maintenance in Digital Lab 2. Timely viva assessment.',
    lastUpdated: '02 Nov 2026',
  },
  {
    id: 'eval-3',
    facultyId: 'fac-cse-3',
    facultyName: 'Mr. Ankush',
    department: 'IT',
    courseAssigned: 'IT-101: System Modelling & Web Technology',
    syllabusCompletion: 88,
    attendanceCompliance: 92,
    practicalVivaTimeliness: 17,
    studentFeedbackRating: 8.8,
    adminAuditScore: 89,
    auditStatus: 'Verified',
    remarks: 'Effective case-study pedagogical approach. Lab assessments up to date.',
    lastUpdated: '01 Nov 2026',
  },
  {
    id: 'eval-4',
    facultyId: 'fac-cse-4',
    facultyName: 'Dr. Deeksha',
    department: 'AIML',
    courseAssigned: 'AIML-101: Foundations of AI & Python Programming',
    syllabusCompletion: 93,
    attendanceCompliance: 95,
    practicalVivaTimeliness: 18,
    studentFeedbackRating: 9.2,
    adminAuditScore: 94,
    auditStatus: 'Approved by Dean',
    remarks: 'Outstanding research-oriented project assignments in Python lab.',
    lastUpdated: '02 Nov 2026',
  },
];

// Default Demo Users
export const DEMO_USERS: Record<Role, UserProfile> = {
  student: {
    id: 'usr-student',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@campusone.edu',
    role: 'student',
    roleLabel: 'Student',
    avatar: 'AS',
    studentId: 'STU202401',
    rollNumber: '24CSE042',
    course: 'B.Tech CSE - 1st Year (C Programming, Digital Electronics, System Modelling, Physics, Mechanics)',
    department: 'Computer Science & Engineering',
  },
  faculty: {
    id: 'usr-faculty',
    name: 'Dr. Ritu Pahwa',
    email: 'ritu.pahwa@campusone.edu',
    role: 'faculty',
    roleLabel: 'Teacher (Faculty)',
    avatar: 'RP',
    designation: 'Professor & HOD',
    department: 'Computer Science & Engineering',
    cabin: 'Block B-304 (3rd Floor)',
  },
  admin: {
    id: 'usr-admin',
    name: 'Admin & Academic Office',
    email: 'admin.desk@campusone.edu',
    role: 'admin',
    roleLabel: 'Other Staff / Admin',
    avatar: 'AO',
    designation: 'Academic Affairs Officer',
    department: 'Office of the Registrar & Student Affairs',
    cabin: 'Administration Block, Ground Floor',
  },
};

const STORAGE_KEY = 'campusone_state_v9';

export interface CampusOneState {
  currentUser: UserProfile;
  faculty: FacultyMember[];
  timetable: TimetableSlot[];
  attendance: AttendanceSubject[];
  marks: InternalMark[];
  documents: CampusDocument[];
  fees: FeeRecord[];
  notices: NoticeItem[];
  events: EventItem[];
  canteen: CanteenItem[];
  lostFound: LostFoundItem[];
  teacherCourses: TeacherCourse[];
  teacherSalarySlips: TeacherSalarySlip[];
  leaveApplications: LeaveApplication[];
  adminTeacherEvaluations: AdminTeacherEvaluation[];
  canteenOrders: {
    tokenNumber: number;
    items: { name: string; quantity: number; price: number }[];
    total: number;
    status: 'Ready' | 'Preparing' | 'Collected';
    placedAt: string;
  }[];
}

export function getDefaultState(): CampusOneState {
  return {
    currentUser: DEMO_USERS.student,
    faculty: INITIAL_FACULTY,
    timetable: INITIAL_TIMETABLE,
    attendance: INITIAL_ATTENDANCE,
    marks: INITIAL_MARKS,
    documents: INITIAL_DOCUMENTS,
    fees: INITIAL_FEES,
    notices: INITIAL_NOTICES,
    events: INITIAL_EVENTS,
    canteen: INITIAL_CANTEEN,
    lostFound: INITIAL_LOST_FOUND,
    teacherCourses: INITIAL_TEACHER_COURSES,
    teacherSalarySlips: INITIAL_SALARY_SLIPS,
    leaveApplications: INITIAL_LEAVES,
    adminTeacherEvaluations: INITIAL_ADMIN_TEACHER_EVALUATIONS,
    canteenOrders: [
      {
        tokenNumber: 482,
        items: [
          { name: 'Special Veg Thali Meal', quantity: 1, price: 90 },
          { name: 'Cold Coffee with Ice Cream', quantity: 1, price: 40 },
        ],
        total: 130,
        status: 'Ready',
        placedAt: '12:45 PM',
      },
    ],
  };
}

export function loadSavedState(): CampusOneState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.currentUser && parsed.teacherCourses?.length >= 4 && parsed.teacherSalarySlips?.length >= 6) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load local state, using defaults', err);
  }
  const defaultState = getDefaultState();
  saveState(defaultState);
  return defaultState;
}

export function saveState(state: CampusOneState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage', err);
  }
}

export function resetAllState(): CampusOneState {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {}
  const fresh = getDefaultState();
  saveState(fresh);
  return fresh;
}
