// services/__tests__/weatherPhrases.test.ts
import { getFraseClimatica } from "../weatherPhrases";
import type { TFunction } from "i18next";

// --- Test translator helpers -------------------------------------------------
function makeT(present: string[] = []): TFunction {
  const set = new Set(present);
  const t = ((key: string, opts?: any) => {
    // Simulate i18next missing key behavior: returns the key when missing
    if (set.has(key)) return `TR:${key}`;
    if (opts && typeof opts.defaultValue === "string") return opts.defaultValue || key;
    return key;
  }) as TFunction;
  return t;
}

const K = {
  thunderstorm: "Forecast.thunderstorm",
  snow: "Forecast.snow",
  rainCold: "Forecast.rainTemperature15-",
  rain: "Forecast.rain",
  wind20: "Forecast.wind20+",
  wind30: "Forecast.wind30+",
  hot30: "Forecast.temperature30+",
  hot35: "Forecast.temperature35+",
  clearCold5: "Forecast.clearSkyCold5-",
  cold5: "Forecast.cold5-",
  temp10: "Forecast.temperature10-",
  cloudsCold15: "Forecast.cloudsTemperature15-",
  clouds: "Forecast.clouds",
  fog: "Forecast.fog",
  hum90: "Forecast.humidity90+",
  hum30: "Forecast.humidity30-",
  clear: "Forecast.clearSky",
  fallback: "Forecast.fallback",
};

const ALL_KEYS = Object.values(K);
const tAll = makeT(ALL_KEYS);

// --- Tests -------------------------------------------------------------------
describe("getFraseClimatica — severity & fallbacks", () => {
  test("Thunderstorm returns thunderstorm when key exists", () => {
    const t = makeT([K.thunderstorm]);
    const out = getFraseClimatica(t, { temperatura: 22, descricao: "Thunderstorm" });
    expect(out).toBe(`TR:${K.thunderstorm}`);
  });

  test("Thunderstorm falls back to rain when thunderstorm key is missing", () => {
    const t = makeT([K.rain]); // thunderstorm missing on purpose
    const out = getFraseClimatica(t, { temperatura: 22, descricao: "Thunderstorm" });
    expect(out).toBe(`TR:${K.rain}`);
  });

  test("Snow returns snow when key exists", () => {
    const t = makeT([K.snow]);
    const out = getFraseClimatica(t, { temperatura: -2, descricao: "Snow" });
    expect(out).toBe(`TR:${K.snow}`);
  });

  test("Snow falls back to cold5- when snow key is missing", () => {
    const t = makeT([K.cold5]);
    const out = getFraseClimatica(t, { temperatura: -2, descricao: "Snow" });
    expect(out).toBe(`TR:${K.cold5}`);
  });
});

describe("getFraseClimatica — rain consolidation & temperature", () => {
  test("Rainy & cold (<15°C) via boolean chuva -> rainTemperature15-", () => {
    const out = getFraseClimatica(tAll, { temperatura: 10, chuva: true });
    expect(out).toBe(`TR:${K.rainCold}`);
  });

  test("Rain (no cold) via main Drizzle -> rain", () => {
    const out = getFraseClimatica(tAll, { temperatura: 22, descricao: "Drizzle" });
    expect(out).toBe(`TR:${K.rain}`);
  });

  test("Rain by measurable rainMM (>=0.2) -> rain", () => {
    const out = getFraseClimatica(tAll, { temperatura: 24, rainMM: 0.3 });
    expect(out).toBe(`TR:${K.rain}`);
  });

  test("Boundary: rain + temperatura === 15 -> rain (not rainTemperature15-)", () => {
    const out = getFraseClimatica(tAll, { temperatura: 15, chuva: true });
    expect(out).toBe(`TR:${K.rain}`);
  });

  test("Priority: rain chosen over wind30+ when both apply", () => {
    const out = getFraseClimatica(tAll, { temperatura: 16, chuva: true, vento: 40 });
    expect(out).toBe(`TR:${K.rain}`);
  });

  test("Priority: thunderstorm chosen over wind30+ when both apply", () => {
    const out = getFraseClimatica(tAll, { temperatura: 20, descricao: "Thunderstorm", vento: 45 });
    expect(out).toBe(`TR:${K.thunderstorm}`);
  });
});

describe("getFraseClimatica — wind thresholds", () => {
  test("> 30 km/h -> wind30+", () => {
    const out = getFraseClimatica(tAll, { temperatura: 22, vento: 31 });
    expect(out).toBe(`TR:${K.wind30}`);
  });

  test("== 30 km/h -> wind20+ (since check is > 30 then > 20)", () => {
    const out = getFraseClimatica(tAll, { temperatura: 22, vento: 30 });
    expect(out).toBe(`TR:${K.wind20}`);
  });

  test("> 20 km/h -> wind20+", () => {
    const out = getFraseClimatica(tAll, { temperatura: 22, vento: 25 });
    expect(out).toBe(`TR:${K.wind20}`);
  });

  test("== 20 km/h -> no wind phrase", () => {
    const out = getFraseClimatica(tAll, { temperatura: 22, vento: 20 });
    // No wind phrase; should continue down the decision tree -> fallback here
    expect(out).toBe(`TR:${K.fallback}`);
  });
});

