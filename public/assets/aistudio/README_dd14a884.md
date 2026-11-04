# CAMPUSONE – Your Entire College in One Place

> **Hackathon Date**: 4 November 2026  
> **Team Leader**: Yash Kaushik  
> **Team Members**: Shlok • Nandana • Tejpal  
> **Disclaimer**: *DEMO DATA – NOT OFFICIAL. Internal Hackathon Prototype.*

---

## 1. Project Overview & Scope

### The Problem
College students currently rely on fragmented, scattered sources for notices, schedules, faculty cabin locations, document clearances, and campus services. Information is disjointed, unorganized, and not personalized.

### The CampusOne Solution
CampusOne is a unified, responsive role-based portal that connects everyday college operations across three distinct workspaces:
1. **Campus Home**: Public notices, events, live canteen menu, faculty directory, and general campus services.
2. **Student Portal**: Student profile, 75% attendance health tracker, internal/practical marks, assignments, document clearance tracker, and sample fee receipts.
3. **Faculty & Admin Portal**: Document verification/rejection workflow, circular publication, faculty cabin & office-hour availability, and campus request handling.

### 🌟 Key Differentiator – "Tomorrow at College"
A personalized briefing on the student dashboard that displays:
- Next-day classes, teachers, rooms, and lecture vs. lab slots.
- Pending assignment deadlines due tomorrow or soon.
- Critical document clearance warnings.
- Urgent administrative circulars.

---

## 2. Team Member Work Allocation & Deliverables

| Member | Module | Specific Deliverables Completed |
|---|---|---|
| **Yash Kaushik** *(Lead)* | **Architecture, Dashboard & Integration** | Shared CSS variables & design system, GitHub repo setup, Firebase & Firestore architecture, main role-aware dashboard, and the standout **Tomorrow at College** card. |
| **Shlok** | **Student Accounts & Administration** | Demo login page with 1-click profiles, student profile view, **My Documents** tracker with 4 statuses (*Submitted, Pending, Verified, Rejected*), admin verify/reject action, and **Fees Page** with sample receipt generation. |
| **Nandana** | **Academic Module & Data** | Class timetable with day filters, **Subject-wise Attendance** with 75% examination threshold calculation & warning badges, **Marks Breakdown** (Mid-term, practicals, project reviews), and **Assignments** tracker with submission action. |
| **Tejpal** | **Campus Information & Student Services** | **Faculty Finder** with live search & cabin locator, **Notices & Circulars** with category tabs & admin posting, **Events & Workshops** with 1-click RSVP, **Canteen Menu** with live availability & tray checkout, and **Lost & Found** with privacy protection (no student phone/IDs). |

---

## 3. Design System & Color Palette

Adheres strictly to Page 3 of the Team Execution Plan:

| Color | Hex Code | Purpose in CampusOne |
|---|---|---|
| **Deep Navy** | `#17324D` | Sidebar, top navigation, brand, headers |
| **Royal Blue** | `#2463A6` | Primary action buttons, active navigation links |
| **Teal** | `#148A8A` | Highlights, badges, secondary actions |
| **Background** | `#F5F7FA` | Clean page background |
| **White** | `#FFFFFF` | Cards and surface elevation |
| **Dark Grey** | `#253341` | Primary body typography |
| **Muted Grey** | `#5B6875` | Labels, subtitles and secondary text |
| **Amber** | `#E6B450` | Due soon, warnings, attendance alert |
| **Red** | `#B94747` | Rejected, overdue, critical shortage |
| **Green** | `#277A54` | Verified, paid, completed, attendance safe |

---

## 4. Project Structure

