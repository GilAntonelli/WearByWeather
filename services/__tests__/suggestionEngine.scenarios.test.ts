// services/__tests__/suggestionEngine.scenarios.test.ts
import { getSuggestionByWeather, getThermalRangeDecription } from '../suggestionEngine';
import { ALL_SCENARIOS, SCENARIOS_OVERLAYS, mockT } from './mocks/weatherScenarios';
import type { ConfortoPT } from './mocks/weatherScenarios';
import type { WeatherContext } from '../../types/suggestion';

function adjustedTempPT(t: number, feels: number, comfort: ConfortoPT) {
    const adj = comfort === 'frio' ? -2 : comfort === 'calor' ? 2 : 0;
    return (t + feels) / 2 + adj;
}

describe('suggestionEngine - scenario catalog (PT inputs)', () => {
    it('covers base scenarios across all ranges × genders × comfort', () => {
        expect(ALL_SCENARIOS.length).toBeGreaterThanOrEqual(72 + 7 + SCENARIOS_OVERLAYS.length);
    });

    it.each(ALL_SCENARIOS)('range resolution: %s', (sc) => {
        const adj = adjustedTempPT(sc.temperatura, sc.sensacaoTermica, sc.conforto);
        const range = getThermalRangeDecription(adj);
        expect(range).toBe(sc.expectedRange);
    });

    it.each(SCENARIOS_OVERLAYS)('applies overlays and merges accessories: %s', (sc) => {
        const res = getSuggestionByWeather({
            temperatura: sc.temperatura,
            sensacaoTermica: sc.sensacaoTermica,
            chuva: sc.chuva,
            vento: sc.vento,
            genero: sc.genero,      // PT values
            conforto: sc.conforto,  // PT values
            t: mockT,
            rainMM: sc.rainMM,      // <-- needed to hit 1+/3+/5+
        } as unknown as WeatherContext);

        if (sc.expectedOverlay) {
            expect(res.recommendation).toContain('[OVL]');
            expect(res.acessórios.length).toBeGreaterThan(0);
        } else {
            expect(res.recommendation).toBe('Base recommendation.');
        }

        // Image should resolve (RN/Jest usually mocks assets; truthy is enough)
        expect(res.image).toBeTruthy();
    });
});
