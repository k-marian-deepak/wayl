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
import { fetchWeatherDirect, searchCitiesDirect } from './utils/weatherApi';

const BACKEND_URL = 'http://localhost:8080';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const [isBackendAlive, setIsBackendAlive] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    { name: 'Liverpool, UK', temp: 16, code: 2, lat: 53.4084, lon: -2.9916 },
    { name: 'Palermo, Italy', temp: -2, code: 95, lat: 38.1157, lon: 13.3614 }
  ]);

  // Fetch weather data with backend-first, client-side fallback
  const fetchWeather = async (lat = null, lon = null, name = '') => {
    setLoading(true);
    try {
      let data = null;
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

      if (isLocalhost && isBackendAlive) {
        try {
          let url = `${BACKEND_URL}/api/weather`;
          if (lat !== null && lon !== null) {
            url += `?lat=${lat}&lon=${lon}`;
            if (name) {
              url += `&location_name=${encodeURIComponent(name)}`;
            }
          } else if (name) {
            url += `?location_name=${encodeURIComponent(name)}`;
          }

          const response = await fetch(url);
          if (response.ok) {
            data = await response.json();
          }
        } catch (err) {
          console.warn("Backend offline, falling back to direct client-side fetch", err);
        }
      }

      // Fallback if not on localhost or if backend fetch failed/timed out
      if (!data) {
        data = await fetchWeatherDirect(lat, lon, name);
      }

      setWeather(data);

      // If we did a search, add it to recent searches list if not already present
      if (name) {
        setRecentSearches(prev => {
          const exists = prev.some(item => item.name.toLowerCase() === name.toLowerCase());
          if (exists) return prev;
          return [{
            name: data.location,
            temp: data.temp,
            code: data.hourly[0]?.code || 0,
            lat: data.lat,
            lon: data.lon
          }, ...prev.slice(0, 2)];
        });
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
  };

  // Probe backend aliveness on start
  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) return;

    const probeBackend = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300);
        const response = await fetch(`${BACKEND_URL}/`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (response.ok) {
          setIsBackendAlive(true);
        }
      } catch (e) {
        console.info("Local backend down. Running fully client-side.");
      }
    };
    probeBackend();
  }, []);

  // Initial load
  useEffect(() => {
    fetchWeather(40.6782, -73.9442, 'Brooklyn, New York, USA');
  }, [isBackendAlive]); // Re-fetch once backend status is probed

  // Fetch search suggestions with backend-first, client-side fallback
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearching(true);
      try {
        let data = null;
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        if (isLocalhost && isBackendAlive) {
          try {
            const response = await fetch(`${BACKEND_URL}/api/search?q=${encodeURIComponent(searchQuery)}`);
            if (response.ok) {
              data = await response.json();
            }
          } catch (err) {
            console.warn("Backend offline, falling back to direct client-side search", err);
          }
        }

        if (!data) {
          data = await searchCitiesDirect(searchQuery);
        }

        setSearchResults(data);
        setShowSearchDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setSearching(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, isBackendAlive]);

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
              onSelectCity={(lat, lon, name) => fetchWeather(lat, lon, name)}
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
