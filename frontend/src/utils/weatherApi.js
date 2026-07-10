// Helper: map Open-Meteo weather codes to our simple categories and conditions
export function mapWeatherCode(code) {
  const mapping = {
    0: { condition: "Sunny", description: "Clear sky", category: "sunny" },
    1: { condition: "Mainly Clear", description: "Mainly clear sky", category: "sunny" },
    2: { condition: "Partly Cloudy", description: "Partly cloudy", category: "cloudy" },
    3: { condition: "Overcast", description: "Overcast clouds", category: "cloudy" },
    45: { condition: "Foggy", description: "Fog and depositing rime fog", category: "foggy" },
    48: { condition: "Foggy", description: "Depositing rime fog", category: "foggy" },
    51: { condition: "Drizzle", description: "Light drizzle", category: "rainy" },
    53: { condition: "Drizzle", description: "Moderate drizzle", category: "rainy" },
    55: { condition: "Drizzle", description: "Dense drizzle", category: "rainy" },
    56: { condition: "Freezing Drizzle", description: "Light freezing drizzle", category: "rainy" },
    57: { condition: "Freezing Drizzle", description: "Dense freezing drizzle", category: "rainy" },
    61: { condition: "Rainy", description: "Slight rain", category: "rainy" },
    63: { condition: "Rainy", description: "Moderate rain", category: "rainy" },
    65: { condition: "Rainy", description: "Heavy rain", category: "rainy" },
    66: { condition: "Freezing Rain", description: "Light freezing rain", category: "rainy" },
    67: { condition: "Freezing Rain", description: "Heavy freezing rain", category: "rainy" },
    71: { condition: "Snowy", description: "Slight snow fall", category: "snowy" },
    73: { condition: "Snowy", description: "Moderate snow fall", category: "snowy" },
    75: { condition: "Snowy", description: "Heavy snow fall", category: "snowy" },
    77: { condition: "Snowy", description: "Snow grains", category: "snowy" },
    80: { condition: "Showers", description: "Slight rain showers", category: "rainy" },
    81: { condition: "Showers", description: "Moderate rain showers", category: "rainy" },
    82: { condition: "Showers", description: "Violent rain showers", category: "rainy" },
    85: { condition: "Snow Showers", description: "Slight snow showers", category: "snowy" },
    86: { condition: "Snow Showers", description: "Heavy snow showers", category: "snowy" },
    95: { condition: "Stormy", description: "Thunderstorm", category: "stormy" },
    96: { condition: "Stormy", description: "Thunderstorm with slight hail", category: "stormy" },
    99: { condition: "Stormy", description: "Thunderstorm with heavy hail", category: "stormy" }
  };
  return mapping[code] || { condition: "Partly Cloudy", description: "Partly cloudy", category: "cloudy" };
}

// Helper: Get wind direction abbreviation
export function getWindDirectionLabel(degrees) {
  const val = Math.floor((degrees / 22.5) + 0.5);
  const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return arr[val % 16];
}

