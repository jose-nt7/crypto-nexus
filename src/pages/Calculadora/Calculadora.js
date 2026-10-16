
import React, { useMemo, useState } from "react";
import "./Calculadora.scss";

const formatarBRL = (valor) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);

export default function Calculadora() {
  const [tipo, setTipo] = useState("compra");
  const [valor, setValor] = useState("1000");
  const [taxaPercentual, setTaxaPercentual] = useState("1.5");
  const [taxaFixa, setTaxaFixa] = useState("0");

  const resultado = useMemo(() => {
    const investimento = Number(valor);
    const percentual = Number(taxaPercentual);
    const fixa = Number(taxaFixa);

    const camposValidos =
      valor.trim() !== "" &&
      taxaPercentual.trim() !== "" &&
      taxaFixa.trim() !== "" &&
      Number.isFinite(investimento) &&
      Number.isFinite(percentual) &&
      Number.isFinite(fixa) &&
      investimento > 0 &&
      percentual >= 0 &&
      percentual <= 100 &&
      fixa >= 0;

    if (!camposValidos) return null;

    const custoPercentual = investimento * (percentual / 100);
    const custoTotal = custoPercentual + fixa;

    const valorFinal =
      tipo === "venda"
        ? investimento - custoTotal
        : investimento + custoTotal;

    return {
      investimento,
      custoPercentual,
      taxaFixa: fixa,
      custoTotal,
      valorFinal,
      percentual,
    };
  }, [tipo, valor, taxaPercentual, taxaFixa]);

  const rotulos = {
    compra: {
      titulo: "Compra de criptomoedas",
      descricao:
        "Calcule quanto seria necessário desembolsar para uma compra fictícia.",
      resultado: "Total desembolsado",
    },
    venda: {
      titulo: "Venda de criptomoedas",
      descricao:
        "Calcule quanto seria recebido após descontar as taxas simuladas.",
      resultado: "Valor líquido recebido",
    },
    transferencia: {
      titulo: "Transferência de criptomoedas",
      descricao:
        "Simule o custo de uma transferência com taxas configuráveis.",
      resultado: "Custo total incluindo taxas",
    },
  };

  return (
    <main className="calculadora-page">
      <div className="calculadora-container">
        <header className="calculadora-header">
          <span className="calculadora-tag">
            FERRAMENTA EDUCATIVA
          </span>

          <h1>
            Calculadora de <span>Taxas</span>
          </h1>

          <p>
            Simule os custos de operações com criptomoedas
            utilizando valores e taxas fictícias.
          </p>
        </header>

        <div className="calculadora-grid">
          <section className="calculadora-card">
            <h2>Configure sua operação</h2>

            <div className="calculadora-field">
              <label htmlFor="calculadora-tipo">
                Tipo de operação
              </label>

              <select
                id="calculadora-tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="compra">Compra</option>
                <option value="venda">Venda</option>
                <option value="transferencia">
                  Transferência
                </option>
              </select>
            </div>

            <div className="calculadora-field">
              <label htmlFor="calculadora-valor">
                Valor da operação (R$)
              </label>

              <input
                id="calculadora-valor"
                type="number"
                min="0.01"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ex.: 1000"
              />
            </div>

            <div className="calculadora-field">
              <label htmlFor="calculadora-percentual">
                Taxa percentual (%)
              </label>

              <input
                id="calculadora-percentual"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={taxaPercentual}
                onChange={(e) =>
                  setTaxaPercentual(e.target.value)
                }
                placeholder="Ex.: 1.5"
              />
            </div>

            <div className="calculadora-field">
              <label htmlFor="calculadora-fixa">
                Taxa fixa (R$)
              </label>

              <input
                id="calculadora-fixa"
                type="number"
                min="0"
                step="0.01"
                value={taxaFixa}
                onChange={(e) => setTaxaFixa(e.target.value)}
                placeholder="Ex.: 5"
              />
            </div>

            <div className="calculadora-info">
              <strong>{rotulos[tipo].titulo}</strong>
              <p>{rotulos[tipo].descricao}</p>
            </div>
          </section>

          <section className="calculadora-card calculadora-results">
            <h2>Resultado da simulação</h2>

            {resultado ? (
              <>
                <div className="calculadora-result-row">
                  <span>Valor da operação</span>
                  <strong>
                    {formatarBRL(resultado.investimento)}
                  </strong>
                </div>

                <div className="calculadora-result-row">
                  <span>Taxa percentual</span>
                  <strong>
                    {formatarBRL(resultado.custoPercentual)}
                  </strong>
                </div>

                <div className="calculadora-result-row">
                  <span>Taxa fixa</span>
                  <strong>
                    {formatarBRL(resultado.taxaFixa)}
                  </strong>
                </div>

                <div className="calculadora-result-row">
                  <span>Total de taxas</span>
                  <strong className="calculadora-fee">
                    {formatarBRL(resultado.custoTotal)}
                  </strong>
                </div>

                <div className="calculadora-highlight">
                  <span>{rotulos[tipo].resultado}</span>

                  <strong>
                    {formatarBRL(resultado.valorFinal)}
                  </strong>
                </div>

                {resultado.valorFinal < 0 && (
                  <p className="calculadora-warning" role="alert">
                    Atenção: as taxas simuladas ultrapassam
                    o valor da operação.
                  </p>
                )}
              </>
            ) : (
              <p className="calculadora-empty" role="status">
                Informe um valor maior que zero, uma taxa
                percentual entre 0% e 100% e uma taxa fixa
                igual ou maior que zero.
              </p>
            )}

            <p className="calculadora-disclaimer">
              Esta ferramenta é exclusivamente educativa.
              As taxas são informadas pelo usuário e não
              representam valores cobrados por corretoras
              ou redes blockchain. Impostos e variações
              de cotação não estão incluídos.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
