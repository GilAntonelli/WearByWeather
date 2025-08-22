// types/suggestion.ts
import { Image, ImageSourcePropType } from 'react-native';
import { TFunction } from 'i18next';


export interface WeatherContext {
  temperatura: number;
  sensacaoTermica: number;
  vento: number;
  umidade: number;        // ← precisa adicionar
  visibilidade: number;   // ← precisa adicionar
  chuva: boolean;
  clima: string;
  genero: 'masculino' | 'feminino' | 'unissex';
  conforto: 'frio' | 'calor' | 'neutro';
  t: TFunction
}

export interface LookSuggestion {
  roupaSuperior: string;
  roupaInferior?: string;
  acessórios: string[]; // <-- agora obrigatório
  shoes?: string;
  recommendation?: string;
  image: ImageSourcePropType; // mantém como está no teu projeto
}
export interface LookSuggestionJson {
  isSinglePiece: boolean;
  top: string;
  bottom: string;
  accessories?: string[];
  shoes: string
  recommendation: string;
  singlePiece: string;
}

export interface OverlaysJson {
  description: string;
  accessories?: string[]; // optional overlay accessories merged into the final output
}

export type TemperatureRange =
  | 'freezing'
  | 'cold'
  | 'chilly'
  | 'mild'
  | 'comfortable'
  | 'warm'
  | 'hot'
  | 'extreme_heat'; // cuidado: você usava "extremely_hot", mas o correto no projeto é "extreme_heat"

export type ComfortLevel = 'feel_cold' | 'neutral' | 'feel_hot';

// --- Cross-language unions (PT + EN) for backward compatibility ---
export type GenderPT = 'masculino' | 'feminino' | 'unissex';
export type GenderEN = 'male' | 'female' | 'unisex';
export type GenderAny = GenderPT | GenderEN;

export type ComfortPT = 'frio' | 'neutro' | 'calor';
export type ComfortAny = ComfortPT | ComfortLevel;

// --- Minimal input that the suggestion engine actually needs ---
export type SuggestionInput = {
  temperatura: number;
  sensacaoTermica: number;
  chuva: boolean;
  vento: number;
  genero: GenderAny;
  conforto: ComfortAny;
  t: TFunction;
  // Optional rain volume (mm) to drive rain_1+/3+/5+ overlays in tests and real data
  rainMM?: number;
};