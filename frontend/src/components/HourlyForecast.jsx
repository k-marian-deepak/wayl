import React from 'react';
import { getWeatherIcon } from './WeatherIcons';

export default function HourlyForecast({ hourly, theme }) {
  if (!hourly) return null;

  return (
    <div className={`rounded-[30px] p-6 transition-all duration-500 ${theme.cardBg}`}>
      <h4 className={`text-sm font-bold uppercase tracking-wider mb-5 transition-colors duration-500 ${theme.textHeader}`}>
        Hourly Forecast
      </h4>
      <div className="grid grid-cols-8 gap-1 sm:gap-2">
        {hourly.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center py-3 rounded-2xl border border-transparent transition-all duration-300 ${theme.hourlyItemBg}`}
          >
            <span className={`text-[10px] sm:text-xs font-semibold mb-2 transition-colors duration-500 ${theme.textMuted}`}>
              {item.time}
            </span>
            <div className="my-1.5">
              {getWeatherIcon(item.code)}
            </div>
            {item.precipitation > 0 ? (
              <span className="text-[9px] sm:text-[10px] font-bold text-sky-500 mb-1.5">
                {item.precipitation}%
              </span>
            ) : (
              <span className="text-[9px] sm:text-[10px] text-transparent mb-1.5">-</span>
            )}
            <span className={`text-sm sm:text-base font-bold transition-colors duration-500 ${theme.textMain}`}>
              {item.temp}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
