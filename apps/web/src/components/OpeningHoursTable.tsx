import React from 'react';
import { OpeningHours } from '@cafefinder/shared';
import { Clock } from 'lucide-react';

export const OpeningHoursTable: React.FC<{ openingHours?: OpeningHours }> = ({ openingHours }) => {
  if (!openingHours?.weekdayText || openingHours.weekdayText.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 text-stone-500 dark:text-stone-400 text-sm">
        Operating hours not verified for this location.
      </div>
    );
  }

  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  const dayIndex = new Date().getDay();
  // Google Places weekdayText usually starts on Monday (index 0) to Sunday (index 6)
  const currentDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-3">
      <div className="flex items-center gap-2 font-bold text-sm text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-100 dark:border-stone-800">
        <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <span>Weekly Opening Hours</span>
      </div>

      <div className="space-y-2 text-xs sm:text-sm">
        {openingHours.weekdayText.map((line, idx) => {
          const isToday = line.toLowerCase().startsWith(currentDayName.toLowerCase());
          const [day, ...timeParts] = line.split(': ');
          const time = timeParts.join(': ');

          return (
            <div
              key={idx}
              className={`flex items-center justify-between py-1 px-2.5 rounded-lg transition-colors ${
                isToday
                  ? 'bg-amber-500/10 font-bold text-amber-700 dark:text-amber-300'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{day}</span>
                {isToday && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-white font-bold">
                    Today
                  </span>
                )}
              </div>
              <span className="font-mono font-medium">{time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
