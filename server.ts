import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System context about CampusOne
const CAMPUS_CONTEXT = `
You are CampusBot AI, the official intelligent assistant for CampusOne - "Your Entire College in One Place".
College Name: CampusOne Institute of Engineering & Technology (Demo Campus).
Academic Year: 2026-2027. Internal Hackathon Prototype (4 November 2026).
Team Leader: Yash Kaushik. Members: Shlok, Nandana, Tejpal.

Current Logged-in Student:
- Name: Aarav Sharma (ID: STU202401, Roll: 24CSE042)
- Program: B.Tech Computer Science & Engineering (1st Year)
- The 5 Core Subjects & Respective Faculty:
  1. Programming in C (CS-101) - Dr. Ritu Pahwa (Professor & HOD, Cabin B-304)
  2. Digital Electronics (EC-102) - Mrs. Yukti Mutreja (Associate Professor, Cabin B-310)
  3. System Modelling Techniques (CS-103) - Mr. Ankush (Assistant Professor, Cabin B-312)
  4. Engineering Physics (PH-101) - Dr. Deeksha (Associate Professor, Cabin C-201)
  5. Engineering Mechanics (ME-101) - Mr. Ashish Tyagi (Assistant Professor, Cabin D-101)

- Tomorrow's Schedule (Wednesday):
  * 09:00 - 10:00: Programming in C (CS-101) with Dr. Ritu Pahwa in Lecture Theatre LT-204
  * 10:00 - 11:00: Digital Electronics (EC-102) with Mrs. Yukti Mutreja in LT-204
  * 11:15 - 12:15: System Modelling Techniques (CS-103) with Mr. Ankush in LT-201
  * 13:00 - 15:00: Digital Electronics Lab (EC-102P) with Mrs. Yukti Mutreja in Digital Hardware Lab 2
  * 15:15 - 16:15: Engineering Physics (PH-101) with Dr. Deeksha in LT-204

Attendance Status (75% Minimum Mandatory Threshold):
- Programming in C (CS-101): 28/32 (87.5% - Safe)
- Digital Electronics (EC-102): 26/30 (86.7% - Safe)
- System Modelling Techniques (CS-103): 25/30 (83.3% - Safe)
- Engineering Physics (PH-101): 24/29 (82.8% - Safe)
- Engineering Mechanics (ME-101): 22/28 (78.6% - Borderline)
- Digital Electronics Lab (EC-102P): 18/26 (69.2% - CRITICAL SHORTAGE ALERT! Must attend next 4 consecutive lab sessions to cross 75%)
- Programming in C Lab (CS-101P): 23/26 (88.5% - Safe)
- Total Average: 82.1%

Faculty Information:
- Dr. Ritu Pahwa: Professor & HOD, CSE. Subject: Programming in C (CS-101). Cabin: Block B-304 (3rd Floor). Office Hours: Mon-Thu 2:00 PM - 4:00 PM. Status: Available.
- Mrs. Yukti Mutreja: Associate Professor, ECE. Subject: Digital Electronics (EC-102). Cabin: Block B-310 (3rd Floor). Office Hours: Mon-Fri 11:00 AM - 1:00 PM. Status: In Lecture.
- Mr. Ankush: Assistant Professor, CSE. Subject: System Modelling Techniques (CS-103). Cabin: Block B-312 (3rd Floor). Office Hours: Tue-Fri 3:00 PM - 5:00 PM. Status: Available.
- Dr. Deeksha: Associate Professor, Applied Sciences. Subject: Engineering Physics (PH-101). Cabin: Block C-201 (2nd Floor). Office Hours: Wed-Fri 10:00 AM - 12:00 PM. Status: In Office.
- Mr. Ashish Tyagi: Assistant Professor, Mech/Engg. Subject: Engineering Mechanics (ME-101). Cabin: Block D-101 (1st Floor). Office Hours: Mon-Wed 1:00 PM - 3:00 PM. Status: Available.

Pending Documents & Deadlines:
- Anti-Ragging Affidavit: Verified (Ref #DOC-8821)
- Hostel Clearance Form: Pending Verification (Ref #DOC-9042)
- Fee Concession Undertaking: Rejected (Income certificate stamp missing, needs re-upload)
- Programming in C - Pointers & Memory Allocation Assignment: Due Tomorrow at 11:59 PM (Dr. Ritu Pahwa)
- Examination Fee (₹2,500): Due by 15 November 2026

Canteen Live Highlights:
- Special Veg Thali Meal: ₹90 (Hot & fresh)
- Cold Coffee with Ice Cream: ₹40
- Digital pickup tokens available to skip lunch counter queues.

Instructions for CampusBot:
- Always be helpful, concise, academic, and friendly.
- Format responses nicely with bullet points, bold highlights, and clear next steps.
- When asked about courses, clearly answer with the 5 subjects and their teachers:
  1. Programming in C - Dr. Ritu Pahwa
  2. Digital Electronics - Mrs. Yukti Mutreja
  3. System Modelling Techniques - Mr. Ankush
  4. Engineering Physics - Dr. Deeksha
  5. Engineering Mechanics - Mr. Ashish Tyagi
- If asked about tomorrow's classes, list times, room numbers, and teachers for tomorrow Wednesday.
- If asked about attendance, clearly explain the 75% rule and warn about Digital Electronics Lab (EC-102P) shortage.
- If asked about teachers or cabins, give their exact location (e.g. Dr. Ritu Pahwa in B-304, Mrs. Yukti Mutreja in B-310, Mr. Ankush in B-312, Dr. Deeksha in C-201, Mr. Ashish Tyagi in D-101).
- Always note that this is live CampusOne demo data.
`;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'CampusOne',
    version: '1.0.0',
    mode: 'Hackathon Demo Ready',
    timestamp: new Date().toISOString(),
  });
});

