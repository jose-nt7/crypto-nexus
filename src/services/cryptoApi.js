
const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';

const MOEDAS = [
  'bitcoin',
  'ethereum',
  'litecoin',
  'solana',
  'cardano',
  'dogecoin'
];

export async function buscarCriptomoedas(signal) {
  const parametros = new URLSearchParams({
    vs_currency: 'usd',
    ids: MOEDAS.join(','),
    order: 'market_cap_desc',
    per_page: '6',
    page: '1',
    sparkline: 'false'
  });

  const resposta = await fetch(`${API_URL}?${parametros}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    signal
  });

  if (!resposta.ok) {
    throw new Error(
      `Erro ao consultar CoinGecko: HTTP ${resposta.status}`
    );
  }

  const dados = await resposta.json();

  if (!Array.isArray(dados) || dados.length === 0) {
    throw new Error('A API não retornou criptomoedas.');
  }

  return dados.map((moeda) => ({
    id: moeda.id,
    nome: moeda.name,
    simbolo: moeda.symbol.toUpperCase(),
    imagem: moeda.image,
    preco: moeda.current_price,
    variacao: moeda.price_change_percentage_24h,
    mercado: moeda.market_cap,
    atualizadoEm: moeda.last_updated
  }));
}

/**
 * Consulta o histórico de preços de uma criptomoeda.
 * Os dados são fornecidos pela CoinGecko.
 *
 * @param {string} moedaId - ID da criptomoeda
 * @param {number} dias - Período do histórico
 * @param {AbortSignal} signal - Permite cancelar a requisição
 */
export async function buscarHistoricoCripto(
  moedaId,
  dias = 7,
  signal
) {
  const moedasPermitidas = [
    'bitcoin',
    'ethereum',
    'litecoin',
    'solana',
    'cardano',
    'dogecoin'
  ];

  if (!moedasPermitidas.includes(moedaId)) {
    throw new Error('Criptomoeda não suportada.');
  }

  if (![7, 30].includes(dias)) {
    throw new Error('Período não suportado.');
  }

  const parametros = new URLSearchParams({
    vs_currency: 'usd',
    days: String(dias)
  });

  const url =
    `https://api.coingecko.com/api/v3/coins/${moedaId}/market_chart?${parametros}`;

  const resposta = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    signal
  });

  if (!resposta.ok) {
    throw new Error(
      `Erro ao consultar histórico: HTTP ${resposta.status}`
    );
  }

  const dados = await resposta.json();

  if (!Array.isArray(dados.prices) || dados.prices.length === 0) {
    throw new Error('Histórico de preços indisponível.');
  }

  return dados.prices
    .filter(
      (item) =>
        Array.isArray(item) &&
        Number.isFinite(item[0]) &&
        Number.isFinite(item[1])
    )
    .map(([timestamp, preco]) => ({
      timestamp,
      preco
    }));
}

export async function buscarDetalhesCripto(moedaId, signal) {
  const moedasPermitidas = [
    'bitcoin',
    'ethereum',
    'litecoin',
    'solana',
    'cardano',
    'dogecoin'
  ];

  if (!moedasPermitidas.includes(moedaId)) {
    throw new Error('Criptomoeda não encontrada.');
  }

  const parametros = new URLSearchParams({
    localization: 'false',
    tickers: 'false',
    market_data: 'true',
    community_data: 'false',
    developer_data: 'false',
    sparkline: 'false'
  });

  const resposta = await fetch(
    `https://api.coingecko.com/api/v3/coins/${moedaId}?${parametros}`,
    {
      signal,
      headers: {
        Accept: 'application/json'
      }
    }
  );

  if (!resposta.ok) {
    throw new Error(`Erro ao consultar detalhes: HTTP ${resposta.status}`);
  }

  const dados = await resposta.json();

  return {
    id: dados.id,
    nome: dados.name,
    simbolo: dados.symbol.toUpperCase(),
    imagem: dados.image?.large,
    ranking: dados.market_cap_rank,
    preco: dados.market_data?.current_price?.usd,
    variacao24h: dados.market_data?.price_change_percentage_24h,
    mercado: dados.market_data?.market_cap?.usd,
    volume24h: dados.market_data?.total_volume?.usd,
    maxima24h: dados.market_data?.high_24h?.usd,
    minima24h: dados.market_data?.low_24h?.usd,
    atualizadoEm: dados.market_data?.last_updated
  };
}
