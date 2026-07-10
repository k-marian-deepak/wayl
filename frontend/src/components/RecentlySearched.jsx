import React from 'react';
import { ChevronRight } from 'lucide-react';
import { getWeatherIconSmall } from './WeatherIcons';

export default function RecentlySearched({ recentSearches, theme, onSelectCity }) {
  return (
    <div className={`rounded-[30px] p-6 transition-all duration-500 ${theme.cardBg}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className={`text-sm font-bold tracking-wide transition-colors duration-500 ${theme.textMain}`}>
          Recently Searched
        </h4>
        <button className={`text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors duration-500 ${theme.textMuted}`}>
          See All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Items List */}
      <div className="flex flex-col gap-3">
        {recentSearches.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelectCity(item.lat, item.lon, item.name)}
            className="w-full flex items-center justify-between transition-all duration-500 text-left group cursor-pointer bg-transparent border-0 p-0"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl border border-transparent bg-transparent transition-all duration-500 ${
                theme.isLight 
                  ? 'text-slate-700' 
                  : 'text-slate-300'
              } group-hover:text-blue-500`}>
                {getWeatherIconSmall(item.code)}
              </div>
              <div>
                <h5 className={`text-sm font-bold transition-colors duration-500 ${theme.textMain}`}>
                  {item.name}
                </h5>
                <p className={`text-xs font-semibold mt-0.5 transition-colors duration-500 ${theme.textCardMuted}`}>
                  {item.code >= 95 ? 'Rain/Thunder' : item.code >= 51 ? 'Rainy' : 'Partly Cloudy'}
                </p>
              </div>
            </div>
            <span className={`text-lg font-black transition-colors duration-500 ${theme.textMain}`}>
              {item.temp}°
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