// CampusBot AI endpoint powered by Gemini 3.8 Flash
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Function to generate grounded answer from campus context
    const getGroundedReply = (userQuery: string) => {
      const lower = userQuery.toLowerCase();
      if (lower.includes('tomorrow') || lower.includes('class') || lower.includes('schedule')) {
        return `**📅 Tomorrow at College (Wednesday for Aarav Sharma - 1st Year B.Tech CSE):**\n\n• **09:00 - 10:00 AM**: Programming in C (CS-101) with **Dr. Ritu Pahwa** in **LT-204**\n• **10:00 - 11:00 AM**: Digital Electronics (EC-102) with **Mrs. Yukti Mutreja** in **LT-204**\n• **11:15 - 12:15 PM**: System Modelling Techniques (CS-103) with **Mr. Ankush** in **LT-201**\n• **01:00 - 03:00 PM**: Digital Electronics Lab (EC-102P) with **Mrs. Yukti Mutreja** in **Digital Hardware Lab 2**\n• **03:15 - 04:15 PM**: Engineering Physics (PH-101) with **Dr. Deeksha** in **LT-204**\n\n⚠️ **Urgent Action:** Programming in C Assignment (Pointers & Memory Allocation) for Dr. Ritu Pahwa is due tomorrow night at 11:59 PM!`;
      } else if (lower.includes('subject') || lower.includes('course') || lower.includes('curriculum')) {
        return `**📚 Your 5 Official Core Subjects & Faculty:**\n\n1. **Programming in C (CS-101)** — **Dr. Ritu Pahwa** (Professor & HOD, CSE • Cabin B-304)\n2. **Digital Electronics (EC-102)** — **Mrs. Yukti Mutreja** (Associate Professor, ECE • Cabin B-310)\n3. **System Modelling Techniques (CS-103)** — **Mr. Ankush** (Assistant Professor, CSE • Cabin B-312)\n4. **Engineering Physics (PH-101)** — **Dr. Deeksha** (Associate Professor • Cabin C-201)\n5. **Engineering Mechanics (ME-101)** — **Mr. Ashish Tyagi** (Assistant Professor • Cabin D-101)`;
      } else if (lower.includes('attendance') || lower.includes('75') || lower.includes('shortage')) {
        return `**📊 Attendance Health Report (75% Threshold Rule):**\n\n• **Overall Attendance:** 82.1% (Healthy)\n• **Programming in C (Dr. Ritu Pahwa):** 28/32 (**87.5%** ✅ Safe)\n• **Digital Electronics (Mrs. Yukti Mutreja):** 26/30 (**86.7%** ✅ Safe)\n• **System Modelling Techniques (Mr. Ankush):** 25/30 (**83.3%** ✅ Safe)\n• **Engineering Physics (Dr. Deeksha):** 24/29 (**82.8%** ✅ Safe)\n• **Engineering Mechanics (Mr. Ashish Tyagi):** 22/28 (**78.6%** ⚠️ Watch out)\n• **Digital Electronics Lab (EC-102P):** 18/26 (**69.2%** 🚨 **CRITICAL SHORTAGE**)\n\n👉 **Shortage Recovery:** You must attend tomorrow's 2-hour Digital Electronics Lab (EC-102P) with Mrs. Yukti Mutreja! You need **4 consecutive sessions** to cross the 75% examination threshold.`;
      } else if (lower.includes('ritu') || lower.includes('yukti') || lower.includes('ankush') || lower.includes('deeksha') || lower.includes('ashish') || lower.includes('cabin') || lower.includes('where is') || lower.includes('faculty') || lower.includes('teacher')) {
        return `**👨‍🏫 Faculty Cabins & Office Locations:**\n\n• **1. Dr. Ritu Pahwa** (Programming in C):\n  - Cabin: **Block B, Room 304 (3rd Floor)**\n  - Office Hours: Mon-Thu 2:00 PM - 4:00 PM (🟢 Available)\n\n• **2. Mrs. Yukti Mutreja** (Digital Electronics):\n  - Cabin: **Block B, Room 310 (3rd Floor)**\n  - Office Hours: Mon-Fri 11:00 AM - 1:00 PM (🟡 In Lecture)\n\n• **3. Mr. Ankush** (System Modelling Techniques):\n  - Cabin: **Block B, Room 312 (3rd Floor)**\n  - Office Hours: Tue-Fri 3:00 PM - 5:00 PM (🟢 Available)\n\n• **4. Dr. Deeksha** (Engineering Physics):\n  - Cabin: **Block C, Room 201 (2nd Floor)**\n  - Office Hours: Wed-Fri 10:00 AM - 12:00 PM (🔵 In Office)\n\n• **5. Mr. Ashish Tyagi** (Engineering Mechanics):\n  - Cabin: **Block D, Room 101 (1st Floor)**\n  - Office Hours: Mon-Wed 1:00 PM - 3:00 PM (🟢 Available)`;
      } else if (lower.includes('canteen') || lower.includes('food') || lower.includes('menu')) {
        return `**🍽️ Campus Canteen Live Highlights Today:**\n\n• **Special Veg Thali Meal**: ₹90 (Dal Makhani, Shahi Paneer, 3 Butter Rotis, Jeera Rice, Salad, Gulab Jamun)\n• **Cold Coffee with Ice Cream**: ₹40 (Chilled & Fresh)\n• **Masala Dosa**: ₹60 (Coconut & Tomato Chutneys)\n• **Paneer Kathi Roll**: ₹70\n\n💡 *Tip: Place an order on the Canteen tab to get a live digital token number and skip the lunch rush!*`;
      } else if (lower.includes('fee') || lower.includes('receipt') || lower.includes('document')) {
        return `**📁 Documents & Fees Summary:**\n\n• **Tuition Fee (1st Year):** ₹65,000 (**Paid** - Receipt #REC-2026-8812)\n• **Examination Fee:** ₹2,500 (**Pending** - Due by 15 November 2026)\n• **Anti-Ragging Affidavit:** ✅ Verified by Proctor Office\n• **Hostel Clearance:** ⏳ Pending review at Dean Office\n• **Fee Concession:** ❌ Rejected (Missing Tehsildar income stamp; please re-upload in My Documents)`;
      }
      return `Hello Aarav! I am **CampusBot AI**, your unified assistant for CampusOne. I have instant access to your 5 core courses:\n1. **Programming in C** (Dr. Ritu Pahwa)\n2. **Digital Electronics** (Mrs. Yukti Mutreja)\n3. **System Modelling Techniques** (Mr. Ankush)\n4. **Engineering Physics** (Dr. Deeksha)\n5. **Engineering Mechanics** (Mr. Ashish Tyagi)\n\nI can help you check your timetable, 75% attendance tracker, faculty cabin locations, document clearances, and cafeteria orders. How can I help you today?`;
    };

    if (!process.env.GEMINI_API_KEY) {
      res.json({ reply: getGroundedReply(message), source: 'campus_grounded_fallback' });
      return;
    }

    try {
      const contents: any[] = [];
      if (Array.isArray(conversationHistory)) {
        for (const turn of conversationHistory.slice(-6)) {
          if (turn.role && turn.content) {
            contents.push({
              role: turn.role === 'user' ? 'user' : 'model',
              parts: [{ text: turn.content }],
            });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: CAMPUS_CONTEXT,
        },
      });

      const reply = response.text || getGroundedReply(message);
      res.json({ reply, source: 'gemini-3.8-flash' });
    } catch (modelErr: any) {
      console.warn('Gemini API call failed or busy, using grounded campus fallback:', modelErr?.message);
      res.json({ reply: getGroundedReply(message), source: 'campus_grounded_fallback' });
    }
  } catch (error: any) {
    console.error('Server chat error:', error);
    res.status(500).json({
      error: 'Failed to process AI query',
      details: error?.message || String(error),
    });
  }
});

// Setup Vite middleware for local development
async function startServer() {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(__dirname, 'dist'))) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log('================================================================');
    console.log(' CAMPUSONE - UNIFIED COLLEGE OPERATING PLATFORM');
    console.log(` Dev server running live on: http://localhost:${PORT}`);
    console.log(' APIs:');
    console.log(` • Health Check:  http://localhost:${PORT}/api/health`);
    console.log(` • CampusBot AI:  http://localhost:${PORT}/api/chat (Gemini 3.8 Flash)`);
    console.log('================================================================');
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
