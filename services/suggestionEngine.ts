import { LookSuggestion, LookSuggestionJson, WeatherContext } from '../types/suggestion';
import { TFunction } from 'i18next';

export function getSuggestionByWeather({
  temperatura,
  sensacaoTermica,
  chuva,
  vento,
  genero,
  conforto,
  t
}: WeatherContext): LookSuggestion {
  const tempBase = (temperatura + sensacaoTermica) / 2;

  const confortoAjuste: Record<string, number> = {
    frio: -2,
    calor: 2,
    neutro: 0,
  };
  const tempAjustada = tempBase + (confortoAjuste[conforto] ?? 0);

  let roupaSuperior = '';
  let roupaInferior = '';
  let acessórios: string[] = [];
  let recomendação = '';
  let image = null;

  let suggestions: LookSuggestion = {
    roupaSuperior: '',
    roupaInferior: '',
    recomendação: '',
    image: getAvatar('calor', genero), // ou uma imagem padrão
  };

  if (tempAjustada <= 5) {
    suggestions = getSuggestions(genero, 'freezing', conforto, t);
    roupaSuperior = suggestions.roupaSuperior;
    roupaInferior = suggestions.roupaInferior;
    acessórios = suggestions.acessórios || [];
    image = getAvatar('frio', genero);
  } else if (tempAjustada <= 10) {
    roupaSuperior = 'Casaco grosso e blusa térmica';
    roupaInferior =
      genero === 'feminino'
        ? 'Calça térmica ou legging'
        : genero === 'unissex'
          ? 'Calça ou legging térmica'
          : 'Calça jeans ou forrada';
    acessórios.push('Cachecol', 'Touca', 'Luvas');
    recomendação = 'Muito frio! Use roupas térmicas.';
    image = getAvatar('frio', genero);
  } else if (tempAjustada <= 13) {
    roupaSuperior = 'Casaco grosso e blusa térmica';
    roupaInferior =
      genero === 'feminino'
        ? 'Calça térmica ou legging'
        : genero === 'unissex'
          ? 'Calça ou legging térmica'
          : 'Calça jeans ou forrada';
    acessórios.push('Cachecol', 'Touca', 'Luvas');
    recomendação = 'Muito frio! Use roupas térmicas.';
    image = getAvatar('frio', genero);
  } else if (tempAjustada <= 16) {
    roupaSuperior = 'Casaco leve ou moletom';
    roupaInferior =
      genero === 'feminino'
        ? 'Calça ou saia longa com meia-calça'
        : genero === 'unissex'
          ? 'Calça leve ou sarja'
          : 'Calça jeans ou sarja';
    acessórios.push('Touca');
    recomendação = 'Clima fresco. Leve um agasalho.';
    image = getAvatar('fresco', genero);
  } else if (tempAjustada <= 22) {
    roupaSuperior = 'Camisa leve ou camiseta';
    roupaInferior =
      genero === 'feminino'
        ? 'Calça leve, saia midi ou vestido'
        : genero === 'unissex'
          ? 'Calça ou bermuda'
          : 'Calça leve ou jeans';
    acessórios.push('Tênis leve ou sapato fechado');
    recomendação = 'Clima ameno. Conforto é a chave.';
    image = getAvatar('ameno', genero);
  } else if (tempAjustada <= 25) {
    roupaSuperior = 'Camisa leve ou camiseta';
    roupaInferior =
      genero === 'feminino'
        ? 'Calça leve, saia midi ou vestido'
        : genero === 'unissex'
          ? 'Calça ou bermuda'
          : 'Calça leve ou jeans';
    acessórios.push('Tênis leve ou sapato fechado');
    recomendação = 'Clima ameno. Conforto é a chave.';
    image = getAvatar('ameno', genero);
  } else if (tempAjustada <= 28) {
    roupaSuperior = 'Camiseta ou regata';
    roupaInferior =
      genero === 'feminino'
        ? 'Short, saia ou vestido leve'
        : genero === 'unissex'
          ? 'Bermuda ou short'
          : 'Bermuda ou calça de linho';
    acessórios.push('Óculos escuros');
    recomendação = 'Quente. Prefira roupas frescas.';
    image = getAvatar('quente', genero);
  } else {
    roupaSuperior = 'Regata leve ou top';
    roupaInferior =
      genero === 'feminino'
        ? 'Vestido leve ou saia curta'
        : genero === 'unissex'
          ? 'Short curto ou bermuda leve'
          : 'Bermuda ou short leve';
    acessórios.push('Óculos escuros', 'Chapéu ou boné', 'Protetor solar');
    recomendação = 'Muito calor! Proteja-se do sol.';

    image = getAvatar('calor', genero);
  }

  // ☔ Chuva
  if (chuva) {
    acessórios.push('Guarda-chuva', 'Capa de chuva', 'Bota impermeável');
    recomendação += ' Possibilidade de chuva.';
  }

  // 💨 Vento
  if (vento > 25) {
    acessórios.push('Jaqueta corta-vento', 'Gorro ajustado', 'Elástico de cabelo');
    recomendação += ' Ventos intensos previstos.';
  }

  return {
    roupaSuperior,
    roupaInferior,
    acessórios,
    recomendação,
    image: image,
  };
}


