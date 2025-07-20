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
  roupaInferior: string;
  shoes: string;
  acessórios?: string[];
  recommendation: string;
  image: ImageSourcePropType;
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
  accessories: string;
  recommendation: string;
}