// services/__tests__/mocks/weatherScenarios.ts
// Deterministic, exhaustive mock scenarios for Weather Wear tests (PT inputs).
import { TFunction } from 'i18next';
import { TemperatureRange } from '../../../types/suggestion';

// PT unions to match your current WeatherContext
export type GeneroPT = 'masculino' | 'feminino' | 'unissex';
export type ConfortoPT = 'frio' | 'neutro' | 'calor';

export type Scenario = {
    name: string;
    genero: GeneroPT;
    conforto: ConfortoPT;
    temperatura: number;      // °C
    sensacaoTermica: number;  // °C
    chuva: boolean;
    vento: number;            // km/h
    rainMM: number;           // mm
    expectedRange: TemperatureRange;
    expectedOverlay?: string;
};

const COMFORT_ADJ_PT: Record<ConfortoPT, number> = { frio: -2, neutro: 0, calor: 2 };

const RANGE_TARGET: Record<TemperatureRange, number> = {
    freezing: 2,
    cold: 8,
    chilly: 12,
    mild: 15,
    comfortable: 20,
    warm: 24,
    hot: 27,
    extreme_heat: 33,
};

const RANGES: TemperatureRange[] = ['freezing', 'cold', 'chilly', 'mild', 'comfortable', 'warm', 'hot', 'extreme_heat'];
const GENDERS_PT: GeneroPT[] = ['masculino', 'feminino', 'unissex'];
const COMFORTS_PT: ConfortoPT[] = ['frio', 'neutro', 'calor'];

function inputsForTargetAdjusted(target: number, comfort: ConfortoPT) {
    const base = target - COMFORT_ADJ_PT[comfort];
    return { temperatura: base, sensacaoTermica: base };
}

// 8×3×3 = 72 base scenarios
export const SCENARIOS_BASE: Scenario[] = (() => {
    const rows: Scenario[] = [];
    for (const range of RANGES) {
        for (const genero of GENDERS_PT) {
            for (const conforto of COMFORTS_PT) {
                const { temperatura, sensacaoTermica } = inputsForTargetAdjusted(RANGE_TARGET[range], conforto);
                rows.push({
                    name: `base/${range}/${genero}/${conforto}`,
                    genero,
                    conforto,
                    temperatura,
                    sensacaoTermica,
                    chuva: false,
                    vento: 8,
                    rainMM: 0,
                    expectedRange: range,
                });
            }
        }
    }
    return rows;
})();

// Range boundaries
const BOUNDARIES: Array<{ edge: number, range: TemperatureRange }> = [
    { edge: 5, range: 'freezing' },
    { edge: 10, range: 'cold' },
    { edge: 13, range: 'chilly' },
    { edge: 16, range: 'mild' },
    { edge: 22, range: 'comfortable' },
    { edge: 25, range: 'warm' },
    { edge: 28, range: 'hot' },
];

export const SCENARIOS_BOUNDARIES: Scenario[] = BOUNDARIES.map(({ edge, range }) => ({
    name: `boundary/${edge}C/neutral`,
    genero: 'unissex',
    conforto: 'neutro',
    temperatura: edge,
    sensacaoTermica: edge,
    chuva: false,
    vento: 5,
    rainMM: 0,
    expectedRange: range,
}));