// Map estático para evitar erro no Metro bundler
const avatarMap: Record<string, any> = {
  'frio_masculino': require('../assets/images/frio/AvatarMasculino.png'),
  'frio_feminino': require('../assets/images/frio/AvatarFeminino.png'),
  'frio_unissex': require('../assets/images/frio/AvatarUnissex.png'),

  'fresco_masculino': require('../assets/images/fresco/AvatarMasculino.png'),
  'fresco_feminino': require('../assets/images/fresco/AvatarFeminino.png'),
  'fresco_unissex': require('../assets/images/fresco/AvatarUnissex.png'),

  'ameno_masculino': require('../assets/images/ameno/AvatarMasculino.png'),
  'ameno_feminino': require('../assets/images/ameno/AvatarFeminino.png'),
  'ameno_unissex': require('../assets/images/ameno/AvatarUnissex.png'),

  'quente_masculino': require('../assets/images/quente/AvatarMasculino.png'),
  'quente_feminino': require('../assets/images/quente/AvatarFeminino.png'),
  'quente_unissex': require('../assets/images/quente/AvatarUnissex.png'),

  'calor_masculino': require('../assets/images/calor/AvatarMasculino.png'),
  'calor_feminino': require('../assets/images/calor/AvatarFeminino.png'),
  'calor_unissex': require('../assets/images/calor/AvatarUnissex.png'),
};

function getAvatar(faixa: string, genero: string): any {
  const key = `${faixa}_${genero}`;
  return avatarMap[key] || avatarMap['ameno_masculino'];
}

export function getSuggestions(
  gender: string,
  range: string,
  comfort: string,
  t: TFunction
): LookSuggestion {

  let suggestions = t(`suggestions.${gender}.${range}.neutral`, {
    returnObjects: true,
  }) as LookSuggestionJson;
  return {
    roupaSuperior: suggestions.top,
    roupaInferior: suggestions.bottom,
    acessórios: suggestions.accessories || [],
    recomendação: '',
    image: getAvatar(range, gender),
  };
}


