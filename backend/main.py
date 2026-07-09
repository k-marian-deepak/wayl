from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import logging
from typing import Optional, List, Dict, Any
import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("weather-backend")

app = FastAPI(title="Wayl Weather API", version="1.0.0")

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper: map Open-Meteo weather codes to our simple categories and conditions
def map_weather_code(code: int) -> Dict[str, str]:
    # Returns {"condition": str, "description": str, "category": "sunny"|"cloudy"|"rainy"|"stormy"|"snowy"|"foggy"}
    mapping = {
        0: {"condition": "Sunny", "description": "Clear sky", "category": "sunny"},
        1: {"condition": "Mainly Clear", "description": "Mainly clear sky", "category": "sunny"},
        2: {"condition": "Partly Cloudy", "description": "Partly cloudy", "category": "cloudy"},
        3: {"condition": "Overcast", "description": "Overcast clouds", "category": "cloudy"},
        45: {"condition": "Foggy", "description": "Fog and depositing rime fog", "category": "foggy"},
        48: {"condition": "Foggy", "description": "Depositing rime fog", "category": "foggy"},
        51: {"condition": "Drizzle", "description": "Light drizzle", "category": "rainy"},
        53: {"condition": "Drizzle", "description": "Moderate drizzle", "category": "rainy"},
        55: {"condition": "Drizzle", "description": "Dense drizzle", "category": "rainy"},
        56: {"condition": "Freezing Drizzle", "description": "Light freezing drizzle", "category": "rainy"},
        57: {"condition": "Freezing Drizzle", "description": "Dense freezing drizzle", "category": "rainy"},
        61: {"condition": "Rainy", "description": "Slight rain", "category": "rainy"},
        63: {"condition": "Rainy", "description": "Moderate rain", "category": "rainy"},
        65: {"condition": "Rainy", "description": "Heavy rain", "category": "rainy"},
        66: {"condition": "Freezing Rain", "description": "Light freezing rain", "category": "rainy"},
        67: {"condition": "Freezing Rain", "description": "Heavy freezing rain", "category": "rainy"},
        71: {"condition": "Snowy", "description": "Slight snow fall", "category": "snowy"},
        73: {"condition": "Snowy", "description": "Moderate snow fall", "category": "snowy"},
        75: {"condition": "Snowy", "description": "Heavy snow fall", "category": "snowy"},
        77: {"condition": "Snowy", "description": "Snow grains", "category": "snowy"},
        80: {"condition": "Showers", "description": "Slight rain showers", "category": "rainy"},
        81: {"condition": "Showers", "description": "Moderate rain showers", "category": "rainy"},
        82: {"condition": "Showers", "description": "Violent rain showers", "category": "rainy"},
        85: {"condition": "Snow Showers", "description": "Slight snow showers", "category": "snowy"},
        86: {"condition": "Snow Showers", "description": "Heavy snow showers", "category": "snowy"},
        95: {"condition": "Stormy", "description": "Thunderstorm", "category": "stormy"},
        96: {"condition": "Stormy", "description": "Thunderstorm with slight hail", "category": "stormy"},
        99: {"condition": "Stormy", "description": "Thunderstorm with heavy hail", "category": "stormy"},
    }
    return mapping.get(code, {"condition": "Partly Cloudy", "description": "Partly cloudy", "category": "cloudy"})

# Helper: Get wind direction abbreviation
def get_wind_direction_label(degrees: float) -> str:
    val = int((degrees/22.5)+.5)
    arr = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
    return arr[(val % 16)]