// Standard mock data matching the backend
export const MOCK_WEATHER = {
  "Brooklyn, New York, USA": {
    location: "Brooklyn, New York, USA",
    date: "Friday, January 4",
    temp: 18,
    condition: "Stormy",
    description: "with partly cloudy",
    category: "stormy",
    high: 29,
    low: 12,
    infoText: "With real time data and advanced technology, we provide reliable forecasts for any location around the world.",
    humidity: 78,
    wind_speed: 12,
    wind_direction: "NW",
    wind_deg: 315,
    pressure: 1.0,
    live_chart: [15, 16, 17, 18, 17, 16, 15, 14, 16, 18, 19, 18],
    live_chart_percentage: 23.8,
    live_chart_status: "Dangerous",
    hourly: [
      { time: "Now", temp: 18, code: 95, precipitation: 60 },
      { time: "2 PM", temp: 19, code: 95, precipitation: 60 },
      { time: "3 PM", temp: 20, code: 2, precipitation: 20 },
      { time: "4 PM", temp: 20, code: 2, precipitation: 60 },
      { time: "5 PM", temp: 19, code: 3, precipitation: 60 },
      { time: "6 PM", temp: 18, code: 3, precipitation: 10 },
      { time: "7 PM", temp: 17, code: 3, precipitation: 5 },
      { time: "8 PM", temp: 16, code: 0, precipitation: 0 }
    ],
    weekly: [
      { day: "Sun", temp_max: 28, temp_min: 12, code: 0, precipitation: 0 },
      { day: "Mon", temp_max: 26, temp_min: 11, code: 2, precipitation: 10 },
      { day: "Tue", temp_max: 27, temp_min: 12, code: 2, precipitation: 10 },
      { day: "Wed", temp_max: 23, temp_min: 13, code: 61, precipitation: 60 },
      { day: "Thu", temp_max: 30, temp_min: 14, code: 0, precipitation: 0 },
      { day: "Fri", temp_max: 23, temp_min: 10, code: 2, precipitation: 20 },
      { day: "Sat", temp_max: 24, temp_min: 9, code: 0, precipitation: 0 }
    ],
    lat: 40.6782,
    lon: -73.9442
  },
  "Liverpool, UK": {
    location: "Liverpool, UK",
    date: "Friday, January 4",
    temp: 16,
    condition: "Partly Cloudy",
    description: "with gentle breeze",
    category: "cloudy",
    high: 18,
    low: 10,
    infoText: "Overcast skies with light wind. Ideal weather for indoor activities or a stroll in the park with a light jacket.",
    humidity: 65,
    wind_speed: 15,
    wind_direction: "W",
    wind_deg: 270,
    pressure: 1.01,
    live_chart: [14, 14, 15, 16, 16, 15, 14, 13, 12, 12, 13, 14],
    live_chart_percentage: 12.5,
    live_chart_status: "Normal",
    hourly: [
      { time: "Now", temp: 16, code: 2, precipitation: 10 },
      { time: "2 PM", temp: 16, code: 2, precipitation: 10 },
      { time: "3 PM", temp: 17, code: 2, precipitation: 15 },
      { time: "4 PM", temp: 17, code: 1, precipitation: 5 },
      { time: "5 PM", temp: 16, code: 1, precipitation: 5 },
      { time: "6 PM", temp: 15, code: 3, precipitation: 20 },
      { time: "7 PM", temp: 14, code: 3, precipitation: 30 },
      { time: "8 PM", temp: 13, code: 61, precipitation: 55 }
    ],
    weekly: [
      { day: "Sun", temp_max: 17, temp_min: 9, code: 2, precipitation: 10 },
      { day: "Mon", temp_max: 16, temp_min: 10, code: 3, precipitation: 30 },
      { day: "Tue", temp_max: 15, temp_min: 8, code: 61, precipitation: 70 },
      { day: "Wed", temp_max: 18, temp_min: 11, code: 0, precipitation: 0 },
      { day: "Thu", temp_max: 19, temp_min: 12, code: 2, precipitation: 10 },
      { day: "Fri", temp_max: 16, temp_min: 10, code: 2, precipitation: 15 },
      { day: "Sat", temp_max: 15, temp_min: 9, code: 3, precipitation: 40 }
    ],
    lat: 53.4084,
    lon: -2.9916
  },
  "Palermo, Italy": {
    location: "Palermo, Italy",
    date: "Friday, January 4",
    temp: -2,
    condition: "Rain/Thunder",
    description: "heavy downpour",
    category: "stormy",
    high: 4,
    low: -5,
    infoText: "An unusual winter storm brings icy rain and sub-zero temperatures. Keep warm and avoid unnecessary travel.",
    humidity: 92,
    wind_speed: 24,
    wind_direction: "NE",
    wind_deg: 45,
    pressure: 0.98,
    live_chart: [1, 0, -1, -2, -2, -3, -4, -5, -4, -3, -2, -1],
    live_chart_percentage: 82.4,
    live_chart_status: "Severe",
    hourly: [
      { time: "Now", temp: -2, code: 95, precipitation: 90 },
      { time: "2 PM", temp: -1, code: 95, precipitation: 85 },
      { time: "3 PM", temp: 0, code: 65, precipitation: 80 },
      { time: "4 PM", temp: -1, code: 65, precipitation: 80 },
      { time: "5 PM", temp: -2, code: 75, precipitation: 85 },
      { time: "6 PM", temp: -3, code: 75, precipitation: 90 },
      { time: "7 PM", temp: -4, code: 95, precipitation: 95 },
      { time: "8 PM", temp: -5, code: 99, precipitation: 100 }
    ],
    weekly: [
      { day: "Sun", temp_max: 3, temp_min: -3, code: 95, precipitation: 90 },
      { day: "Mon", temp_max: 2, temp_min: -4, code: 75, precipitation: 80 },
      { day: "Tue", temp_max: 1, temp_min: -5, code: 75, precipitation: 85 },
      { day: "Wed", temp_max: 4, temp_min: -2, code: 63, precipitation: 70 },
      { day: "Thu", temp_max: 5, temp_min: -1, code: 3, precipitation: 30 },
      { day: "Fri", temp_max: 7, temp_min: 1, code: 2, precipitation: 15 },
      { day: "Sat", temp_max: 9, temp_min: 2, code: 0, precipitation: 0 }
    ],
    lat: 38.1157,
    lon: 13.3614
  }
};

