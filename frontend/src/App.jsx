import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { THEMES } from './components/ThemeConfig';
import SearchHeader from './components/SearchHeader';
import HeroCard from './components/HeroCard';
import HourlyForecast from './components/HourlyForecast';
import WeeklyForecast from './components/WeeklyForecast';
import LiveConditions from './components/LiveConditions';
import RecentlySearched from './components/RecentlySearched';
import WindMap from './components/WindMap';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    { name: 'Liverpool, UK', temp: 16, code: 2 },
    { name: 'Palermo, Italy', temp: -2, code: 95 }
  ]);

  // Fetch weather data from backend
  const fetchWeather = async (lat = null, lon = null, name = '') => {
    setLoading(true);
    try {
      let url = 'http://localhost:8080/api/weather';
      if (lat !== null && lon !== null) {
        url += `?lat=${lat}&lon=${lon}`;
        if (name) {
          url += `&location_name=${encodeURIComponent(name)}`;
        }
      } else if (name) {
        url += `?location_name=${encodeURIComponent(name)}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setWeather(data);

      // If we did a search, add it to recent searches list if not already present
      if (name) {
        setRecentSearches(prev => {
          const exists = prev.some(item => item.name.toLowerCase() === name.toLowerCase());
          if (exists) return prev;
          // Keep top 3
          return [{ name: data.location, temp: data.temp, code: data.hourly[0]?.code || 0 }, ...prev.slice(0, 2)];
        });
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchWeather(40.6782, -73.9442, 'Brooklyn, New York, USA');
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await fetch(`http://localhost:8080/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data);
        setShowSearchDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setSearching(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectCity = (city) => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchDropdown(false);
    fetchWeather(city.lat, city.lon, city.name);
  };

  if (loading && !weather) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#111216]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Loading weather dashboard...</p>
      </div>
    );
  }

  // Active theme based on active weather category
  const activeCategory = weather?.category || 'cloudy';
  const theme = THEMES[activeCategory] || THEMES.cloudy;

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 md:p-6 lg:p-8 transition-all duration-700 ${theme.pageBg} selection:bg-blue-500/30 selection:text-blue-200`}>
      {/* Full-width Weather App Container */}
      <div className={`relative w-full max-w-none transition-all duration-700 p-6 md:p-8 lg:p-10 ${theme.containerBg}`}>
        
        {/* Top Header Section */}
        <SearchHeader
          onRefresh={() => fetchWeather(weather?.lat, weather?.lon, weather?.location)}
          theme={theme}
          loading={loading}
        />

        {/* Dashboard Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Main Weather Stats & Forecasts (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <HeroCard weather={weather} theme={theme} />
            <HourlyForecast hourly={weather?.hourly} theme={theme} />
            <WeeklyForecast weekly={weather?.weekly} theme={theme} />
          </div>

          {/* RIGHT COLUMN: Live Conditions, Recent Searches, Wind Map (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <LiveConditions weather={weather} theme={theme} />
            <RecentlySearched
              recentSearches={recentSearches}
              theme={theme}
              onSelectCity={(lat, lon, name) => fetchWeather(null, null, name)}
            />
            <WindMap
              weather={weather}
              theme={theme}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchResults={searchResults}
              showSearchDropdown={showSearchDropdown}
              setShowSearchDropdown={setShowSearchDropdown}
              searching={searching}
              onSelectCity={handleSelectCity}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
