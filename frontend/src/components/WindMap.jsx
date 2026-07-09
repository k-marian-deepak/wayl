import React, { useEffect, useRef } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

// Helper component to change Leaflet center dynamically
function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 11);
    }
  }, [center, map]);
  return null;
}

// Generate dynamic map divIcon based on active color
const getCustomMapIcon = (color) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="map-pulsing-pin" style="background-color: ${color}"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

export default function WindMap({
  weather,
  theme,
  searchQuery,
  setSearchQuery,
  searchResults,
  showSearchDropdown,
  setShowSearchDropdown,
  searching,
  onSelectCity
}) {
  const containerRef = useRef(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSearchDropdown]);

  if (!weather) return null;

  return (
    <div className={`rounded-[30px] p-6 overflow-hidden flex flex-col justify-between transition-all duration-500 ${theme.cardBg}`}>
      {/* Header with Title and Search Input */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h4 className={`text-sm font-bold tracking-wide transition-colors duration-500 ${theme.textMain}`}>
            Location
          </h4>
          <p className={`text-xs font-semibold mt-1 transition-colors duration-500 ${theme.textMuted}`}>
            {weather.wind_speed} km/h {weather.wind_direction}
          </p>
        </div>

        {/* Search Input Container */}
        <div ref={containerRef} className="relative w-48 sm:w-56">
          <div className="relative flex items-center">
            <Search className={`absolute left-3 w-4 h-4 transition-colors duration-500 ${theme.isLight ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city..."
              className={`w-full pl-9 pr-9 py-2 rounded-xl border text-xs focus:outline-none transition-all duration-500 ${theme.searchClass}`}
              onFocus={() => setShowSearchDropdown(true)}
            />
            {searching && (
              <Loader2 className="absolute right-3 w-3.5 h-3.5 text-blue-500 animate-spin" />
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className={`absolute z-[1010] w-full mt-1.5 rounded-xl border shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-500 ${theme.isLight ? 'bg-white/95 border-slate-200' : 'bg-[#1e202a]/95 border-white/10'}`}>
              {searchResults.map((city) => (
                <button
                  key={city.id}
                  onClick={() => onSelectCity(city)}
                  className={`w-full text-left px-3.5 py-2.5 text-xs border-b last:border-0 transition-colors flex items-center justify-between ${theme.isLight ? 'hover:bg-slate-100 text-slate-800 border-slate-100' : 'hover:bg-white/5 text-slate-200 border-white/5'}`}
                >
                  <span>{city.name}</span>
                  <span className={`text-[10px] uppercase tracking-wider ${theme.isLight ? 'text-slate-400' : 'text-slate-500'}`}>{city.country_code}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Leaflet Map Integration */}
      <div className={`relative w-full h-[200px] rounded-2xl overflow-hidden border shadow-inner transition-colors duration-500 ${theme.isLight ? 'border-slate-200' : 'border-white/5'}`}>
        <MapContainer
          center={[weather.lat, weather.lon]}
          zoom={11}
          scrollWheelZoom={false}
          zoomControl={false}
          className="w-full h-full"
        >
          {/* Dynamic Map Tiles based on Light/Dark Theme */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={theme.mapTiles}
          />
          <Marker position={[weather.lat, weather.lon]} icon={getCustomMapIcon(theme.mapPinColor)} />
          <ChangeMapView center={[weather.lat, weather.lon]} />
        </MapContainer>

        {/* Floating Map Pin details */}
        <div className={`absolute bottom-2.5 right-2.5 z-[1000] p-2 rounded-xl border backdrop-blur-md text-[10px] flex items-center gap-1 font-semibold transition-all duration-500 ${
          theme.isLight 
            ? 'bg-white/80 border-slate-200 text-slate-700' 
            : 'bg-black/60 border-white/5 text-slate-300'
        }`}>
          <MapPin className={`w-3 h-3 ${theme.isLight ? 'text-sky-600' : 'text-blue-400'}`} />
          <span>Pinpoint Location</span>
        </div>
      </div>
    </div>
  );
}
