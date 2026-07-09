import React from 'react';
import { getWeatherIconSmall } from './WeatherIcons';

export default function WeeklyForecast({ weekly, theme }) {
  if (!weekly) return null;

  return (
    <div className={`rounded-[30px] p-6 transition-all duration-500 ${theme.cardBg}`}>
      <h4 className={`text-sm font-bold uppercase tracking-wider mb-5 transition-colors duration-500 ${theme.textHeader}`}>
        7-Day Forecast
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {weekly.map((day, index) => (
          <div
            key={index}
            className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ${theme.recentCardBg}`}
          >
            <span className={`text-xs font-bold mb-2 transition-colors duration-500 ${theme.textMuted}`}>
              {day.day}
            </span>
            <div className="my-2">
              {getWeatherIconSmall(day.code)}
            </div>
            {day.precipitation > 0 ? (
              <span className="text-[9px] font-bold text-sky-500 mb-2">
                {day.precipitation}%
              </span>
            ) : (
              <span className="text-[9px] text-transparent mb-2">-</span>
            )}
            <div className="flex flex-col items-center">
              <span className={`text-sm font-extrabold transition-colors duration-500 ${theme.textMain}`}>
                {day.temp_max}°
              </span>
              <span className={`text-xs font-medium transition-colors duration-500 ${theme.textCardMuted}`}>
                {day.temp_min}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
