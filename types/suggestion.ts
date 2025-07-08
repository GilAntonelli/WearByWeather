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
  acessórios?: string[];
  recomendação: string;
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