# Standard mock data in case API fails or is slow
MOCK_WEATHER = {
    "Brooklyn, New York, USA": {
        "location": "Brooklyn, New York, USA",
        "date": "Friday, January 4",
        "temp": 18,
        "condition": "Stormy",
        "description": "with partly cloudy",
        "category": "stormy",
        "high": 29,
        "low": 12,
        "infoText": "With real time data and advanced technology, we provide reliable forecasts for any location around the world.",
        "humidity": 78,
        "wind_speed": 12,
        "wind_direction": "NW",
        "wind_deg": 315,
        "pressure": 1.0,  # kPa
        "live_chart": [15, 16, 17, 18, 17, 16, 15, 14, 16, 18, 19, 18],
        "live_chart_percentage": 23.8,
        "live_chart_status": "Dangerous",
        "hourly": [
            {"time": "Now", "temp": 18, "code": 95, "precipitation": 60},
            {"time": "2 PM", "temp": 19, "code": 95, "precipitation": 60},
            {"time": "3 PM", "temp": 20, "code": 2, "precipitation": 20},
            {"time": "4 PM", "temp": 20, "code": 2, "precipitation": 60},
            {"time": "5 PM", "temp": 19, "code": 3, "precipitation": 60},
            {"time": "6 PM", "temp": 18, "code": 3, "precipitation": 10},
            {"time": "7 PM", "temp": 17, "code": 3, "precipitation": 5},
            {"time": "8 PM", "temp": 16, "code": 0, "precipitation": 0},
        ],
        "weekly": [
            {"day": "Sun", "temp_max": 28, "temp_min": 12, "code": 0, "precipitation": 0},
            {"day": "Mon", "temp_max": 26, "temp_min": 11, "code": 2, "precipitation": 10},
            {"day": "Tue", "temp_max": 27, "temp_min": 12, "code": 2, "precipitation": 10},
            {"day": "Wed", "temp_max": 23, "temp_min": 13, "code": 61, "precipitation": 60},
            {"day": "Thu", "temp_max": 30, "temp_min": 14, "code": 0, "precipitation": 0},
            {"day": "Fri", "temp_max": 23, "temp_min": 10, "code": 2, "precipitation": 20},
            {"day": "Sat", "temp_max": 24, "temp_min": 9, "code": 0, "precipitation": 0},
        ],
        "lat": 40.6782,
        "lon": -73.9442
    },
    "Liverpool, UK": {
        "location": "Liverpool, UK",
        "date": "Friday, January 4",
        "temp": 16,
        "condition": "Partly Cloudy",
        "description": "with gentle breeze",
        "category": "cloudy",
        "high": 18,
        "low": 10,
        "infoText": "Overcast skies with light wind. Ideal weather for indoor activities or a stroll in the park with a light jacket.",
        "humidity": 65,
        "wind_speed": 15,
        "wind_direction": "W",
        "wind_deg": 270,
        "pressure": 1.01,
        "live_chart": [14, 14, 15, 16, 16, 15, 14, 13, 12, 12, 13, 14],
        "live_chart_percentage": 12.5,
        "live_chart_status": "Normal",
        "hourly": [
            {"time": "Now", "temp": 16, "code": 2, "precipitation": 10},
            {"time": "2 PM", "temp": 16, "code": 2, "precipitation": 10},
            {"time": "3 PM", "temp": 17, "code": 2, "precipitation": 15},
            {"time": "4 PM", "temp": 17, "code": 1, "precipitation": 5},
            {"time": "5 PM", "temp": 16, "code": 1, "precipitation": 5},
            {"time": "6 PM", "temp": 15, "code": 3, "precipitation": 20},
            {"time": "7 PM", "temp": 14, "code": 3, "precipitation": 30},
            {"time": "8 PM", "temp": 13, "code": 61, "precipitation": 55},
        ],
        "weekly": [
            {"day": "Sun", "temp_max": 17, "temp_min": 9, "code": 2, "precipitation": 10},
            {"day": "Mon", "temp_max": 16, "temp_min": 10, "code": 3, "precipitation": 30},
            {"day": "Tue", "temp_max": 15, "temp_min": 8, "code": 61, "precipitation": 70},
            {"day": "Wed", "temp_max": 18, "temp_min": 11, "code": 0, "precipitation": 0},
            {"day": "Thu", "temp_max": 19, "temp_min": 12, "code": 2, "precipitation": 10},
            {"day": "Fri", "temp_max": 16, "temp_min": 10, "code": 2, "precipitation": 15},
            {"day": "Sat", "temp_max": 15, "temp_min": 9, "code": 3, "precipitation": 40},
        ],
        "lat": 53.4084,
        "lon": -2.9916
    },
    "Palermo, Italy": {
        "location": "Palermo, Italy",
        "date": "Friday, January 4",
        "temp": -2,
        "condition": "Rain/Thunder",
        "description": "heavy downpour",
        "category": "stormy",
        "high": 4,
        "low": -5,
        "infoText": "An unusual winter storm brings icy rain and sub-zero temperatures. Keep warm and avoid unnecessary travel.",
        "humidity": 92,
        "wind_speed": 24,
        "wind_direction": "NE",
        "wind_deg": 45,
        "pressure": 0.98,
        "live_chart": [1, 0, -1, -2, -2, -3, -4, -5, -4, -3, -2, -1],
        "live_chart_percentage": 82.4,
        "live_chart_status": "Severe",
        "hourly": [
            {"time": "Now", "temp": -2, "code": 95, "precipitation": 90},
            {"time": "2 PM", "temp": -1, "code": 95, "precipitation": 85},
            {"time": "3 PM", "temp": 0, "code": 65, "precipitation": 80},
            {"time": "4 PM", "temp": -1, "code": 65, "precipitation": 80},
            {"time": "5 PM", "temp": -2, "code": 75, "precipitation": 85},
            {"time": "6 PM", "temp": -3, "code": 75, "precipitation": 90},
            {"time": "7 PM", "temp": -4, "code": 95, "precipitation": 95},
            {"time": "8 PM", "temp": -5, "code": 99, "precipitation": 100},
        ],
        "weekly": [
            {"day": "Sun", "temp_max": 3, "temp_min": -3, "code": 95, "precipitation": 90},
            {"day": "Mon", "temp_max": 2, "temp_min": -4, "code": 75, "precipitation": 80},
            {"day": "Tue", "temp_max": 1, "temp_min": -5, "code": 75, "precipitation": 85},
            {"day": "Wed", "temp_max": 4, "temp_min": -2, "code": 63, "precipitation": 70},
            {"day": "Thu", "temp_max": 5, "temp_min": -1, "code": 3, "precipitation": 30},
            {"day": "Fri", "temp_max": 7, "temp_min": 1, "code": 2, "precipitation": 15},
            {"day": "Sat", "temp_max": 9, "temp_min": 2, "code": 0, "precipitation": 0},
        ],
        "lat": 38.1157,
        "lon": 13.3614
    }
}

