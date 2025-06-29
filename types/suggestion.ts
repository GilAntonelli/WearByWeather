import { Image, ImageSourcePropType } from 'react-native';

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
}

export interface LookSuggestion {
  roupaSuperior: string;
  roupaInferior: string;
  acessórios?: string[];
  recomendação: string;
  image: ImageSourcePropType;
}