describe("getFraseClimatica — heat & cold thresholds", () => {
  test("Clear & ≥ 35°C -> temperature35+", () => {
    const out = getFraseClimatica(tAll, { temperatura: 35, descricao: "Clear" });
    expect(out).toBe(`TR:${K.hot35}`);
  });

  test("Clear & > 30°C -> temperature30+", () => {
    const out = getFraseClimatica(tAll, { temperatura: 31, descricao: "Clear" });
    expect(out).toBe(`TR:${K.hot30}`);
  });

  test("Clear & ≤ 5°C -> clearSkyCold5-", () => {
    const out = getFraseClimatica(tAll, { temperatura: 3, descricao: "Clear" });
    expect(out).toBe(`TR:${K.clearCold5}`);
  });

  test("Generic cold ≤ 5°C (non-clear) -> cold5-", () => {
    const out = getFraseClimatica(tAll, { temperatura: 0, descricao: "Clouds" });
    expect(out).toBe(`TR:${K.cold5}`);
  });

  test("Temperature < 10°C (and not ≤ 5°C) -> temperature10-", () => {
    const out = getFraseClimatica(tAll, { temperatura: 8, descricao: "Clouds" });
    expect(out).toBe(`TR:${K.temp10}`);
  });
});

describe("getFraseClimatica — clouds vs generic cold ordering", () => {
  test("Clouds & < 15°C but ≥ 10°C -> cloudsTemperature15-", () => {
    const out = getFraseClimatica(tAll, { temperatura: 12, descricao: "Clouds" });
    expect(out).toBe(`TR:${K.cloudsCold15}`);
  });

  test("Clouds & 9°C -> temperature10- (cold takes precedence by order)", () => {
    const out = getFraseClimatica(tAll, { temperatura: 9, descricao: "Clouds" });
    expect(out).toBe(`TR:${K.temp10}`);
  });

  test("Clouds (no cold) -> clouds", () => {
    const out = getFraseClimatica(tAll, { temperatura: 20, descricao: "Clouds" });
    expect(out).toBe(`TR:${K.clouds}`);
  });
});

describe("getFraseClimatica — visibility / particles", () => {
  test.each(["Mist", "Haze", "Fog"] as const)("%s -> fog", (main) => {
    const out = getFraseClimatica(tAll, { temperatura: 15, descricao: main });
    expect(out).toBe(`TR:${K.fog}`);
  });

  test("PT condicao contains 'nevoeiro' or 'névoa' -> fog", () => {
    const out1 = getFraseClimatica(tAll, { temperatura: 15, condicao: "nevoeiro cerrado" });
    const out2 = getFraseClimatica(tAll, { temperatura: 15, condicao: "névoa ao amanhecer" });
    expect(out1).toBe(`TR:${K.fog}`);
    expect(out2).toBe(`TR:${K.fog}`);
  });
});

describe("getFraseClimatica — humidity clamp & extremes", () => {
  test("Humidity ≥ 90% -> humidity90+", () => {
    const out = getFraseClimatica(tAll, { temperatura: 24, umidade: 95 });
    expect(out).toBe(`TR:${K.hum90}`);
  });

  test("Humidity ≤ 30% -> humidity30-", () => {
    const out = getFraseClimatica(tAll, { temperatura: 24, umidade: 25 });
    expect(out).toBe(`TR:${K.hum30}`);
  });

  test("Humidity clamp: 150% is treated as 100% -> humidity90+", () => {
    const out = getFraseClimatica(tAll, { temperatura: 24, umidade: 150 });
    expect(out).toBe(`TR:${K.hum90}`);
  });

  test("Humidity clamp: -10% is treated as 0% -> humidity30-", () => {
    const out = getFraseClimatica(tAll, { temperatura: 24, umidade: -10 });
    expect(out).toBe(`TR:${K.hum30}`);
  });

  test("Ordering: clear & ≤5°C with high humidity still returns clearSkyCold5-", () => {
    const out = getFraseClimatica(tAll, { temperatura: 2, descricao: "Clear", umidade: 95 });
    expect(out).toBe(`TR:${K.clearCold5}`);
  });
});

describe("getFraseClimatica — normalization from PT `condicao`", () => {
  test("`céu limpo` -> clearSky", () => {
    const out = getFraseClimatica(tAll, { temperatura: 24, condicao: "céu limpo" });
    expect(out).toBe(`TR:${K.clear}`);
  });

  test("`parcialmente nublado` -> clouds", () => {
    const out = getFraseClimatica(tAll, { temperatura: 24, condicao: "parcialmente nublado" });
    expect(out).toBe(`TR:${K.clouds}`);
  });

  test("`garoa` maps to rain (via normalizeMain mapping to Rain)", () => {
    const out = getFraseClimatica(tAll, { temperatura: 22, condicao: "garoa fraca" });
    expect(out).toBe(`TR:${K.rain}`);
  });
});

describe("getFraseClimatica — defaults & fallbacks", () => {
  test("Default clear sky when Clear and no other condition applies", () => {
    const out = getFraseClimatica(tAll, { temperatura: 24, descricao: "Clear" });
    expect(out).toBe(`TR:${K.clear}`);
  });

  test("Unknown main -> fallback", () => {
    const out = getFraseClimatica(tAll, { temperatura: 20, descricao: "VolcanicAsh" as any });
    expect(out).toBe(`TR:${K.fallback}`);
  });

  test("No signals at all -> fallback", () => {
    const out = getFraseClimatica(tAll, { temperatura: 20 });
    expect(out).toBe(`TR:${K.fallback}`);
  });
});
