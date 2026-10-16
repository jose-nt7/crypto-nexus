
import React, { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

import { buscarHistoricoCripto } from '../../services/cryptoApi';

const criptomoedas = {
  bitcoin: 'Bitcoin (BTC)',
  ethereum: 'Ethereum (ETH)',
  litecoin: 'Litecoin (LTC)',
  solana: 'Solana (SOL)',
  cardano: 'Cardano (ADA)',
  dogecoin: 'Dogecoin (DOGE)'
};

const formatarPreco = (valor) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: valor < 1 ? 4 : 2
  }).format(valor);

const formatarData = (timestamp, periodo) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    ...(periodo === 7 ? { hour: '2-digit', minute: '2-digit' } : {}),
    timeZone: 'UTC'
  }).format(new Date(timestamp));

export default function GraficoCripto({ moedaInicial = 'bitcoin' }) {
  const [moeda, setMoeda] = useState(moedaInicial);
  const [periodo, setPeriodo] = useState(7);
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
  setMoeda(moedaInicial);
}, [moedaInicial]);
  useEffect(() => {
    const controller = new AbortController();

    async function carregarHistorico() {
      setCarregando(true);
      setErro('');
      setHistorico([]);

      try {
        const dados = await buscarHistoricoCripto(
          moeda,
          periodo,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setHistorico(dados);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Erro ao carregar histórico:', error);

          setErro(
            'Não foi possível carregar o histórico desta criptomoeda.'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarHistorico();

    return () => controller.abort();
  }, [moeda, periodo]);

  const dadosGrafico = useMemo(
    () =>
      historico.map((item) => ({
        timestamp: item.timestamp,
        preco: item.preco
      })),
    [historico]
  );

  return (
    <section className="crypto-chart-section">
      <div className="crypto-chart-header">
        <div>
          <span className="crypto-chart-label">
            ANÁLISE DE MERCADO
          </span>

          <h2>Gráfico de Criptomoedas</h2>

          <p>
            Histórico de preços em USD fornecido pela CoinGecko.
          </p>
        </div>

        <div className="crypto-chart-controls">
          <select
            value={moeda}
            onChange={(event) => setMoeda(event.target.value)}
            aria-label="Selecionar criptomoeda"
          >
            {Object.entries(criptomoedas).map(([id, nome]) => (
              <option key={id} value={id}>
                {nome}
              </option>
            ))}
          </select>

          <select
            value={periodo}
            onChange={(event) =>
              setPeriodo(Number(event.target.value))
            }
            aria-label="Selecionar período do gráfico"
          >
            <option value={7}>Últimos 7 dias</option>
            <option value={30}>Últimos 30 dias</option>
          </select>
        </div>
      </div>

      {carregando ? (
        <div className="crypto-chart-message" role="status">
          Carregando histórico de preços...
        </div>
      ) : erro ? (
        <div className="crypto-chart-message" role="alert">
          <p>{erro}</p>
          <small>
            A API pode estar temporariamente indisponível
            ou ter atingido seu limite de requisições.
          </small>
        </div>
      ) : dadosGrafico.length === 0 ? (
        <div className="crypto-chart-message">
          Nenhum dado histórico disponível.
        </div>
      ) : (
        <div className="crypto-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={dadosGrafico}
              margin={{
                top: 15,
                right: 20,
                left: 10,
                bottom: 5
              }}
            >
              <defs>
                <linearGradient
                  id="cryptoChartGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#a78bfa"
                    stopOpacity={0.45}
                  />
                  <stop
                    offset="95%"
                    stopColor="#a78bfa"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#342b43"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                scale="time"
                stroke="#aaa0b9"
                tick={{ fontSize: 12 }}
                tickFormatter={(valor) =>
                  formatarData(valor, periodo)
                }
                minTickGap={30}
              />

              <YAxis
                stroke="#aaa0b9"
                tick={{ fontSize: 12 }}
                width={85}
                domain={['auto', 'auto']}
                tickFormatter={(valor) =>
                  `$${Number(valor).toLocaleString('pt-BR', {
                    maximumFractionDigits: 2
                  })}`
                }
              />

              <Tooltip
                labelFormatter={(valor) =>
                  new Intl.DateTimeFormat('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                  }).format(new Date(valor))
                }
                formatter={(valor) => [
                  formatarPreco(valor),
                  'Preço (USD)'
                ]}
                contentStyle={{
                  backgroundColor: '#15111f',
                  border: '1px solid #6d4d99',
                  borderRadius: '10px',
                  color: '#fff'
                }}
                labelStyle={{
                  color: '#c4b5fd'
                }}
              />

              <Area
                type="monotone"
                dataKey="preco"
                stroke="#a78bfa"
                strokeWidth={3}
                fill="url(#cryptoChartGradient)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: '#c4b5fd'
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <p className="crypto-chart-disclaimer">
        Histórico fornecido pela CoinGecko quando disponível.
        Os preços podem apresentar atraso. Este gráfico não
        representa uma recomendação de investimento.
      </p>
    </section>
  );
}
