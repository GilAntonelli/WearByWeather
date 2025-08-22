// services/__tests__/i18nForecastKeys.test.ts
import fs from "node:fs";
import path from "node:path";

type Dict = Record<string, any>;

const LOCALES = [
    { name: "en-US", file: path.resolve("locales/en/translation.json") },
    { name: "pt-BR", file: path.resolve("locales/pt-BR/translation.json") },
    { name: "pt-PT", file: path.resolve("locales/pt-PT/translation.json") },
];

const REQUIRED_UI_KEYS = [
    "condition",
    "sectionTitle",
    "sectionTitleDetais", // keep current key to avoid breaking references
    "detailTitle",
    "temperatureMax",
    "temperatureMin",
    "rainDetail",
    "possibleRain",
    "withoutRain",
    "windDetail",
    "humidityDetail",
    "humidityAir",
    "ThermalSenation",    // keep current key to avoid breaking references
    "backButton",
    "errorMessage",
    "retryButton",
];

const REQUIRED_PHRASE_KEYS = [
    "thunderstorm",
    "snow",
    "rainTemperature15-",
    "rain",
    "wind30+",
    "wind20+",
    "temperature35+",
    "temperature30+",
    "clearSkyCold5-",
    "cold5-",
    "temperature10-",
    "cloudsTemperature15-",
    "clouds",
    "fog",
    "humidity90+",
    "humidity30-",
    "clearSky",
    "fallback",
    // "mist" is optional (not used by the service), but allowed to remain
];

function loadJSON(file: string): Dict {
    const text = fs.readFileSync(file, "utf8");
    return JSON.parse(text);
}

function ensureNonEmptyString(v: any): v is string {
    return typeof v === "string" && v.trim().length > 0;
}

describe("i18n Forecast keys presence", () => {
    for (const { name, file } of LOCALES) {
        test(`[${name}] file exists and parses`, () => {
            expect(fs.existsSync(file)).toBe(true);
            expect(() => loadJSON(file)).not.toThrow();
        });

        test(`[${name}] required Forecast keys exist and are non-empty`, () => {
            const dict = loadJSON(file);
            const forecast = (dict?.Forecast ?? {}) as Dict;

            const missingUI = REQUIRED_UI_KEYS.filter(k => !ensureNonEmptyString(forecast[k]));
            const missingPhrases = REQUIRED_PHRASE_KEYS.filter(k => !ensureNonEmptyString(forecast[k]));

            if (missingUI.length || missingPhrases.length) {
                const msg = [
                    missingUI.length ? `Missing/empty UI keys: ${missingUI.join(", ")}` : "",
                    missingPhrases.length ? `Missing/empty phrase keys: ${missingPhrases.join(", ")}` : "",
                ].filter(Boolean).join(" | ");
                throw new Error(`[${name}] ${msg}`);
            }

            // Optional: if "mist" exists, it must be non-empty
            if ("mist" in forecast) {
                expect(ensureNonEmptyString(forecast["mist"])).toBe(true);
            }
        });
    }
});
