import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function SearchHeader({
  loading,
  theme,
  onRefresh
}) {
  return (
    <div className="flex items-center justify-between gap-4 mb-8">
      {/* Brand logo/title */}
      <div className="flex items-center gap-3">
        <h1 className={`text-3xl font-black tracking-[0.25em] transition-all duration-500 ${
          theme.isLight 
            ? 'text-sky-950 bg-gradient-to-r from-sky-950 to-blue-900 bg-clip-text text-transparent' 
            : 'text-white bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent'
        }`} style={{ fontFamily: '"Arial Black", "Impact", sans-serif' }}>
          WAYL
        </h1>
      </div>

      {/* Refresh button */}
      <button
        onClick={onRefresh}
        className={`p-3 rounded-2xl border border-transparent bg-transparent transition-all duration-500 cursor-pointer ${
          theme.isLight 
            ? 'text-slate-700 hover:bg-slate-950/10 hover:text-slate-900' 
            : 'text-slate-300 hover:bg-white/10 hover:text-white'
        }`}
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}
