// utils/__tests__/weatherColors.test.ts
import {
  getWeatherBackgroundColor,
  getWeatherGradientColors,
  getWeatherGradientColorsByIcon,
} from '../weatherColors';

function isHexColor(s: string) {
  return /^#[0-9a-fA-F]{6}$/.test(s);
}

// relative luminance (0..1)
function luminance(hex: string) {
  const toRgb = (h: string) => {
    const v = h.replace('#', '');
    const i = parseInt(v, 16);
    return { r: (i >> 16) & 255, g: (i >> 8) & 255, b: i & 255 };
  };
  const { r, g, b } = toRgb(hex);
  const srgb = [r, g, b].map((v) => v / 255).map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

describe('weatherColors', () => {
    test('rain family monotonicity: 502–504 < 501 < 500 (darker = lower luminance)', () => {
  const L = (id: number) => luminance(getWeatherBackgroundColor(id));
  const heavy = L(502); // 502-504 usam a mesma base
  const moderate = L(501);
  const light = L(500);
  expect(heavy).toBeLessThan(moderate);
  expect(moderate).toBeLessThan(light);
});

test('cloud family monotonicity: 804 < 803 < 802 < 801', () => {
  const L = (id: number) => luminance(getWeatherBackgroundColor(id));
  expect(L(804)).toBeLessThan(L(803));
  expect(L(803)).toBeLessThan(L(802));
  expect(L(802)).toBeLessThan(L(801));
});

test('thunderstorm severity: 230–232 darker than 200–202', () => {
  const L = (id: number) => luminance(getWeatherBackgroundColor(id));
  // pick representative codes from each sub-range
  expect(L(231)).toBeLessThan(L(201));
});

test('drizzle is lighter than regular rain', () => {
  const L = (id: number) => luminance(getWeatherBackgroundColor(id));
  // drizzle 300–302 vs rain 500/501
  expect(L(301)).toBeGreaterThan(L(500));
  expect(L(301)).toBeGreaterThan(L(501));
});

test('snow/fog are relatively light backgrounds', () => {
  const snowL = luminance(getWeatherBackgroundColor(600));
  const fogL = luminance(getWeatherBackgroundColor(741));
  // not too strict, apenas garante que são “claros”
  expect(snowL).toBeGreaterThan(0.6);
  expect(fogL).toBeGreaterThan(0.6);
});

test('range edges fall back or remain defined: 199, 233, 322, 505, 532, 623', () => {
  const ids = [199, 233, 322, 505, 532, 623];
  for (const id of ids) {
    const color = getWeatherBackgroundColor(id);
    expect(isHexColor(color)).toBe(true);
  }
});

test('night gradient tends to be darker at the top and not lighter at the bottom vs day', () => {
  const id = 800; // clear sky (bom para ver diferença)
  const [topDay, bottomDay] = getWeatherGradientColorsByIcon(id, '01d');
  const [topNight, bottomNight] = getWeatherGradientColorsByIcon(id, '01n');

  expect(luminance(topNight)).toBeLessThan(luminance(topDay));
  // bottom at night should not be brighter than bottom at day
  expect(luminance(bottomNight)).toBeLessThanOrEqual(luminance(bottomDay));
});

  test('getWeatherBackgroundColor returns valid hex for common IDs', () => {
    const ids = [800, 500, 501, 803, 804, 741, 781, 511, 300, 520];
    for (const id of ids) {
      const color = getWeatherBackgroundColor(id);
      expect(isHexColor(color)).toBe(true);
    }
  });

  test('unknown id falls back to default color', () => {
    const color = getWeatherBackgroundColor(-1);
    expect(isHexColor(color)).toBe(true);
    // If you want a strict check against the current DEFAULT_COLOR, keep this:
    expect(color.toUpperCase()).toBe('#A4D4FF');
  });

  test('overcast (804) should be darker than scattered (802)', () => {
    const c802 = getWeatherBackgroundColor(802);
    const c804 = getWeatherBackgroundColor(804);
    expect(luminance(c804)).toBeLessThan(luminance(c802));
  });

  test('getWeatherGradientColors returns a valid same-hue gradient', () => {
    const [top, bottom] = getWeatherGradientColors(800);
    expect(isHexColor(top)).toBe(true);
    expect(isHexColor(bottom)).toBe(true);
    expect(top.toLowerCase()).not.toBe(bottom.toLowerCase());
    // Expect top darker than bottom
    expect(luminance(top)).toBeLessThan(luminance(bottom));
  });

  test('getWeatherGradientColorsByIcon day vs night', () => {
    // snow-like base (very light) is a good stress test
    const id = 600;

    const [topDay, bottomDay] = getWeatherGradientColorsByIcon(id, '01d');
    const [topNight, bottomNight] = getWeatherGradientColorsByIcon(id, '01n');

    // Valid hex
    expect(isHexColor(topDay)).toBe(true);
    expect(isHexColor(bottomDay)).toBe(true);
    expect(isHexColor(topNight)).toBe(true);
    expect(isHexColor(bottomNight)).toBe(true);

    // In both cases top is darker than bottom
    expect(luminance(topDay)).toBeLessThan(luminance(bottomDay));
    expect(luminance(topNight)).toBeLessThan(luminance(bottomNight));

    // Night top should be darker than day top
    expect(luminance(topNight)).toBeLessThan(luminance(topDay));
  });

  test('byIcon without icon behaves like daytime gradient', () => {
    const [t1, b1] = getWeatherGradientColors(800);
    const [t2, b2] = getWeatherGradientColorsByIcon(800, undefined);

    // same algorithm for day → should match
    expect(t2.toLowerCase()).toBe(t1.toLowerCase());
    expect(b2.toLowerCase()).toBe(b1.toLowerCase());
  });
});
