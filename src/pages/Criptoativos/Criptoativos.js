
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import GraficoCripto from './GraficoCripto';

import { buscarCriptomoedas } from '../../services/cryptoApi';
import { obterFavoritos, alternarFavorito } from '../../utils/favoritos';

import './Criptoativos.scss';

// Dados fictícios usados quando a API estiver indisponível.
const moedasDemo = [
  { id: 'bitcoin', nome: 'Bitcoin', simbolo: 'BTC', icone: '₿', cor: '#f7931a', preco: 65000, variacao: 2.5, mercado: 1280 },
  { id: 'ethereum', nome: 'Ethereum', simbolo: 'ETH', icone: 'Ξ', cor: '#627eea', preco: 3200, variacao: 1.8, mercado: 385 },
  { id: 'litecoin', nome: 'Litecoin', simbolo: 'LTC', icone: 'Ł', cor: '#345d9d', preco: 85, variacao: -0.7, mercado: 6.4 },
  { id: 'solana', nome: 'Solana', simbolo: 'SOL', icone: '◎', cor: '#9945ff', preco: 145, variacao: 4.2, mercado: 67 },
  { id: 'cardano', nome: 'Cardano', simbolo: 'ADA', icone: '₳', cor: '#3468d1', preco: 0.45, variacao: -1.3, mercado: 16 },
  { id: 'dogecoin', nome: 'Dogecoin', simbolo: 'DOGE', icone: 'Ð', cor: '#c2a633', preco: 0.12, variacao: 3.1, mercado: 17 }
];

// Formatação dos preços.
const formatarPreco = (valor) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: valor < 1 ? 4 : 2
  }).format(valor);

// Formatação da capitalização de mercado.
const formatarMercado = (valor, modoDemo) => {
  if (modoDemo) {
    return `US$ ${valor.toLocaleString('pt-BR')} bi`;
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2
  }).format(valor);
};