// Overlays
export const SCENARIOS_OVERLAYS: Scenario[] = [
    // Rain: 1+, 3+, 5+
    {
        name: 'overlay/rain_1+',
        genero: 'masculino',
        conforto: 'neutro',
        ...inputsForTargetAdjusted(RANGE_TARGET['comfortable'], 'neutro'),
        chuva: true,
        vento: 5,
        rainMM: 1,
        expectedRange: 'comfortable',
        expectedOverlay: 'rain.rain_1+',
    },
    {
        name: 'overlay/rain_3+',
        genero: 'masculino',
        conforto: 'neutro',
        ...inputsForTargetAdjusted(RANGE_TARGET['comfortable'], 'neutro'),
        chuva: true,
        vento: 5,
        rainMM: 3,
        expectedRange: 'comfortable',
        expectedOverlay: 'rain.rain_3+',
    },
    {
        name: 'overlay/rain_5+',
        genero: 'masculino',
        conforto: 'neutro',
        ...inputsForTargetAdjusted(RANGE_TARGET['comfortable'], 'neutro'),
        chuva: true,
        vento: 5,
        rainMM: 5,
        expectedRange: 'comfortable',
        expectedOverlay: 'rain.rain_5+',
    },
    // Wind-only (>=30) when temp < 23 => 'wind'
    {
        name: 'overlay/wind_30_45',
        genero: 'masculino',
        conforto: 'neutro',
        ...inputsForTargetAdjusted(RANGE_TARGET['mild'], 'neutro'),
        chuva: false,
        vento: 35,
        rainMM: 0,
        expectedRange: 'mild',
        expectedOverlay: 'wind.wind_30_45',
    },
    {
        name: 'overlay/wind_45+',
        genero: 'masculino',
        conforto: 'neutro',
        ...inputsForTargetAdjusted(RANGE_TARGET['mild'], 'neutro'),
        chuva: false,
        vento: 50,
        rainMM: 0,
        expectedRange: 'mild',
        expectedOverlay: 'wind.wind_45+',
    },
    // Wind + Rain (vento >= 20 & chuva)
    {
        name: 'overlay/windandrain',
        genero: 'masculino',
        conforto: 'neutro',
        ...inputsForTargetAdjusted(RANGE_TARGET['comfortable'], 'neutro'),
        chuva: true,
        vento: 25,
        rainMM: 3,
        expectedRange: 'comfortable',
        expectedOverlay: 'windandrain.wind_20+_and_rain_3+',
    },
    // Wind & Warm (vento >= 30 & temp >= 23)
    {
        name: 'overlay/windandwarm',
        genero: 'masculino',
        conforto: 'neutro',
        ...inputsForTargetAdjusted(24, 'neutro'), // >= 23
        chuva: false,
        vento: 32,
        rainMM: 0,
        expectedRange: 'warm',
        expectedOverlay: 'windandwarm.temp_23+_and_wind_30+',
    },
    // Control: vento 20 sem chuva não gera overlay
    {
        name: 'control/no_overlay_wind_20',
        genero: 'masculino',
        conforto: 'neutro',
        ...inputsForTargetAdjusted(RANGE_TARGET['comfortable'], 'neutro'),
        chuva: false,
        vento: 20,
        rainMM: 0,
        expectedRange: 'comfortable',
    },
];

export const ALL_SCENARIOS: Scenario[] = [
    ...SCENARIOS_BASE,
    ...SCENARIOS_BOUNDARIES,
    ...SCENARIOS_OVERLAYS,
];

// Minimal i18n mock
export const mockT: TFunction = ((key: string, _opts?: any) => {
    if (key.startsWith('suggestions.')) {
        return {
            top: 'Mock Top',
            bottom: 'Mock Bottom',
            shoes: 'Mock Shoes',
            recommendation: 'Base recommendation.',
        };
    }
    if (key.startsWith('overlays.')) {
        const [, event, dimension] = key.split('.');
        const accessoriesByOverlay: Record<string, string[]> = {
            'rain.rain_1+': ['umbrella'],
            'rain.rain_3+': ['lined_raincoat', 'umbrella'],
            'rain.rain_5+': ['rain_boots', 'lined_raincoat', 'umbrella'],
            'wind.wind_30_45': ['scarfLight'],
            'wind.wind_45+': ['scarfMedium', 'hatTight'],
            'windandrain.wind_20+_and_rain_3+': ['lined_raincoat', 'umbrella'],
            'windandwarm.temp_23+_and_wind_30+': ['sunglasses', 'cap'],
        };
        const k = `${event}.${dimension}`;
        return { description: `[OVL] ${k}`, accessories: accessoriesByOverlay[k] || [] };
    }
    return key;
}) as unknown as TFunction;