/*import { WeatherContext, LookSuggestion } from '../types/suggestion';

export function getSuggestionByWeather({
    temperatura,
    sensacaoTermica,
    chuva,
    vento,
    genero,
    conforto,
}: WeatherContext): LookSuggestion {
    // 1. Ajuste de temperatura
    const tempBase = (temperatura + sensacaoTermica) / 2;
    let ajuste = 0;

    const confortoAjuste: Record<string, number> = {
        'frio': -2,
        'calor': 2,
        'neutro': 0,
    };

    ajuste += confortoAjuste[conforto] ?? 0;
    const tempAjustada = tempBase + ajuste;

    // 2. Sugestão base
    let roupaSuperior = '';
    let roupaInferior = '';
    let acessórios: string[] = [];
    let recomendação = '';
    let image = null;

    if (tempAjustada <= 10) {
        roupaSuperior = 'Casaco grosso e blusa térmica';
        roupaInferior = genero === 'feminino'
            ? 'Calça térmica ou legging'
            : 'Calça jeans ou forrada';
        acessórios.push('Cachecol', 'Gorro', 'Luvas');
        recomendação = 'Muito frio! Use roupas térmicas.';
        image = require('../assets/images/frio/AvatarMasculino.png');
        if(genero == 'feminino'){
            image = require('../assets/images/frio/AvatarFeminino.png');
        }
        if(genero == 'unissex'){
            image = require('../assets/images/frio/AvatarUnissex.png');
        }        
    } else if (tempAjustada <= 16) {
        roupaSuperior = 'Casaco leve ou moletom';
        roupaInferior = genero === 'feminino'
            ? 'Calça ou saia longa com meia-calça'
            : 'Calça jeans ou sarja';
        acessórios.push('Tênis ou sapato fechado');
        recomendação = 'Clima fresco. Leve um agasalho.';
        image = require('../assets/images/fresco/AvatarMasculino.png');
        if(genero == 'feminino'){
            image = require('../assets/images/fresco/AvatarFeminino.png');
        }
        if(genero == 'unissex'){
            image = require('../assets/images/fresco/AvatarUnissex.png');
        }         
    } else if (tempAjustada <= 22) {
        roupaSuperior = 'Camisa leve ou camiseta';
        roupaInferior = genero === 'feminino'
            ? 'Calça leve, saia midi ou vestido'
            : genero === 'unissex'
                ? 'Calça ou bermuda'
                : 'Calça leve ou jeans';
        recomendação = 'Clima ameno. Conforto é a chave.';
        image = require('../assets/images/ameno/AvatarMasculino.png');
        if(genero == 'feminino'){
            image = require('../assets/images/ameno/AvatarMasculino.png');
        }
        if(genero == 'unissex'){
            image = require('../assets/images/ameno/AvatarMasculino.png');
        }      
    } else if (tempAjustada <= 28) {
        roupaSuperior = 'Camiseta ou regata';
        roupaInferior = genero === 'feminino'
            ? 'Short, saia ou vestido leve'
            : genero === 'unissex'
                ? 'Bermuda ou short'
                : 'Bermuda ou calça de linho';
        acessórios.push('Tênis leve ou sandália');
        recomendação = 'Quente. Prefira roupas frescas.';
        image = require('../assets/images/quente/AvatarMasculino.png');
        if(genero == 'feminino'){
            image = require('../assets/images/quente/AvatarFeminino.png');
        }
        if(genero == 'unissex'){
            image = require('../assets/images/quente/AvatarUnissex.png');
        }      
    } else {
        roupaSuperior = 'Regata leve ou top';
        roupaInferior = genero === 'feminino'
            ? 'Vestido leve ou saia curta'
            : genero === 'unissex'
            ? 'Short curto ou bermuda leve'
            : 'Bermuda ou short leve';

        // ✅ Adiciona todos os acessórios para calor
        acessórios.push('Óculos escuros', 'Chapéu ou boné', 'Protetor solar');

        recomendação = 'Muito calor! Proteja-se do sol.';
        image = require('../assets/images/calor/AvatarMasculino.png');
        if (genero === 'feminino') image = require('../assets/images/calor/AvatarFeminino.png');
        if (genero === 'unissex') image = require('../assets/images/calor/AvatarUnissex.png');
    }

    // 3. Ajustes por clima
    if (chuva) {
        acessórios.push('Guarda-chuva', 'Capa de chuva');
        recomendação += ' Possibilidade de chuva.';
    }

    if (vento > 25) {
        acessórios.push('Corta-vento');
        recomendação += ' Ventos intensos previstos.';
    }

    return {
        roupaSuperior,
        roupaInferior,
        acessórios,
        recomendação,
        image,
    };
}
 

*/