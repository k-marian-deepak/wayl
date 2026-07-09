import React from 'react';
import { ChevronRight, Droplets, Wind, Gauge } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function LiveConditions({ weather, theme }) {
  if (!weather) return null;

  // Pre-process chart data for Recharts
  const chartData = weather.live_chart.map((temp, index) => ({
    name: index,
    temp: temp
  }));

  const activeCategory = weather.category || 'cloudy';

  return (
    <div className={`rounded-[30px] p-6 flex flex-col justify-between transition-all duration-500 ${theme.cardBg}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className={`text-sm font-bold tracking-wide transition-colors duration-500 ${theme.textMain}`}>
          Live Conditions
        </h4>
        <ChevronRight className={`w-4 h-4 cursor-pointer transition-colors duration-500 ${theme.textMuted}`} />
      </div>

      {/* Status and Percentage Badge */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs font-bold transition-colors duration-500 ${theme.textMuted}`}>
          ↑ {weather.live_chart_percentage}%
        </span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-500 ${
          weather.live_chart_status === 'Dangerous' 
            ? theme.badgeDangerous 
            : weather.live_chart_status === 'Caution' 
              ? theme.badgeCaution 
              : theme.badgeNormal
        }`}>
          {weather.live_chart_status}
        </span>
      </div>

      {/* Recharts Area Chart Curve */}
      <div className="w-full h-24 my-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id={`colorTemp-${activeCategory}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.liveCurveColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={theme.liveCurveColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="temp"
              stroke={theme.liveCurveColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#colorTemp-${activeCategory})`}
              dot={(props) => {
                const { cx, cy, index } = props;
                // Draw a highlighted dot on the middle point
                if (index === 6) {
                  return (
                    <circle cx={cx} cy={cy} r={4.5} fill="white" stroke={theme.liveCurveColor} strokeWidth={2.5} />
                  );
                }
                return null;
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-3 gap-1 border-t pt-4 mt-2 transition-all duration-500 ${theme.isLight ? 'border-slate-900/5' : 'border-white/5'}`}>
        <div className="flex flex-col items-center text-center">
          <div className={`p-1.5 rounded-lg mb-1.5 transition-all duration-500 bg-transparent ${theme.isLight ? 'text-sky-600' : 'text-sky-400'}`}>
            <Droplets className="w-4 h-4" />
          </div>
          <span className={`text-xs font-extrabold transition-colors duration-500 ${theme.textMain}`}>
            {weather.humidity}%
          </span>
          <span className={`text-[10px] font-bold mt-0.5 transition-colors duration-500 ${theme.textCardMuted}`}>
            Humidity
          </span>
        </div>

        <div className={`flex flex-col items-center text-center border-x px-1 transition-all duration-500 ${theme.isLight ? 'border-slate-900/5' : 'border-white/5'}`}>
          <div className={`p-1.5 rounded-lg mb-1.5 transition-all duration-500 bg-transparent ${theme.isLight ? 'text-teal-600' : 'text-teal-400'}`}>
            <Wind className="w-4 h-4" />
          </div>
          <span className={`text-xs font-extrabold transition-colors duration-500 ${theme.textMain}`}>
            {weather.wind_speed} km/h
          </span>
          <span className={`text-[10px] font-bold mt-0.5 transition-colors duration-500 ${theme.textCardMuted}`}>
            Wind
          </span>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className={`p-1.5 rounded-lg mb-1.5 transition-all duration-500 bg-transparent ${theme.isLight ? 'text-indigo-600' : 'text-indigo-400'}`}>
            <Gauge className="w-4 h-4" />
          </div>
          <span className={`text-xs font-extrabold transition-colors duration-500 ${theme.textMain}`}>
            {weather.pressure} kPa
          </span>
          <span className={`text-[10px] font-bold mt-0.5 transition-colors duration-500 ${theme.textCardMuted}`}>
            Pressure
          </span>
        </div>
      </div>
    </div>
  );
}