export async function searchCitiesDirect(q) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=en&format=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Search API error");
    const data = await response.json();
    const results = data.results || [];
    return results.map(item => {
      const parts = [item.name];
      if (item.admin1) parts.push(item.admin1);
      if (item.country) parts.push(item.country);
      return {
        id: item.id,
        name: parts.join(', '),
        lat: item.latitude,
        lon: item.longitude,
        country_code: item.country_code || ""
      };
    });
  } catch (err) {
    console.error("Direct search error:", err);
    // Fallback: local filter of mocks
    const q_lower = q.toLowerCase();
    const matches = [];
    for (const [key, val] of Object.entries(MOCK_WEATHER)) {
      if (key.toLowerCase().includes(q_lower)) {
        matches.push({
          id: key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0),
          name: val.location,
          lat: val.lat,
          lon: val.lon,
          country_code: "MOCK"
        });
      }
    }
    return matches;
  }
}

export async function fetchWeatherDirect(lat, lon, locationName) {
  if (lat === null || lon === null) {
    if (locationName && MOCK_WEATHER[locationName]) {
      return MOCK_WEATHER[locationName];
    }
    // Try to find closest match in mock
    if (locationName) {
      for (const [key, val] of Object.entries(MOCK_WEATHER)) {
        if (key.toLowerCase().includes(locationName.toLowerCase())) {
          return val;
        }
      }
    }
    // Default to Brooklyn
    return MOCK_WEATHER["Brooklyn, New York, USA"];
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Forecast API error");
    const data = await response.json();
    
    const current = data.current || {};
    const hourly = data.hourly || {};
    const daily = data.daily || {};
    
    const wc = current.weather_code || 0;
    const mapped = mapWeatherCode(wc);
    
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = now.toLocaleDateString('en-US', { month: 'long' });
    const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = `${weekday}, ${month} ${day}`;
    
    const hourlyList = [];
    if (hourly.time) {
      const times = hourly.time || [];
      const temps = hourly.temperature_2m || [];
      const codes = hourly.weather_code || [];
      const precips = hourly.precipitation_probability || [];
      
      for (let i = 0; i < Math.min(8, times.length); i++) {
        let displayTime = `+${i}h`;
        try {
          const dt = new Date(times[i]);
          if (i === 0) {
            displayTime = "Now";
          } else {
            let hours = dt.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            displayTime = `${hours} ${ampm}`;
          }
        } catch (e) {}
        
        hourlyList.push({
          time: displayTime,
          temp: Math.round(temps[i]),
          code: codes[i],
          precipitation: precips[i]
        });
      }
    }
    
    const weeklyList = [];
    const maxTemps = daily.temperature_2m_max || [];
    const minTemps = daily.temperature_2m_min || [];
    if (daily.time) {
      const days = daily.time || [];
      const codes = daily.weather_code || [];
      const precips = daily.precipitation_probability_max || [];
      
      for (let i = 0; i < Math.min(7, days.length); i++) {
        let displayDay = days[i];
        try {
          const dt = new Date(days[i]);
          displayDay = dt.toLocaleDateString('en-US', { weekday: 'short' });
        } catch (e) {}
        
        weeklyList.push({
          day: displayDay,
          temp_max: Math.round(maxTemps[i] !== null ? maxTemps[i] : 0),
          temp_min: Math.round(minTemps[i] !== null ? minTemps[i] : 0),
          code: codes[i],
          precipitation: precips[i] !== null ? precips[i] : 0
        });
      }
    }
    
    const infoTexts = {
      sunny: "Enjoy bright clear skies. An excellent day for outdoor walks, cycling, or enjoying a sunny afternoon.",
      cloudy: "Overcast and mild skies. A great atmosphere for a relaxed, comfortable day without harsh sunlight.",
      rainy: "Expect steady rainfall. We recommend taking an umbrella and planning indoor activities.",
      stormy: "Warning: Thunderstorms expected. Stay indoors, secure outdoor objects, and keep devices charged.",
      snowy: "Freezing conditions with snowfall. Roads might be slippery; wear insulated clothing and boots.",
      foggy: "Reduced visibility due to fog. Exercise caution while driving and stay warm."
    };
    const infoText = infoTexts[mapped.category] || "With real time data and advanced technology, we provide reliable forecasts.";
    
    const hpaPressure = current.pressure_msl || 1013;
    const kpaPressure = parseFloat((hpaPressure * 0.1 / 10).toFixed(2));
    
    const temps = hourly.temperature_2m || [];
    const liveChartTemps = temps.slice(0, 12).map(t => Math.round(t));
    
    const chartAvg = liveChartTemps.length > 0 ? (liveChartTemps.reduce((a,b)=>a+b, 0) / liveChartTemps.length) : 0;
    let statusLbl = "Normal";
    let lblPct = parseFloat((15.0 + chartAvg % 15).toFixed(1));
    if (mapped.category === "stormy" || mapped.category === "snowy" || (current.wind_speed_10m || 0) > 25) {
      statusLbl = "Dangerous";
      lblPct = parseFloat((65.0 + chartAvg % 30).toFixed(1));
    } else if (mapped.category === "rainy" || mapped.category === "foggy") {
      statusLbl = "Caution";
      lblPct = parseFloat((40.0 + chartAvg % 20).toFixed(1));
    }
    
    const locationDisplay = locationName ? locationName : `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
    
    return {
      location: locationDisplay,
      date: dateStr,
      temp: Math.round(current.temperature_2m || 0),
      condition: mapped.condition,
      description: `with ${mapped.description.toLowerCase()}`,
      category: mapped.category,
      high: daily.temperature_2m_max && maxTemps[0] !== undefined ? Math.round(maxTemps[0]) : Math.round((current.temperature_2m || 0) + 5),
      low: daily.temperature_2m_min && minTemps[0] !== undefined ? Math.round(minTemps[0]) : Math.round((current.temperature_2m || 0) - 5),
      infoText: infoText,
      humidity: Math.round(current.relative_humidity_2m || 50),
      wind_speed: Math.round(current.wind_speed_10m || 0),
      wind_direction: getWindDirectionLabel(current.wind_direction_10m || 0),
      wind_deg: current.wind_direction_10m || 0,
      pressure: kpaPressure,
      live_chart: liveChartTemps,
      live_chart_percentage: lblPct,
      live_chart_status: statusLbl,
      hourly: hourlyList,
      weekly: weeklyList,
      lat: lat,
      lon: lon
    };
  } catch (err) {
    console.error("Direct fetch error:", err);
    // Find closest fallback mock
    if (locationName) {
      for (const [key, val] of Object.entries(MOCK_WEATHER)) {
        if (key.toLowerCase().includes(locationName.toLowerCase())) {
          return val;
        }
      }
    }
    return MOCK_WEATHER["Brooklyn, New York, USA"];
  }
}
