
import React, { useEffect, useMemo, useState } from "react";
import { buscarCotacoesSimulador } from "../../services/cryptoApi";
import {
  obterTransacoes,
  adicionarTransacao,
  removerTransacao,
  calcularSaldos,
} from "../../utils/carteira";
import "./Carteira.scss";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
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

export default function Carteira() {
  const [transacoes, setTransacoes] = useState(obterTransacoes);
  const [cotacoes, setCotacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCotacao, setErroCotacao] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [moedaId, setMoedaId] = useState("bitcoin");
  const [tipo, setTipo] = useState("compra");
  const [quantidade, setQuantidade] = useState("");

  useEffect(() => {
    let ativo = true;
    let controller = null;

    async function atualizarCotacoes() {
      if (controller) controller.abort();
      controller = new AbortController();

      try {
        const dados = await buscarCotacoesSimulador(
          controller.signal
        );

        if (!ativo) return;

        setCotacoes(dados);
        setErroCotacao("");
      } catch (error) {
        if (!ativo || error.name === "AbortError") return;

        setErroCotacao(
          "Não foi possível atualizar as cotações. " +
          "Os últimos preços recebidos serão mantidos, se disponíveis."
        );
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    atualizarCotacoes();

    const intervalo = setInterval(atualizarCotacoes, 60000);

    return () => {
      ativo = false;
      clearInterval(intervalo);
      if (controller) controller.abort();
    };
  }, []);

  const saldos = useMemo(
    () => calcularSaldos(transacoes),
    [transacoes]
  );

  const ativos = useMemo(() => {
    return MOEDAS.map((moeda) => {
      const saldo = Math.max(0, saldos[moeda.id] || 0);
      const cotacao = cotacoes.find(
        (item) => item.id === moeda.id
      );

      const preco = cotacao?.preco ?? null;

      return {
        ...moeda,
        saldo,
        preco,
        valorAtual:
          Number.isFinite(preco) && preco > 0
            ? saldo * preco
            : null,
      };
    }).filter((moeda) => moeda.saldo > 0);
  }, [saldos, cotacoes]);

  const patrimonioCompleto = ativos.every(
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


  const cotacaoSelecionada = cotacoes.find(
    (moeda) => moeda.id === moedaId
  );

  const precoSelecionado = cotacaoSelecionada?.preco;

  function registrarOperacao(event) {
    event.preventDefault();
    setMensagem("");

    if (
      !Number.isFinite(precoSelecionado) ||
      precoSelecionado <= 0
    ) {
      setMensagem("Cotação indisponível para esta moeda.");
      return;
    }

    try {
      const novasTransacoes = adicionarTransacao({
        moedaId,
        tipo,
        quantidade,
        precoUnitario: precoSelecionado,
      });

      setTransacoes(novasTransacoes);
      setQuantidade("");
      setMensagem(
        tipo === "compra"
          ? "Compra fictícia registrada com sucesso!"
          : "Venda fictícia registrada com sucesso!"
      );
    } catch (error) {
      setMensagem(error.message);
    }
  }

  function excluirOperacao(id) {
    if (
      !window.confirm(
        "Deseja excluir esta transação fictícia?"
      )
    ) {
      return;
    }

    try {
      const novasTransacoes = removerTransacao(id);
      setTransacoes(novasTransacoes);
      setMensagem("Transação excluída com sucesso.");
    } catch (error) {
      setMensagem(error.message);
    }
  }

  return (
    <main className="carteira-page">
      <div className="carteira-container">
        <header className="carteira-header">
          <span className="carteira-tag">
            CARTEIRA EDUCATIVA
          </span>

          <h1>
            Minha <span>Carteira Virtual</span>
          </h1>

          <p>
            Registre compras e vendas fictícias e acompanhe
            seus criptoativos utilizando cotações informativas.
          </p>
        </header>

        <div className="carteira-summary">
          <div className="carteira-summary-card">
            <span>Patrimônio virtual estimado</span>

            <strong>
              {carregando && cotacoes.length === 0
                ? "Carregando..."
                : patrimonioCompleto
                  ? formatarBRL(patrimonio)
                  : "Cotação indisponível"}
            </strong>

            <small>
              {patrimonioCompleto
                ? "Estimativa com base nas últimas cotações"
                : "Aguardando preços de todos os ativos"}
            </small>
          </div>

          <div className="carteira-summary-card">
            <span>Criptomoedas na carteira</span>
            <strong>{ativos.length}</strong>
            <small>Ativos com saldo positivo</small>
          </div>

          <div className="carteira-summary-card">
            <span>Operações fictícias</span>
            <strong>{transacoes.length}</strong>
            <small>Compras e vendas registradas</small>
          </div>
        </div>

        <div className="carteira-grid">
          <section className="carteira-card">
            <h2>Nova operação</h2>

            <form onSubmit={registrarOperacao}>
              <div className="carteira-field">
                <label htmlFor="carteira-moeda">
                  Criptomoeda
                </label>

                <select
                  id="carteira-moeda"
                  value={moedaId}
                  onChange={(e) => setMoedaId(e.target.value)}
                >
                  {MOEDAS.map((moeda) => (
                    <option key={moeda.id} value={moeda.id}>
                      {moeda.nome} ({moeda.simbolo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="carteira-field">
                <label htmlFor="carteira-tipo">
                  Tipo de operação
                </label>

                <select
                  id="carteira-tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="compra">Compra fictícia</option>
                  <option value="venda">Venda fictícia</option>
                </select>
              </div>

              <div className="carteira-field">
                <label htmlFor="carteira-quantidade">
                  Quantidade de criptomoeda
                </label>

                <input
                  id="carteira-quantidade"
                  type="number"
                  min="0"
                  step="any"
                  value={quantidade}
                  onChange={(e) =>
                    setQuantidade(e.target.value)
                  }
                  placeholder="Ex.: 0.005"
                  required
                />
              </div>

              <div className="carteira-price">
                <span>Cotação atual</span>
                <strong>
                  {Number.isFinite(precoSelecionado)
                    ? formatarBRL(precoSelecionado)
                    : "Indisponível"}
                </strong>
              </div>

              <button
                type="submit"
                className="carteira-submit"
                disabled={
                  !Number.isFinite(precoSelecionado) ||
                  precoSelecionado <= 0
                }
              >
                Registrar operação fictícia
              </button>
            </form>

            {mensagem && (
              <p className="carteira-message" role="status">
                {mensagem}
              </p>
            )}

            {erroCotacao && (
              <p className="carteira-error" role="alert">
                {erroCotacao}
              </p>
            )}
          </section>

          <section className="carteira-card">
            <h2>Meus criptoativos</h2>

            {ativos.length === 0 ? (
              <p className="carteira-empty">
                Sua carteira ainda está vazia.
                Registre uma compra fictícia para começar.
              </p>
            ) : (
              <div className="carteira-assets">
                {ativos.map((moeda) => (
                  <div
                    className="carteira-asset"
                    key={moeda.id}
                  >
                    <div>
                      <strong>{moeda.nome}</strong>
                      <small>
                        {formatarQuantidade(moeda.saldo)}{" "}
                        {moeda.simbolo}
                      </small>
                    </div>

                    <strong>
                      {moeda.valorAtual !== null
                        ? formatarBRL(moeda.valorAtual)
                        : "Indisponível"}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        
        {/* =====================================
            GRÁFICO DE DISTRIBUIÇÃO DA CARTEIRA
           ===================================== */}

        <section className="carteira-card carteira-chart-section">
          <h2>Distribuição da carteira</h2>

          {dadosGrafico.length === 0 ? (
            <p className="carteira-empty">
              {ativos.length > 0
                ? "Aguardando cotações para visualizar a distribuição dos criptoativos."
                : "Registre compras fictícias para visualizar a distribuição dos seus criptoativos."}
            </p>
          ) : (
            <>
              <div className="carteira-chart">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={dadosGrafico}
                      dataKey="valor"
                      nameKey="nome"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={105}
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
                        color: "#fff",
                      }}
                      itemStyle={{ color: "#fff" }}
                    />

                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="carteira-chart-legend">
                {dadosGrafico.map((item, index) => (
                  <div
                    className="carteira-chart-legend-item"
                    key={item.nome}
                  >
                    <span
                      className="carteira-chart-color"
                      style={{
                        background:
                          CORES_GRAFICO[
                            index % CORES_GRAFICO.length
                          ],
                      }}
                    />

                    <span>{item.nome}</span>

                    <strong>
                      {item.porcentagem.toFixed(2)}%
                    </strong>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* =====================================
            HISTÓRICO DE TRANSAÇÕES
           ===================================== */}

        <section className="carteira-card carteira-history">
          <h2>Histórico de transações</h2>

          {transacoes.length === 0 ? (
            <p className="carteira-empty">
              Nenhuma operação fictícia registrada.
            </p>
          ) : (
            <div className="carteira-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Criptomoeda</th>
                    <th>Operação</th>
                    <th>Quantidade</th>
                    <th>Valor registrado</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {[...transacoes].reverse().map((transacao) => {
                    const moeda = MOEDAS.find(
                      (item) => item.id === transacao.moedaId
                    );

                    return (
                      <tr key={transacao.id}>
                        <td>
                          {new Date(
                            transacao.data
                          ).toLocaleString("pt-BR")}
                        </td>

                        <td>
                          {moeda?.nome || transacao.moedaId}
                        </td>

                        <td>
                          {transacao.tipo === "compra"
                            ? "Compra"
                            : "Venda"}
                        </td>

                        <td>
                          {formatarQuantidade(
                            transacao.quantidade
                          )}
                        </td>

                        <td>
                          {formatarBRL(transacao.valorTotal)}
                        </td>

                        <td>
                          <button
                            type="button"
                            className="carteira-delete"
                            onClick={() =>
                              excluirOperacao(transacao.id)
                            }
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* AVISO EDUCATIVO */}

        <p className="carteira-disclaimer">
          Esta carteira é uma demonstração educativa.
          Não armazena criptomoedas reais, não realiza
          operações financeiras e mantém os registros
          apenas neste navegador.
        </p>
      </div>
    </main>
  );
}

