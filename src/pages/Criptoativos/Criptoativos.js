
import React, { useMemo, useState } from 'react';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import './Criptoativos.scss';
import GraficoCripto from './GraficoCripto';

// Valores fictícios para demonstração.
// Não representam cotações reais.
const moedas = [
  { id: 1, nome: 'Bitcoin', simbolo: 'BTC', icone: '₿', cor: '#f7931a', preco: 65000, variacao: 2.5, mercado: 1280 },
  { id: 2, nome: 'Ethereum', simbolo: 'ETH', icone: 'Ξ', cor: '#627eea', preco: 3200, variacao: 1.8, mercado: 385 },
  { id: 3, nome: 'Litecoin', simbolo: 'LTC', icone: 'Ł', cor: '#345d9d', preco: 85, variacao: -0.7, mercado: 6.4 },
  { id: 4, nome: 'Solana', simbolo: 'SOL', icone: '◎', cor: '#9945ff', preco: 145, variacao: 4.2, mercado: 67 },
  { id: 5, nome: 'Cardano', simbolo: 'ADA', icone: '₳', cor: '#3468d1', preco: 0.45, variacao: -1.3, mercado: 16 },
  { id: 6, nome: 'Dogecoin', simbolo: 'DOGE', icone: 'Ð', cor: '#c2a633', preco: 0.12, variacao: 3.1, mercado: 17 }
];

const formatarPreco = (valor) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: valor < 1 ? 4 : 2
  }).format(valor);

export default function Criptoativos() {
  const [pesquisa, setPesquisa] = useState('');
  const [filtro, setFiltro] = useState('todas');
  const [ordenacao, setOrdenacao] = useState('mercado');

  const moedasFiltradas = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();

    return moedas
      .filter((moeda) => {
        const correspondePesquisa =
          moeda.nome.toLowerCase().includes(termo) ||
          moeda.simbolo.toLowerCase().includes(termo);

        const correspondeFiltro =
          filtro === 'todas' ||
          (filtro === 'alta' && moeda.variacao > 0) ||
          (filtro === 'baixa' && moeda.variacao < 0);

        return correspondePesquisa && correspondeFiltro;
      })
      .sort((a, b) => {
        if (ordenacao === 'nome') {
          return a.nome.localeCompare(b.nome);
        }

        if (ordenacao === 'preco') {
          return b.preco - a.preco;
        }

        if (ordenacao === 'variacao') {
          return b.variacao - a.variacao;
        }

        return b.mercado - a.mercado;
      });
  }, [pesquisa, filtro, ordenacao]);

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
            Conheça os principais ativos digitais, pesquise moedas
            e explore informações em um ambiente educativo.
          </p>

          <div className="criptoativos-notice">
            <strong>Modo demonstração:</strong> todos os preços,
            variações e valores de mercado são fictícios.
          </div>

          <section className="crypto-market" aria-label="Tabela de criptomoedas">
            <div className="crypto-market-header">
              <div>
                <h2>Visão geral do mercado</h2>
                <span>
                  {moedasFiltradas.length} criptomoeda(s) encontrada(s)
                </span>
              </div>
            </div>

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

            <div className="crypto-market-table-wrapper">
              <table className="crypto-market-table">
                <thead>
                  <tr>
                    <th>Criptomoeda</th>
                    <th>Preço demonstrativo</th>
                    <th>Variação ilustrativa</th>
                    <th>Valor de mercado ilustrativo</th>
                  </tr>
                </thead>

                <tbody>
                  {moedasFiltradas.map((moeda) => (
                    <tr key={moeda.id}>
                      <td>
                        <div className="crypto-coin">
                          <span
                            className="crypto-coin-icon"
                            style={{ backgroundColor: moeda.cor }}
                          >
                            {moeda.icone}
                          </span>

                          <div>
                            <strong>{moeda.nome}</strong>
                            <small>{moeda.simbolo}</small>
                          </div>
                        </div>
                      </td>

                      <td>{formatarPreco(moeda.preco)}</td>

                      <td>
                        <span
                          className={
                            moeda.variacao >= 0
                              ? 'crypto-positive'
                              : 'crypto-negative'
                          }
                        >
                          {moeda.variacao > 0 ? '+' : ''}
                          {moeda.variacao.toFixed(2)}%
                        </span>
                      </td>

                      <td>
                        US$ {moeda.mercado.toLocaleString('pt-BR')} bi
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {moedasFiltradas.length === 0 && (
                <p className="crypto-empty">
                  Nenhuma criptomoeda encontrada.
                </p>
              )}
            </div>
          </section>
          <GraficoCripto />
        </div>
      </main>

      <Footer />
    </>
  );
}
