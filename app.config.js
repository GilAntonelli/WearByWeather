import 'dotenv/config';

export default {
  expo: {    
    name: "Wear Weather",
    slug: "wear-weather",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/clothesCloud.png",
    scheme: "meuappclima",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "Precisamos da sua localização para sugerir roupas com base no clima da sua cidade.",
      },
      config: {
        usesNonExemptEncryption: false,
      },
      bundleIdentifier: "com.seuprojeto.weatherwear",
      buildNumber: "1.0.0",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/clothesCloud.png",
        backgroundColor: "#add8e6",
      },
      edgeToEdgeEnabled: true,
      permissions: ["ACCESS_FINE_LOCATION"],
      package: "com.seuprojeto.weatherwear",
      versionCode: 1,
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/transparent.png",
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      "expo-localization",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      // 🔐 aqui vai a chave do OpenWeather lida do .env
      openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
    },
  },
};
