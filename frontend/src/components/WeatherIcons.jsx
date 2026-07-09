import React from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog
} from 'lucide-react';

// Map Open-Meteo weather codes to Lucide icons
export const getWeatherIcon = (code) => {
  if (code === 0 || code === 1) return <Sun className="w-8 h-8 text-amber-400" />;
  if (code === 2 || code === 3) return <Cloud className="w-8 h-8 text-slate-300" />;
  if (code >= 51 && code <= 67) return <CloudRain className="w-8 h-8 text-sky-400" />;
  if (code >= 80 && code <= 82) return <CloudRain className="w-8 h-8 text-sky-400" />;
  if (code >= 71 && code <= 77) return <CloudSnow className="w-8 h-8 text-blue-200" />;
  if (code >= 85 && code <= 86) return <CloudSnow className="w-8 h-8 text-blue-200" />;
  if (code >= 95 && code <= 99) return <CloudLightning className="w-8 h-8 text-purple-400" />;
  if (code === 45 || code === 48) return <CloudFog className="w-8 h-8 text-slate-400" />;
  return <Cloud className="w-8 h-8 text-slate-300" />;
};

export const getWeatherIconSmall = (code) => {
  if (code === 0 || code === 1) return <Sun className="w-5 h-5 text-amber-400" />;
  if (code === 2 || code === 3) return <Cloud className="w-5 h-5 text-slate-300" />;
  if (code >= 51 && code <= 67) return <CloudRain className="w-5 h-5 text-sky-400" />;
  if (code >= 80 && code <= 82) return <CloudRain className="w-5 h-5 text-sky-400" />;
  if (code >= 71 && code <= 77) return <CloudSnow className="w-5 h-5 text-blue-200" />;
  if (code >= 85 && code <= 86) return <CloudSnow className="w-5 h-5 text-blue-200" />;
  if (code >= 95 && code <= 99) return <CloudLightning className="w-5 h-5 text-purple-400" />;
  if (code === 45 || code === 48) return <CloudFog className="w-5 h-5 text-slate-400" />;
  return <Cloud className="w-5 h-5 text-slate-300" />;
};
