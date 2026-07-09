import React from 'react';
import { MapPin } from 'lucide-react';

export default function HeroCard({ weather, theme }) {
  if (!weather) return null;

  const getHeroBackgroundStyle = () => {
    if (weather.category === 'stormy') {
      return {
        backgroundImage: theme.heroBg,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return {
      background: theme.heroBg
    };
  };

  return (
    <div
      style={getHeroBackgroundStyle()}
      className="relative rounded-[30px] p-6 md:p-8 overflow-hidden border border-white/5 shadow-2xl transition-all duration-700 flex flex-col md:flex-row justify-between gap-6"
    >
      {/* Temp details & Condition */}
      <div className="flex flex-col justify-between z-10">
        <div>
          <h1 className="text-7xl md:text-8xl font-extrabold tracking-tight text-white mb-2 leading-none">
            {weather.temp}°
          </h1>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            {weather.condition}
          </h3>
          <p className="text-sm text-slate-200/80 mt-1 font-medium">
            {weather.description}
          </p>
        </div>

        {/* High/Low Badges */}
        <div className="flex items-center gap-3 mt-6">
          <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md text-xs font-semibold text-white">
            H {weather.high}°
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md text-xs font-semibold text-slate-300">
            L {weather.low}°
          </div>
        </div>
      </div>

      {/* Description Box - Location and Date info */}
      <div className="md:w-64 flex flex-col justify-end z-10">
        <div className="p-4 rounded-2xl border border-white/10 backdrop-blur-md flex items-start gap-2.5 transition-all duration-500 bg-black/25 text-white">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-white" />
          <div>
            <div className="font-bold text-sm leading-snug">{weather.location}</div>
            <div className="text-[10px] opacity-75 font-semibold mt-1">{weather.date}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