```
CAMPUS ONE/
├── index.html                 # Public Campus Home portal
├── login.html                 # Role selector (Student / Faculty / Admin)
├── dashboard.html             # Main Dashboard with "Tomorrow at College"
├── server.js                  # Zero-dependency local Node.js web server
├── firestore.rules            # Security rules enforcing role-based permissions
├── README.md                  # Documentation and pitch guide
├── css/
│   ├── style.css              # Color tokens, layout grid, sidebar, typography
│   └── components.css         # Cards, badges, buttons, modals, tables, toasts
├── js/
│   ├── data-store.js          # Unified Firestore mock + persistent localStorage
│   ├── firebase-config.js     # Firebase SDK connection & hybrid fallback
│   ├── auth.js                # Session management & 1-click role switcher
│   ├── dashboard.js           # Tomorrow at College engine & quick stats
│   ├── documents.js           # Document status workflows & fee clearance
│   ├── academics.js           # Timetable, 75% attendance logic & assignments
│   └── campus.js              # Faculty finder, notices, events, canteen, lost & found
├── pages/
│   ├── documents.html         # Document tracker & fee receipts
│   ├── timetable.html         # Daily/weekly class timetable
│   ├── academics.html         # Attendance health & internal marks
│   ├── faculty.html           # Faculty directory & cabin locator
│   ├── notices.html           # Campus circulars & notice posting
│   ├── events.html            # Campus fests, hackathons & RSVP
│   ├── canteen.html           # Live menu & demo pickup ordering
│   └── lost-found.html        # Privacy-safe lost & found bulletin
└── assets/
    ├── images/
    └── icons/
```

---

## 5. How to Run Locally

### Option A: Using Built-in Node.js Server (Recommended)
Open your terminal in this directory and run:
```bash
node server.js
```
Then visit **`http://localhost:3000`** in your browser.

### Option B: Open Directly in Any Browser
Double-click `index.html` or open it with any static browser server (`Live Server`, `http-server`, etc.).

---

## 6. Definition of Done Checklist (Page 9 & 10)

- [x] **A user can open the website and enter the demo portal.**
- [x] **Dashboard loads and shows a useful "Tomorrow at College" summary.**
- [x] **Document tracker displays statuses (`Submitted`, `Pending`, `Verified`, `Rejected`) and due dates.**
- [x] **Demonstrates a safe status update (Admin can verify/reject documents live).**
- [x] **Timetable shows subjects, teachers, times, and rooms with day filters.**
- [x] **Attendance tracks subject-wise percentages against the 75% examination threshold.**
- [x] **Faculty finder searches sample faculty records and shows cabin locations.**
- [x] **Notices/events are visible and readable with category filters.**
- [x] **Canteen menu displays live availability and ordering tray.**
- [x] **Lost & Found respects student privacy (no personal phone numbers or student IDs).**
- [x] **Site is fully responsive across laptop and mobile viewports.**
- [x] **Labels all content with "DEMO DATA – NOT OFFICIAL".**

---

## 7. Hackathon Judge Pitch Script (Page 10)

> *"Good morning, respected judges and mentors!  
> Today, college students juggle 5 different WhatsApp groups, paper notice boards, and multiple administrative offices just to find out where their next class is, whether their hostel document was approved, or when their fee is due.  
>  
> Introducing **CampusOne: Your Entire College in One Place**.  
> CampusOne unifies academics, administration, and campus services into one clean, role-based platform. Our flagship feature, **Tomorrow at College**, acts as a personalized daily briefing for students—showing tomorrow's exact lecture rooms, pending assignment deadlines, and urgent notices in under 5 seconds.  
>  
> Today, our prototype is fully interactive across Student, Faculty, and Admin roles using realistic demo data, proving how seamless college operations can be."*

## 8. Firebase Connection

The project is connected to the **Campus One FINAL** Firebase web app (`campus-one-final`).

- Firebase Web SDK initialization is in `js/firebase-config.js`.
- The existing localStorage demo data remains the default so the hackathon demo is not disrupted.
- Firebase App, Firestore, and Analytics are initialized in the browser.
- `useLiveFirebase` is intentionally `false` until the Firestore collections are seeded and the production authentication/rules flow is ready.
- Do **not** add Firebase service-account private keys to this frontend project.

When the backend is ready, change `this.useLiveFirebase = false` to `true` in `js/firebase-config.js` after seeding Firestore and configuring Firebase Authentication/rules.

