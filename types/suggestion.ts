import { Image, ImageSourcePropType } from 'react-native';

export interface WeatherContext {
  temperatura: number;
  sensacaoTermica: number;
  chuva: boolean;
  vento: number;
  genero: 'masculino' | 'feminino' | 'unissex';
  conforto: 'frio' | 'neutro' | 'calor';
}

export interface LookSuggestion {
  roupaSuperior: string;
  roupaInferior: string;
  acessórios?: string[];
  recomendação: string;
  image: ImageSourcePropType;
}