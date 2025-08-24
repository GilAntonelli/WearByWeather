// utils/weatherColors.ts

const conditionColorMap: Record<string, string> = {
  'céu limpo': '#A4D4FF',
  'céu pouco nublado': '#abb4bc',
  'nevoeiro': '#d1dade',
  'poucas nuvens': '#C3D9F3',
  'nuvens dispersas': '#D6E0EB',
  'nuvens encobertas': '#BFC8D1',
  'nublado': '#BFC8D1',
  'parcialmente nublado': '#D6E0EB',

  'chuva leve': '#A1BBD4',
  'chuva moderada': '#90AEC7',
  'chuva': '#7FA1BF',
  'chuva forte': '#5F7C99',
  'trovoadas': '#495866',
  'trovoada': '#495866',
  'tempestade': '#3D4C5C',

  'neve': '#E0F7FA',
  'neblina': '#E8ECEF',
  'névoa': '#DDE4E8',
  'névoa seca': '#D9E2E6',

  'garoa': '#B5C7D3',
  'poeira': '#E9D8B5',
  'tornado': '#4D4D4D',
};

const DEFAULT_COLOR = '#A4D4FF';
// --- Color utils to build same-hue gradients ---
function mix(hex1: string, hex2: string, w: number): string {
  // clamp weight
  const weight = Math.min(1, Math.max(0, w));

  // normalize to 6-digit hex
  const normalize = (h: string) => {
    let x = h.replace('#', '').trim();
    if (x.length === 3) x = x.split('').map((c) => c + c).join('');
    return x.slice(0, 6);
  };

  const h1 = normalize(hex1);
  const h2 = normalize(hex2);

  const r1 = parseInt(h1.slice(0, 2), 16);
  const g1 = parseInt(h1.slice(2, 4), 16);
  const b1 = parseInt(h1.slice(4, 6), 16);

  const r2 = parseInt(h2.slice(0, 2), 16);
  const g2 = parseInt(h2.slice(2, 4), 16);
  const b2 = parseInt(h2.slice(4, 6), 16);

  const r = Math.round(r1 * (1 - weight) + r2 * weight);
  const g = Math.round(g1 * (1 - weight) + g2 * weight); // <- aqui faltava o *
  const b = Math.round(b1 * (1 - weight) + b2 * weight);

  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}



function lighten(hex: string, amt: number) { return mix(hex, '#FFFFFF', amt); }
function darken(hex: string, amt: number) { return mix(hex, '#000000', amt); }


export function getWeatherBackgroundColor(id: number): string {
  if (id >= 200 && id <= 202) return '#495866'; // Trovoadas leves a moderadas
  if (id >= 210 && id <= 221) return '#495866'; // Trovoadas locais
  if (id >= 230 && id <= 232) return '#3D4C5C'; // Tempestades com chuva forte

  if (id >= 300 && id <= 302) return '#B3C7D8'; // light to moderate drizzle
  if (id >= 310 && id <= 321) return '#A3B9CE'; // drizzle w/ rain

  if (id === 500) return '#A1BBD4';             // light rain
  if (id === 501) return '#90AEC7';             // moderate rain
  if (id >= 502 && id <= 504) return '#5F7C99'; // heavy to very heavy rain
  if (id === 511) return '#A4C7E8';             // freezing rain (icier tone)
  if (id >= 520 && id <= 531) return '#7FA1BF'; // shower rain (irregular)



  if (id >= 600 && id <= 602) return '#E0F7FA'; // Neve leve a forte
  if (id >= 611 && id <= 622) return '#E0F7FA'; // Neve com garoa, irregular

  if (id === 701) return '#DDE4E8';             // Névoa
  if (id === 711) return '#D9E2E6';             // Fumaça (névoa seca)
  if (id === 721) return '#D9E2E6';             // Névoa seca (haze)
  if (id === 731 || id === 761) return '#E9D8B5'; // Poeira/sand/dust
  if (id === 741) return '#E8ECEF';             // Neblina
  if (id === 751) return '#E9D8B5';             // Areia
  if (id === 762) return '#E9D8B5';             // Cinzas vulcânicas
  if (id === 771) return '#4A5968';             // Rajadas de vento (squall)
  if (id === 781) return '#4D4D4D';             // Tornado

  if (id === 800) return '#2F80ED';           // Céu limpo

if (id === 801) return '#D8E6F7';             // few clouds (lightest)
if (id === 802) return '#C7D7E6';             // scattered clouds
if (id === 803) return '#B3BEC8';             // broken clouds
if (id === 804) return '#9CA7B2';             // overcast clouds (darkest)

  return DEFAULT_COLOR; // fallback
}

// --- Overlay utilities: choose opacity by base color luminance ---
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 6 ? h : h.slice(0, 6), 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const srgb = [r, g, b].map((v) => v / 255).map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function pickOverlayForBase(baseHex: string, isNight: boolean): string {
  // Luminance: 0 (black) .. 1 (white)
  const L = relativeLuminance(baseHex);

  // Daytime baseline by brightness
  let overlay = '#00000066'; // ~40%
  if (L > 0.85) overlay = '#000000A6';    // very light base -> stronger overlay
  else if (L > 0.75) overlay = '#00000080';
  else if (L < 0.25) overlay = '#0000004D'; // very dark base -> softer overlay

  // Night boost
  if (isNight) {
    // increase opacity one step
    if (overlay === '#0000004D') overlay = '#00000066';
    else if (overlay === '#00000066') overlay = '#00000080';
    else overlay = '#00000099';
  }
  return overlay;
}

export function getWeatherGradientColors(id: number): [string, string] {
  const base = getWeatherBackgroundColor(id);
  // same-hue gradient: darker top -> lighter bottom
  const top = darken(base, 0.18);
  const bottom = lighten(base, 0.08);
  return [top, bottom];
}

export function getWeatherGradientColorsByIcon(id: number, icon?: string): [string, string] {
  if (!icon) return getWeatherGradientColors(id); // same as daytime when no icon

  const base = getWeatherBackgroundColor(id);
  const isNight = icon.endsWith('n');

  // night = deeper; day = lighter, but always same hue
  const top = isNight ? darken(base, 0.28) : darken(base, 0.18);
  const bottom = isNight ? darken(base, 0.04) : lighten(base, 0.08);

  return [top, bottom];
}