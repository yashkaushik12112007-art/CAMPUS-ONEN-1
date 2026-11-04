import React, { useState } from 'react';
import { TimetableSlot } from '../../data/campusStore';
import { Calendar, Clock, MapPin, User, BookOpen, Filter } from 'lucide-react';

interface TimetableSectionProps {
  slots: TimetableSlot[];
}

export const TimetableSection: React.FC<TimetableSectionProps> = ({ slots }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [selectedDay, setSelectedDay] = useState<string>('Wednesday');

  const filteredSlots = slots.filter((s) => s.day === selectedDay);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-50 text-[#2463A6]">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#17324D]">
              Class Timetable & Schedule
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            B.Tech Computer Science & Engineering • 1st Year • Section A (Academic Year 2026-27)
          </p>
        </div>

        {/* Day Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {days.map((day) => {
            const isTomorrow = day === 'Wednesday';
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#2463A6] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {day}
                {isTomorrow && (
                  <span className={`ml-1 text-[10px] px-1 rounded ${
                    isSelected ? 'bg-cyan-300 text-[#17324D]' : 'bg-amber-100 text-amber-800'
                  }`}>
                    Tomorrow
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Slots List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSlots.map((slot, idx) => (
          <div
            key={slot.id}
            className="bg-white rounded-xl p-5 border border-slate-200 hover:border-[#2463A6]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#2463A6] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  <Clock className="w-3.5 h-3.5" />
                  {slot.time}
                </span>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    slot.type === 'Lab'
                      ? 'bg-teal-50 text-teal-700 border border-teal-200'
                      : slot.type === 'Tutorial'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {slot.type}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-400 font-mono">
                {slot.code}
              </div>
              <h3 className="text-base font-bold text-[#17324D] mt-0.5 line-clamp-2">
                {slot.subject}
              </h3>

              <div className="flex items-center gap-2 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{slot.faculty}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                <MapPin className="w-3.5 h-3.5 text-[#148A8A]" />
                {slot.room}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Slot #{idx + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
