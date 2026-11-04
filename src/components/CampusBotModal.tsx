import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Calendar, 
  CheckSquare, 
  MapPin, 
  UtensilsCrossed, 
  RotateCcw 
} from 'lucide-react';

interface CampusBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  source?: string;
}

export const CampusBotModal: React.FC<CampusBotModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content:
        'Hello Aarav! I am **CampusBot AI**, your unified campus intelligence assistant. Ask me about your classes tomorrow, your 75% attendance health, faculty cabins, or today’s cafeteria menu!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chips = [
    { label: '📅 Tomorrow classes', query: 'What classes and labs do I have tomorrow?' },
    { label: '📊 75% attendance health', query: 'Check my attendance health and 75% shortage warning.' },
    { label: '👨‍🏫 Where is Dr. Ritu Pahwa?', query: 'Where is Dr. Ritu Pahwa cabin (Programming in C)?' },
    { label: '👩‍🏫 Where is Mrs. Yukti Mutreja?', query: 'Where is Mrs. Yukti Mutreja cabin (Digital Electronics)?' },
    { label: '🍽️ Today’s canteen menu', query: 'What are today’s cafeteria specials and price?' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (initialPrompt) {
        handleSendMessage(initialPrompt);
      }
    }
  }, [isOpen, initialPrompt]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      if (data && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'model',
            content: data.reply,
            source: data.source,
          },
        ]);
      } else {
        throw new Error(data.error || 'No response returned');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'model',
          content:
            'I experienced a connection issue reaching the AI backend. Please verify that your dev server is active and try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full h-[620px] max-h-[90vh] shadow-2xl border border-slate-300 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#17324D] to-[#2463A6] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight text-white">
                  CampusBot AI
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-400 text-[#17324D]">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-cyan-100">
                Live contextual answers from the campus database
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                setMessages([
                  {
                    id: 'welcome',
                    role: 'model',
                    content:
                      'Hello Aarav! How can I assist you with your campus schedule or academic records today?',
                  },
                ])
              }
              className="p-1.5 text-cyan-200 hover:text-white rounded-lg transition-colors"
              title="Clear chat history"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-cyan-200 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto shrink-0">
          {chips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip.query)}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-full transition-all shrink-0 shadow-2xs hover:border-[#2463A6]"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
          {messages.map((m) => {
            const isUser = m.role === 'user';

            return (
              <div
                key={m.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-[#17324D] text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    <Bot className="w-4 h-4 text-cyan-300" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#2463A6] text-white rounded-tr-none font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {m.content}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-[#17324D] flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
              <span className="w-2 h-2 rounded-full bg-[#2463A6] animate-ping" />
              <span>CampusBot is querying campus records...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about tomorrow's classes, attendance, professors, canteen..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#2463A6] bg-slate-50/50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-[#2463A6] hover:bg-[#1D538D] text-white disabled:opacity-50 transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
