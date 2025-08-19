import Constants from "expo-constants";

// 🔐 OpenWeather API Key via app.config.js (extra)
export const API_KEY: string | undefined = Constants.expoConfig?.extra?.openWeatherApiKey;

// 🌦️ Base endpoints from OpenWeather
export const BASE_URL = 'https://api.openweathermap.org/data/2.5'; // Current weather, forecast, etc.
export const GEO_URL = 'https://api.openweathermap.org/geo/1.0';   // Geolocation by name or coordinates

//console.log("Loaded API KEY:", API_KEY ? "OK" : "MISSING");