@app.get("/")
def read_root():
    return {"message": "Wayl Weather API is operational"}

@app.get("/api/search")
async def search_city(q: str = Query(..., min_length=1)):
    """
    Search for cities using Open-Meteo's Geocoding API.
    """
    url = f"https://geocoding-api.open-meteo.com/v1/search?name={q}&count=6&language=en&format=json"
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(url)
            if response.status_code == 200:
                data = response.json()
                results = data.get("results", [])
                formatted = []
                for item in results:
                    name = item.get("name")
                    country = item.get("country", "")
                    admin1 = item.get("admin1", "")
                    
                    # Construct clean display name
                    parts = [name]
                    if admin1:
                        parts.append(admin1)
                    if country:
                        parts.append(country)
                    display_name = ", ".join(parts)
                    
                    formatted.append({
                        "id": item.get("id"),
                        "name": display_name,
                        "lat": item.get("latitude"),
                        "lon": item.get("longitude"),
                        "country_code": item.get("country_code", "")
                    })
                return formatted
            else:
                logger.error(f"Geocoding API error: Status {response.status_code}")
                # Fallback to local filtering of mock keys
                return filter_mock_search(q)
    except Exception as e:
        logger.error(f"Geocoding fetch exception: {e}")
        return filter_mock_search(q)

def filter_mock_search(q: str):
    q_lower = q.lower()
    matches = []
    for key, val in MOCK_WEATHER.items():
        if q_lower in key.lower():
            matches.append({
                "id": hash(key),
                "name": val["location"],
                "lat": val["lat"],
                "lon": val["lon"],
                "country_code": "MOCK"
            })
    return matches

