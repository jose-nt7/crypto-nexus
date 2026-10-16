
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { buscarCotacoesSimulador } from "../../services/cryptoApi";
import {
  obterTransacoes,
  calcularSaldos,
} from "../../utils/carteira";

import "./Dashboard.scss";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const MOEDAS = [
  { id: "bitcoin", nome: "Bitcoin", simbolo: "BTC" },
  { id: "ethereum", nome: "Ethereum", simbolo: "ETH" },
  { id: "litecoin", nome: "Litecoin", simbolo: "LTC" },
  { id: "solana", nome: "Solana", simbolo: "SOL" },
  { id: "cardano", nome: "Cardano", simbolo: "ADA" },
  { id: "dogecoin", nome: "Dogecoin", simbolo: "DOGE" },
];

const formatarBRL = (valor) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);

const formatarQuantidade = (valor) =>
  new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 8,
  }).format(valor);

export default function Dashboard() {
  const [cotacoes, setCotacoes] = useState([]);
  const [transacoes, setTransacoes] = useState(obterTransacoes);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    const controller = new AbortController();

    async function atualizarCotacoes() {
      try {
        const dados = await buscarCotacoesSimulador(
          controller.signal
        );

        if (!ativo) return;

        if (!Array.isArray(dados)) {
          throw new Error("Resposta de cotações inválida.");
        }

        setCotacoes(dados);
        setErro("");
      } catch (error) {
        if (!ativo || error.name === "AbortError") return;

        setErro(
          "Não foi possível atualizar as cotações. Tente novamente mais tarde."
        );
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    atualizarCotacoes();

    const intervalo = setInterval(atualizarCotacoes, 60000);

    return () => {
      ativo = false;
      controller.abort();
      clearInterval(intervalo);
    };
  }, []);

  useEffect(() => {
    const atualizarCarteira = () => {
      setTransacoes(obterTransacoes());
    };

    window.addEventListener("focus", atualizarCarteira);
    window.addEventListener("storage", atualizarCarteira);

    return () => {
      window.removeEventListener("focus", atualizarCarteira);
      window.removeEventListener("storage", atualizarCarteira);
    };
  }, []);

  const saldos = useMemo(
    () => calcularSaldos(transacoes),
    [transacoes]
  );

  const ativos = useMemo(() => {
    return MOEDAS.map((moeda) => {
      const quantidade = Math.max(0, saldos[moeda.id] || 0);

      const cotacao = cotacoes.find(
        (item) => item.id === moeda.id
      );

      const preco = cotacao?.preco ?? null;

      const valorAtual =
        Number.isFinite(preco) && preco > 0
          ? quantidade * preco
          : null;

      return {
        ...moeda,
        quantidade,
        preco,
        valorAtual,
      };
    }).filter((moeda) => moeda.quantidade > 0);
  }, [saldos, cotacoes]);

  const patrimonioDisponivel = ativos.every(
    (moeda) => moeda.valorAtual !== null
  );

  const patrimonio = ativos.reduce(
    (total, moeda) => total + (moeda.valorAtual || 0),
    0
  );
  
const CORES_GRAFICO = [
  "#a78bfa",
  "#60a5fa",
  "#fbbf24",
  "#34d399",
  "#fb7185",
  "#818cf8",
];

const dadosGrafico = ativos
  .filter(
    (moeda) =>
      moeda.valorAtual !== null &&
      moeda.valorAtual > 0
  )
  .map((moeda) => ({
    nome: moeda.nome,
    valor: moeda.valorAtual,
    porcentagem:
      patrimonio > 0
        ? (moeda.valorAtual / patrimonio) * 100
        : 0,
  }));

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <span className="dashboard-tag">
            PAINEL DE MERCADO
          </span>

          <h1>
            Crypto Nexus <span>Dashboard</span>
          </h1>

          <p>
            Acompanhe cotações de criptomoedas e visualize
            um resumo da sua carteira virtual em um único painel.
          </p>
        </header>

        {erro && (
          <p className="dashboard-error" role="alert">
            {erro}
          </p>
        )}

        <section className="dashboard-summary">
          <article className="dashboard-card">
            <span>Patrimônio virtual</span>

            <strong>
              {ativos.length === 0
                ? formatarBRL(0)
                : patrimonioDisponivel
                ? formatarBRL(patrimonio)
                : "Cotação indisponível"}
            </strong>

            <small>
              Valor estimado com base nas cotações disponíveis
            </small>
          </article>

          <article className="dashboard-card">
            <span>Criptoativos na carteira</span>

            <strong>{ativos.length}</strong>

            <small>Ativos com saldo fictício positivo</small>
          </article>

          <article className="dashboard-card">
            <span>Operações registradas</span>

            <strong>{transacoes.length}</strong>

            <small>Compras e vendas simuladas</small>
          </article>

          <article className="dashboard-card">
            <span>Criptomoedas monitoradas</span>

            <strong>{MOEDAS.length}</strong>

            <small>Ativos acompanhados pela plataforma</small>
          </article>
        </section>

        <div className="dashboard-grid">
          <section className="dashboard-panel">
            <div className="dashboard-section-header">
              <h2>Cotações do mercado</h2>

              <span>
                {carregando
                  ? "Carregando..."
                  : "Atualização a cada 60 segundos"}
              </span>
            </div>

            <div className="dashboard-market-list">
              {MOEDAS.map((moeda) => {
                const cotacao = cotacoes.find(
                  (item) => item.id === moeda.id
                );

                return (
                  <div
                    className="dashboard-market-item"
                    key={moeda.id}
                  >
                    <div>
                      <strong>{moeda.nome}</strong>
                      <small>{moeda.simbolo}</small>
                    </div>

                    <span>
                      {cotacao &&
                      Number.isFinite(cotacao.preco) &&
                      cotacao.preco > 0
                        ? formatarBRL(cotacao.preco)
                        : "Indisponível"}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-section-header">
              <h2>Minha carteira virtual</h2>

              <Link to="/Portfolio">
                Ver carteira
              </Link>
            </div>

            {ativos.length === 0 ? (
              <p className="dashboard-empty">
                Você ainda não possui criptoativos fictícios
                registrados na carteira.
              </p>
            ) : (
              <div className="dashboard-wallet-list">
                {ativos.map((moeda) => (
                  <div
                    className="dashboard-wallet-item"
                    key={moeda.id}
                  >
                    <div>
                      <strong>{moeda.nome}</strong>

                      <small>
                        {formatarQuantidade(moeda.quantidade)}{" "}
                        {moeda.simbolo}
                      </small>
                    </div>

                    <span>
                      {moeda.valorAtual !== null
                        ? formatarBRL(moeda.valorAtual)
                        : "Indisponível"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        
        {/* GRÁFICO DE DISTRIBUIÇÃO DA CARTEIRA */}
        <section className="dashboard-panel dashboard-chart-section">
          <div className="dashboard-section-header">
            <h2>Distribuição do patrimônio virtual</h2>
            <span>Participação por criptomoeda</span>
          </div>

          {dadosGrafico.length === 0 ? (
            <p className="dashboard-empty">
              {ativos.length > 0
                ? "Aguardando cotações para exibir a distribuição."
                : "Registre compras fictícias na Carteira Virtual para visualizar o gráfico."}
            </p>
          ) : (
            <div className="dashboard-chart-layout">
              <div className="dashboard-chart">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={dadosGrafico}
                      dataKey="valor"
                      nameKey="nome"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                    >
                      {dadosGrafico.map((item, index) => (
                        <Cell
                          key={item.nome}
                          fill={
                            CORES_GRAFICO[
                              index % CORES_GRAFICO.length
                            ]
                          }
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(valor) => formatarBRL(valor)}
                      contentStyle={{
                        background: "#151020",
                        border: "1px solid #39264e",
                        borderRadius: "10px",
                        color: "#ffffff",
                      }}
                      itemStyle={{ color: "#ffffff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="dashboard-chart-legend">
                {dadosGrafico.map((item, index) => (
                  <div
                    className="dashboard-chart-legend-item"
                    key={item.nome}
                  >
                    <span
                      className="dashboard-chart-color"
                      style={{
                        background:
                          CORES_GRAFICO[
                            index % CORES_GRAFICO.length
                          ],
                      }}
                    />

                    <div>
                      <strong>{item.nome}</strong>
                      <small>{formatarBRL(item.valor)}</small>
                    </div>

                    <strong>
                      {item.porcentagem.toFixed(2)}%
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* EXPLORAR FERRAMENTAS */}
        <section className="dashboard-panel dashboard-shortcuts">
          <h2>Explorar ferramentas</h2>

          <div className="dashboard-shortcuts-grid">
            <Link to="/Criptoativos">
              <strong>Criptoativos</strong>
              <span>Explore as criptomoedas disponíveis</span>
            </Link>

            <Link to="/Simulador">
              <strong>Simulador de Investimentos</strong>
              <span>Simule cenários com cotações reais</span>
            </Link>

            <Link to="/Portfolio">
              <strong>Carteira Virtual</strong>
              <span>Gerencie suas operações fictícias</span>
            </Link>

            <Link to="/Calculadora">
              <strong>Calculadora de Taxas</strong>
              <span>Simule custos de operações</span>
            </Link>
          </div>
        </section>

        {/* AVISO EDUCATIVO */}
        <p className="dashboard-disclaimer">
          Os preços são consultados na CoinGecko e podem
          apresentar atrasos ou indisponibilidade. A carteira
          e suas operações são exclusivamente educativas.
          Nenhuma criptomoeda real é armazenada ou negociada.
        </p>
      </div>
    </main>
  );
}

