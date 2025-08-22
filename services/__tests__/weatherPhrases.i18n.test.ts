// services/__tests__/weatherPhrases.i18n.test.ts
import fs from "node:fs";
import path from "node:path";
import type { TFunction } from "i18next";
import { getFraseClimatica } from "../weatherPhrases";

type Dict = Record<string, any>;

const LOCALES = [
    { name: "en-US", file: path.resolve("locales/en/translation.json") },
    { name: "pt-BR", file: path.resolve("locales/pt-BR/translation.json") },
    { name: "pt-PT", file: path.resolve("locales/pt-PT/translation.json") },
];

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

function loadJSON(file: string): Dict {
    return JSON.parse(fs.readFileSync(file, "utf8"));
}

function deepGet(obj: any, dottedKey: string): any {
    return dottedKey.split(".").reduce((acc, k) => (acc && k in acc ? acc[k] : undefined), obj);
}

// Creates a TFunction backed by a locale dictionary.
// - If `omit` includes a key, it will simulate a "missing" key (returns the key itself).
// - If a key is not found in the dict, returns the key (i18next-like behavior).
function createTFromDict(dict: Dict, omit: string[] = []): TFunction {
    const omitted = new Set(omit);
    const t = ((key: string, _opts?: any) => {
        if (omitted.has(key)) return key; // simulate missing key
        const val = deepGet(dict, key);
        return typeof val === "string" ? val : key;
    }) as TFunction;
    return t;
}

describe("getFraseClimatica with real i18n dictionaries", () => {
    for (const { name, file } of LOCALES) {
        describe(`[${name}]`, () => {
            let dict: Dict;
            let t: TFunction;

            beforeAll(() => {
                dict = loadJSON(file);
                t = createTFromDict(dict);
            });

            function expectKeyOutput(key: string, out: string) {
                const expected = deepGet(dict, key);
                expect(typeof expected).toBe("string");
                expect(out).toBe(expected);
            }

            test("Thunderstorm -> thunderstorm", () => {
                const out = getFraseClimatica(t, { temperatura: 22, descricao: "Thunderstorm" });
                expectKeyOutput(K.thunderstorm, out);
            });

            test("Snow -> snow", () => {
                const out = getFraseClimatica(t, { temperatura: -1, descricao: "Snow" });
                expectKeyOutput(K.snow, out);
            });

            test("Rain & cold (<15°C) -> rainTemperature15-", () => {
                const out = getFraseClimatica(t, { temperatura: 10, chuva: true });
                expectKeyOutput(K.rainCold, out);
            });

            test("Drizzle -> rain", () => {
                const out = getFraseClimatica(t, { temperatura: 22, descricao: "Drizzle" });
                expectKeyOutput(K.rain, out);
            });

            test("rainMM >= 0.2 -> rain", () => {
                const out = getFraseClimatica(t, { temperatura: 23, rainMM: 0.4 });
                expectKeyOutput(K.rain, out);
            });

            test("Wind > 30 -> wind30+", () => {
                const out = getFraseClimatica(t, { temperatura: 24, vento: 31 });
                expectKeyOutput(K.wind30, out);
            });

            test("Wind = 30 -> wind20+", () => {
                const out = getFraseClimatica(t, { temperatura: 24, vento: 30 });
                expectKeyOutput(K.wind20, out);
            });

            test("Clear & ≥ 35°C -> temperature35+", () => {
                const out = getFraseClimatica(t, { temperatura: 35, descricao: "Clear" });
                expectKeyOutput(K.hot35, out);
            });

            test("Clear & > 30°C -> temperature30+", () => {
                const out = getFraseClimatica(t, { temperatura: 31, descricao: "Clear" });
                expectKeyOutput(K.hot30, out);
            });

            test("Clear & ≤ 5°C -> clearSkyCold5-", () => {
                const out = getFraseClimatica(t, { temperatura: 3, descricao: "Clear" });
                expectKeyOutput(K.clearCold5, out);
            });

            test("≤ 5°C non-clear -> cold5-", () => {
                const out = getFraseClimatica(t, { temperatura: 0, descricao: "Clouds" });
                expectKeyOutput(K.cold5, out);
            });

            test("< 10°C non-clear -> temperature10-", () => {
                const out = getFraseClimatica(t, { temperatura: 8, descricao: "Clouds" });
                expectKeyOutput(K.temp10, out);
            });

            test("Clouds & < 15°C -> cloudsTemperature15-", () => {
                const out = getFraseClimatica(t, { temperatura: 12, descricao: "Clouds" });
                expectKeyOutput(K.cloudsCold15, out);
            });

            test("Clouds (no cold) -> clouds", () => {
                const out = getFraseClimatica(t, { temperatura: 20, descricao: "Clouds" });
                expectKeyOutput(K.clouds, out);
            });

            test("Fog/Mist/Haze -> fog", () => {
                const outFog = getFraseClimatica(t, { temperatura: 15, descricao: "Fog" });
                const outMist = getFraseClimatica(t, { temperatura: 15, descricao: "Mist" });
                const outHaze = getFraseClimatica(t, { temperatura: 15, descricao: "Haze" });
                expectKeyOutput(K.fog, outFog);
                expectKeyOutput(K.fog, outMist);
                expectKeyOutput(K.fog, outHaze);
            });

            test("PT condicao contains 'nevoeiro/névoa' -> fog (normalization path)", () => {
                const out1 = getFraseClimatica(t, { temperatura: 15, condicao: "nevoeiro cerrado" });
                const out2 = getFraseClimatica(t, { temperatura: 15, condicao: "névoa ao amanhecer" });
                expectKeyOutput(K.fog, out1);
                expectKeyOutput(K.fog, out2);
            });

            test("Humidity ≥ 90% -> humidity90+", () => {
                const out = getFraseClimatica(t, { temperatura: 24, umidade: 95 });
                expectKeyOutput(K.hum90, out);
            });

            test("Humidity ≤ 30% -> humidity30-", () => {
                const out = getFraseClimatica(t, { temperatura: 24, umidade: 25 });
                expectKeyOutput(K.hum30, out);
            });

            test("Default Clear -> clearSky", () => {
                const out = getFraseClimatica(t, { temperatura: 24, descricao: "Clear" });
                expectKeyOutput(K.clear, out);
            });

            test("Unknown main -> fallback", () => {
                const out = getFraseClimatica(t, { temperatura: 20, descricao: "VolcanicAsh" as any });
                expectKeyOutput(K.fallback, out);
            });

            test("Fallback simulation: missing 'thunderstorm' should fall back to 'rain'", () => {
                const tMissingThunder = createTFromDict(dict, [K.thunderstorm]);
                const out = getFraseClimatica(tMissingThunder, { temperatura: 22, descricao: "Thunderstorm" });
                expectKeyOutput(K.rain, out);
            });

            test("Fallback simulation: missing 'snow' should fall back to 'cold5-'", () => {
                const tMissingSnow = createTFromDict(dict, [K.snow]);
                const out = getFraseClimatica(tMissingSnow, { temperatura: -2, descricao: "Snow" });
                expectKeyOutput(K.cold5, out);
            });
        });
    }
});