@app.get("/api/weather")
async def get_weather(
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    location_name: Optional[str] = None
):
    """
    Retrieve full weather package for coordinates, falling back to location_name or default mock.
    """
    # If no coordinates are given but a mock location name matches, use it
    if lat is None or lon is None:
        if location_name and location_name in MOCK_WEATHER:
            return MOCK_WEATHER[location_name]
        # Default fallback to Brooklyn
        return MOCK_WEATHER["Brooklyn, New York, USA"]

    # Use Open-Meteo to fetch real data
    try:
        url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={lat}&longitude={lon}"
            f"&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl"
            f"&hourly=temperature_2m,weather_code,precipitation_probability"
            f"&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"
            f"&timezone=auto"
        )
        
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(url)
            if response.status_code != 200:
                logger.error(f"Open-Meteo Forecast status code: {response.status_code}")
                # Return closest matching mock
                return get_fallback_mock(lat, lon, location_name)
            
            data = response.json()
            current = data.get("current", {})
            hourly = data.get("hourly", {})
            daily = data.get("daily", {})
            
            # Map code
            wc = current.get("weather_code", 0)
            mapped = map_weather_code(wc)
            
            # Formatting Current Date
            now_dt = datetime.datetime.now()
            date_str = now_dt.strftime("%A, %B %d")
            
            # Compile Hourly (first 8 hours)
            hourly_list = []
            if hourly:
                times = hourly.get("time", [])
                temps = hourly.get("temperature_2m", [])
                codes = hourly.get("weather_code", [])
                precips = hourly.get("precipitation_probability", [])
                
                # Limit to 8 slots
                for i in range(min(8, len(times))):
                    time_val = times[i]
                    # Parse the ISO timestamp to "2 PM" formats
                    try:
                        dt = datetime.datetime.fromisoformat(time_val)
                        if i == 0:
                            display_time = "Now"
                        else:
                            display_time = dt.strftime("%-I %p")
                    except Exception:
                        display_time = f"+{i}h"
                    
                    hourly_list.append({
                        "time": display_time,
                        "temp": round(temps[i]),
                        "code": codes[i],
                        "precipitation": precips[i]
                    })
            
            # Compile Weekly (7 days)
            weekly_list = []
            if daily:
                days = daily.get("time", [])
                max_temps = daily.get("temperature_2m_max", [])
                min_temps = daily.get("temperature_2m_min", [])
                codes = daily.get("weather_code", [])
                precips = daily.get("precipitation_probability_max", [])
                
                for i in range(min(7, len(days))):
                    day_val = days[i]
                    try:
                        dt = datetime.date.fromisoformat(day_val)
                        display_day = dt.strftime("%a")  # "Sun", "Mon"
                    except Exception:
                        display_day = day_val
                        
                    weekly_list.append({
                        "day": display_day,
                        "temp_max": round(max_temps[i]) if max_temps[i] is not None else 0,
                        "temp_min": round(min_temps[i]) if min_temps[i] is not None else 0,
                        "code": codes[i],
                        "precipitation": precips[i] if precips[i] is not None else 0
                    })
            
            # Construct a dynamic info description
            condition_desc = mapped["description"]
            info_texts = {
                "sunny": "Enjoy bright clear skies. An excellent day for outdoor walks, cycling, or enjoying a sunny afternoon.",
                "cloudy": "Overcast and mild skies. A great atmosphere for a relaxed, comfortable day without harsh sunlight.",
                "rainy": "Expect steady rainfall. We recommend taking an umbrella and planning indoor activities.",
                "stormy": "Warning: Thunderstorms expected. Stay indoors, secure outdoor objects, and keep devices charged.",
                "snowy": "Freezing conditions with snowfall. Roads might be slippery; wear insulated clothing and boots.",
                "foggy": "Reduced visibility due to fog. Exercise caution while driving and stay warm."
            }
            info_text = info_texts.get(mapped["category"], "With real time data and advanced technology, we provide reliable forecasts.")
            
            # Derive pressure in kPa (1 hPa = 0.1 kPa)
            hpa_pressure = current.get("pressure_msl", 1013)
            kpa_pressure = round(hpa_pressure * 0.1 / 10, 2)  # Scale to kPa with 2 decimals
            
            # Formulate Live Conditions Chart:
            # We can use the temperature of the first 12 hourly intervals
            live_chart_temps = [round(t) for t in temps[:12]] if hourly else [18]*12
            
            # Calculate a mock percentage scale for active threat/status
            chart_avg = sum(live_chart_temps)/len(live_chart_temps) if live_chart_temps else 0
            if mapped["category"] in ["stormy", "snowy"] or current.get("wind_speed_10m", 0) > 25:
                status_lbl = "Dangerous"
                lbl_pct = round(65.0 + chart_avg % 30, 1)
            elif mapped["category"] in ["rainy", "foggy"]:
                status_lbl = "Caution"
                lbl_pct = round(40.0 + chart_avg % 20, 1)
            else:
                status_lbl = "Normal"
                lbl_pct = round(15.0 + chart_avg % 15, 1)
            
            location_display = location_name if location_name else f"Lat: {lat:.2f}, Lon: {lon:.2f}"
            
            return {
                "location": location_display,
                "date": date_str,
                "temp": round(current.get("temperature_2m", 0)),
                "condition": mapped["condition"],
                "description": f"with {condition_desc.lower()}",
                "category": mapped["category"],
                "high": round(max_temps[0]) if daily and len(max_temps) > 0 else round(current.get("temperature_2m", 0) + 5),
                "low": round(min_temps[0]) if daily and len(min_temps) > 0 else round(current.get("temperature_2m", 0) - 5),
                "infoText": info_text,
                "humidity": round(current.get("relative_humidity_2m", 50)),
                "wind_speed": round(current.get("wind_speed_10m", 0)),
                "wind_direction": get_wind_direction_label(current.get("wind_direction_10m", 0)),
                "wind_deg": current.get("wind_direction_10m", 0),
                "pressure": kpa_pressure,
                "live_chart": live_chart_temps,
                "live_chart_percentage": lbl_pct,
                "live_chart_status": status_lbl,
                "hourly": hourly_list,
                "weekly": weekly_list,
                "lat": lat,
                "lon": lon
            }
            
    except Exception as e:
        logger.error(f"Error fetching from Open-Meteo: {e}")
        return get_fallback_mock(lat, lon, location_name)

def get_fallback_mock(lat: float, lon: float, name: Optional[str]):
    # Locate closest matching mock coordinate or use default
    if name:
        for key, val in MOCK_WEATHER.items():
            if name.lower() in key.lower():
                return val
    # Fallback to Brooklyn
    return MOCK_WEATHER["Brooklyn, New York, USA"]
