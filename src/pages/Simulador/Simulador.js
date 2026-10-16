

import React, { useEffect, useMemo, useState } from "react";
import { buscarCotacoesSimulador } from "../../services/cryptoApi";
import "./Simulador.scss";

const criptomoedas = [
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

const formatarCripto = (valor) =>
  new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 8,
  }).format(valor);

export default function Simulador() {
  const [moedaId, setMoedaId] = useState("bitcoin");
  const [valor, setValor] = useState("1000");
  const [variacao, setVariacao] = useState(20);

  const [cotacoes, setCotacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState("");
  const [ultimaConsulta, setUltimaConsulta] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let ativo = true;
    let primeiraConsulta = true;

    async function atualizarCotacoes() {
      if (!ativo) return;

      if (primeiraConsulta) {
        setCarregando(true);
      } else {
        setAtualizando(true);
      }

      try {
        const dados = await buscarCotacoesSimulador(
          controller.signal
        );

        if (!ativo) return;

        setCotacoes(dados);
        setUltimaConsulta(new Date());
        setErro("");
      } catch (error) {
        if (!ativo || error.name === "AbortError") return;

        setErro(
          "Não foi possível atualizar as cotações da CoinGecko."
        );
      } finally {
        if (ativo) {
          setCarregando(false);
          setAtualizando(false);
          primeiraConsulta = false;
        }
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

  const moeda = criptomoedas.find(
    (item) => item.id === moedaId
  );

  const cotacao = cotacoes.find(
    (item) => item.id === moedaId
  );

  const preco = cotacao?.preco ?? null;
  const cotacaoDisponivel =
    Number.isFinite(preco) && preco > 0;

  const resultado = useMemo(() => {
    if (!cotacaoDisponivel) return null;

    const investimento = Math.max(0, Number(valor) || 0);
    const quantidade = investimento / preco;
    const valorFinal = investimento * (1 + variacao / 100);
    const diferenca = valorFinal - investimento;

    return {
      investimento,
      quantidade,
      valorFinal,
      diferenca,
    };
  }, [valor, preco, variacao, cotacaoDisponivel]);

  return (
    <main className="simulador-page">
      <div className="simulador-container">
        <header className="simulador-header">
          <span className="simulador-tag">
            SIMULAÇÃO EDUCATIVA
          </span>

          <h1>
            Simulador de <span>Investimentos</span>
          </h1>

          <p>
        Simule investimentos em criptomoedas utilizando
  cotações reais de mercado fornecidas pela API CoinGecko,
  com atualização automática a cada 60 segundos.
  Explore diferentes cenários de valorização e
  desvalorização sem utilizar dinheiro real.
          </p>
        </header>

        <div className="simulador-grid">
          <section className="simulador-card">
            <h2>Configure sua simulação</h2>

            <div className="simulador-field">
              <label htmlFor="simulador-moeda">
                Selecione a criptomoeda
              </label>

              <select
                id="simulador-moeda"
                value={moedaId}
                onChange={(e) => setMoedaId(e.target.value)}
              >
                {criptomoedas.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome} ({item.simbolo})
                  </option>
                ))}
              </select>
            </div>

            <div className="simulador-field">
              <label htmlFor="simulador-valor">
                Valor fictício do investimento (R$)
              </label>

              <input
                id="simulador-valor"
                type="number"
                min="0"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ex.: 1000"
              />
            </div>

            <div className="simulador-field">
              <label htmlFor="simulador-variacao">
                Variação hipotética do mercado
              </label>

              <div className="simulador-range-top">
                <span>Desvalorização / Valorização</span>
                <strong>
                  {variacao > 0 ? "+" : ""}
                  {variacao}%
                </strong>
              </div>

              <input
                id="simulador-variacao"
                type="range"
                min="-90"
                max="100"
                step="5"
                value={variacao}
                onChange={(e) =>
                  setVariacao(Number(e.target.value))
                }
              />
            </div>

            <div className="simulador-price-info">
              <span>
                Cotação de 1 {moeda.simbolo} em BRL
              </span>

              <strong>
                {cotacaoDisponivel
                  ? formatarBRL(preco)
                  : "Indisponível"}
              </strong>
            </div>

            {carregando && (
              <p className="simulador-notice">
                Consultando cotações da CoinGecko...
              </p>
            )}

            {atualizando && (
              <p className="simulador-notice">
                Atualizando cotações...
              </p>
            )}

            {erro && (
              <p
                className="simulador-notice"
                role="alert"
                style={{ color: "#fb7185" }}
              >
                {erro}
                {cotacoes.length > 0 &&
                  " Exibindo a última cotação recebida."}
              </p>
            )}

            {ultimaConsulta && (
              <p className="simulador-notice">
                Última consulta bem-sucedida:{" "}
                {ultimaConsulta.toLocaleTimeString("pt-BR")}
              </p>
            )}

            <p className="simulador-notice">
              Cotações informativas. Os valores podem variar
              e não representam uma oferta de compra ou venda.
            </p>
          </section>

          <section className="simulador-card simulador-results">
            <h2>Resultado da simulação</h2>

            {!resultado ? (
              <p className="simulador-notice">
                {carregando
                  ? "Aguardando as cotações para calcular..."
                  : "Não há cotação disponível para esta moeda."}
              </p>
            ) : (
              <>
                <div className="simulador-result-row">
                  <span>Investimento inicial</span>
                  <strong>
                    {formatarBRL(resultado.investimento)}
                  </strong>
                </div>

                <div className="simulador-result-row">
                  <span>
                    Quantidade estimada de {moeda.simbolo}
                  </span>
                  <strong>
                    {formatarCripto(resultado.quantidade)}{" "}
                    {moeda.simbolo}
                  </strong>
                </div>

                <div className="simulador-result-highlight">
                  <span>Valor final simulado</span>
                  <strong>
                    {formatarBRL(resultado.valorFinal)}
                  </strong>
                </div>

                <div className="simulador-result-row">
                  <span>Resultado hipotético</span>
                  <strong
                    className={
                      resultado.diferenca >= 0
                        ? "simulador-positive"
                        : "simulador-negative"
                    }
                  >
                    {resultado.diferenca > 0 ? "+" : ""}
                    {formatarBRL(resultado.diferenca)}
                  </strong>
                </div>

                <div className="simulador-result-row">
                  <span>Variação aplicada</span>
                  <strong>
                    {variacao > 0 ? "+" : ""}
                    {variacao}%
                  </strong>
                </div>
              </>
            )}

            <p className="simulador-disclaimer">
              Esta ferramenta é exclusivamente educativa.
              Os resultados são hipotéticos, não representam
              previsões de rendimento e não incluem taxas
              ou impostos.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

