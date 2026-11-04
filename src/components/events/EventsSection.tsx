import React from 'react';
import { EventItem } from '../../data/campusStore';
import { Ticket, Calendar, MapPin, Users, CheckCircle2, Sparkles } from 'lucide-react';

interface EventsSectionProps {
  events: EventItem[];
  onToggleRsvp: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  events,
  onToggleRsvp,
  onShowToast,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-purple-50 text-purple-700">
            <Ticket className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-[#17324D]">
              Campus Fests, Hackathons & Workshops
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              RSVP to claim your official digital participant pass and certificates
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-[#2463A6]/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                  {evt.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {evt.badge}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#17324D]">{evt.title}</h3>
              <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                {evt.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#2463A6] shrink-0" />
                  <span>{evt.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#148A8A] shrink-0" />
                  <span>{evt.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span>Organized by {evt.organizer}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  onToggleRsvp(evt.id);
                  onShowToast(
                    evt.isRsvp
                      ? `RSVP cancelled for ${evt.title}`
                      : `RSVP Confirmed! Digital Entry Pass sent for ${evt.title}`
                  );
                }}
                className={`w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  evt.isRsvp
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-[#17324D] text-white hover:bg-[#102438] shadow-xs'
                }`}
              >
                {evt.isRsvp ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>RSVP Confirmed (Ticket #CAMPUS-{evt.id})</span>
                  </>
                ) : (
                  <span>1-Click RSVP & Get Pass →</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
