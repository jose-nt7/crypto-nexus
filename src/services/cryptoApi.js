
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