export default function Criptoativos() {
  // Pesquisa e filtros.
  const [pesquisa, setPesquisa] = useState('');
  const [filtro, setFiltro] = useState('todas');
  const [ordenacao, setOrdenacao] = useState('mercado');

  // Sistema de favoritos.
  const [favoritos, setFavoritos] = useState(obterFavoritos);
  const [somenteFavoritos, setSomenteFavoritos] = useState(false);

  // Dados da API.
  const [moedas, setMoedas] = useState(moedasDemo);
  const [carregando, setCarregando] = useState(true);
  const [modoDemo, setModoDemo] = useState(true);
  const [erroApi, setErroApi] = useState('');

  // Busca as criptomoedas na CoinGecko.
  useEffect(() => {
    const controller = new AbortController();

    async function carregarMoedas() {
      try {
        setCarregando(true);
        setErroApi('');

        const dados = await buscarCriptomoedas(controller.signal);

        if (!controller.signal.aborted) {
          setMoedas(dados);
          setModoDemo(false);
        }
      } catch (erro) {
        if (!controller.signal.aborted) {
          console.error('Erro ao consultar CoinGecko:', erro);

          setErroApi('Não foi possível consultar os preços reais.');
          setMoedas(moedasDemo);
          setModoDemo(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarMoedas();

    return () => controller.abort();
  }, []);

  // Adiciona ou remove uma moeda dos favoritos.
  const handleFavorito = (moedaId) => {
    const novosFavoritos = alternarFavorito(moedaId);
    setFavoritos(novosFavoritos);
  };

  // Aplica pesquisa, filtros e ordenação.
  const moedasFiltradas = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();

    return moedas
      .filter((moeda) => {
        const correspondePesquisa =
          moeda.nome.toLowerCase().includes(termo) ||
          moeda.simbolo.toLowerCase().includes(termo);

        const variacao = moeda.variacao ?? 0;

        const correspondeFiltro =
          filtro === 'todas' ||
          (filtro === 'alta' && variacao > 0) ||
          (filtro === 'baixa' && variacao < 0);

        const correspondeFavoritos =
          !somenteFavoritos || favoritos.includes(moeda.id);

        return (
          correspondePesquisa &&
          correspondeFiltro &&
          correspondeFavoritos
        );
      })
      .sort((a, b) => {
        if (ordenacao === 'nome') {
          return a.nome.localeCompare(b.nome);
        }

        if (ordenacao === 'preco') {
          return (b.preco ?? 0) - (a.preco ?? 0);
        }

        if (ordenacao === 'variacao') {
          return (b.variacao ?? 0) - (a.variacao ?? 0);
        }

        return (b.mercado ?? 0) - (a.mercado ?? 0);
      });
  }, [
    moedas,
    pesquisa,
    filtro,
    ordenacao,
    favoritos,
    somenteFavoritos
  ]);

  return (
    <>
      <NavBar />

      <main className="criptoativos-page">
        <div className="criptoativos-container">

          <span className="criptoativos-label">
            MERCADO DE CRIPTOMOEDAS
          </span>

          <h1>Explore os Criptoativos</h1>

          <p>
            Conheça os principais ativos digitais, pesquise moedas,
            acompanhe o mercado e salve suas criptomoedas favoritas.
          </p>

          {/* Status da API */}
          <div className="criptoativos-notice" role="status">
            {carregando ? (
              <span>Consultando preços na CoinGecko...</span>
            ) : modoDemo ? (
              <span>
                <strong>Modo demonstração:</strong> os preços,
                variações e valores de mercado da tabela são fictícios.
                {erroApi && ` ${erroApi}`}
              </span>
            ) : (
              <span>
                <strong>Dados de mercado:</strong> informações obtidas
                da CoinGecko. As cotações podem apresentar atraso.
              </span>
            )}
          </div>

          {/* Mercado de criptomoedas */}
          <section
            className="crypto-market"
            aria-label="Tabela de criptomoedas"
          >

            {/* Cabeçalho com contador de favoritos */}
            <div className="crypto-market-header">
              <div>
                <h2>Visão geral do mercado</h2>

                <span>
                  {moedasFiltradas.length} criptomoeda(s) encontrada(s)
                </span>
              </div>

              <div className="crypto-favorites-counter">
                <span aria-hidden="true">★</span>
                <span>{favoritos.length} favorito(s)</span>
              </div>
            </div>

            {/* Pesquisa e ordenação */}
            <div className="crypto-market-filters">
              <input
                type="search"
                placeholder="Pesquisar Bitcoin, BTC, Ethereum..."
                aria-label="Pesquisar criptomoedas"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
              />

              <select
                aria-label="Filtrar por variação"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              >
                <option value="todas">Todas as moedas</option>
                <option value="alta">Em alta</option>
                <option value="baixa">Em baixa</option>
              </select>

              <select
                aria-label="Ordenar criptomoedas"
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value)}
              >
                <option value="mercado">Maior valor de mercado</option>
                <option value="preco">Maior preço</option>
                <option value="variacao">Maior variação</option>
                <option value="nome">Nome (A-Z)</option>
              </select>
            </div>

            {/* Mostrar somente favoritos */}
            <div className="crypto-favorites-filter">
              <label className="crypto-favorites-label">
                <input
                  type="checkbox"
                  checked={somenteFavoritos}
                  onChange={(e) =>
                    setSomenteFavoritos(e.target.checked)
                  }
                />

                <span aria-hidden="true">★</span>
                Mostrar somente favoritos
              </label>
            </div>

            {/* Tabela */}
            <div className="crypto-market-table-wrapper">
              <table className="crypto-market-table">
                <thead>
                  <tr>
                    <th>Criptomoeda</th>
                    <th>Preço (USD)</th>
                    <th>Variação (24h)</th>
                    <th>Valor de mercado</th>
                  </tr>
                </thead>

                <tbody>
                  {moedasFiltradas.map((moeda) => {
                    const variacao = moeda.variacao ?? 0;
                    const ehFavorita = favoritos.includes(moeda.id);

                    return (
                      <tr key={moeda.id}>
                        <td>
                          <div className="crypto-coin">

                            {/* Ícone da criptomoeda */}
                            {modoDemo || !moeda.imagem ? (
                              <span
                                className="crypto-coin-icon"
                                style={{
                                  backgroundColor: moeda.cor || '#7c3aed'
                                }}
                              >
                                {moeda.icone || moeda.simbolo.charAt(0)}
                              </span>
                            ) : (
                              <img
                                src={moeda.imagem}
                                alt=""
                                width="42"
                                height="42"
                                style={{
                                  width: 42,
                                  height: 42,
                                  objectFit: 'contain',
                                  flexShrink: 0
                                }}
                              />
                            )}

                            {/* Nome e símbolo */}
                            <div>
                              <Link
                                to={`/Criptoativos/${moeda.id}`}
                                className="crypto-coin-link"
                              >
                                {moeda.nome}
                              </Link>

                              <small>{moeda.simbolo}</small>
                            </div>

                            {/* Estrela de favoritos */}
                            <button
                              type="button"
                              className={`crypto-favorite-btn ${
                                ehFavorita ? 'is-favorite' : ''
                              }`}
                              onClick={() => handleFavorito(moeda.id)}
                              aria-label={
                                ehFavorita
                                  ? `Remover ${moeda.nome} dos favoritos`
                                  : `Adicionar ${moeda.nome} aos favoritos`
                              }
                              aria-pressed={ehFavorita}
                              title={
                                ehFavorita
                                  ? 'Remover dos favoritos'
                                  : 'Adicionar aos favoritos'
                              }
                            >
                              {ehFavorita ? '★' : '☆'}
                            </button>

                          </div>
                        </td>

                        {/* Preço */}
                        <td>
                          {moeda.preco == null
                            ? 'Indisponível'
                            : formatarPreco(moeda.preco)}
                        </td>

                        {/* Variação em 24 horas */}
                        <td>
                          {moeda.variacao == null ? (
                            <span>Indisponível</span>
                          ) : (
                            <span
                              className={
                                variacao >= 0
                                  ? 'crypto-positive'
                                  : 'crypto-negative'
                              }
                            >
                              {variacao > 0 ? '+' : ''}
                              {variacao.toFixed(2)}%
                            </span>
                          )}
                        </td>

                        {/* Valor de mercado */}
                        <td>
                          {moeda.mercado == null
                            ? 'Indisponível'
                            : formatarMercado(
                                moeda.mercado,
                                modoDemo
                              )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Nenhum resultado */}
              {moedasFiltradas.length === 0 && (
                <p className="crypto-empty">
                  {somenteFavoritos
                    ? 'Nenhuma criptomoeda favorita encontrada.'
                    : 'Nenhuma criptomoeda encontrada.'}
                </p>
              )}
            </div>
          </section>

          {/* Gráfico histórico */}
          <GraficoCripto />

        </div>
      </main>

      <Footer />
    </>
  );
}

