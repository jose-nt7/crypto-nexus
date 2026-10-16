
import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

// Dados fictícios utilizados apenas para demonstração.
const historicos = {
  BTC: [62000, 63500, 62800, 65000, 64200, 67000, 66500, 69000, 68000, 70500, 69500, 72000],
  ETH: [2900, 3050, 2980, 3200, 3150, 3350, 3280, 3450, 3380, 3600, 3520, 3750],
  LTC: [72, 75, 74, 79, 77, 82, 80, 85, 83, 88, 86, 91]
};

const nomes = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  LTC: 'Litecoin'
};

export default function GraficoCripto() {
  const [moeda, setMoeda] = useState('BTC');

  const dados = historicos[moeda].map((preco, index) => ({
    dia: `Dia ${index + 1}`,
    preco
  }));

  const formatarDolar = (valor) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(valor);

  return (
    <section className="crypto-chart-section">
      <div className="crypto-chart-header">
        <div>
          <span className="crypto-chart-label">
            ANÁLISE DE MERCADO
          </span>

          <h2>Gráfico de Criptomoedas</h2>

          <p>
            Explore a evolução ilustrativa dos preços.
          </p>
        </div>

        <select
          value={moeda}
          onChange={(event) => setMoeda(event.target.value)}
          aria-label="Selecionar criptomoeda do gráfico"
        >
          {Object.entries(nomes).map(([simbolo, nome]) => (
            <option key={simbolo} value={simbolo}>
              {nome} ({simbolo})
            </option>
          ))}
        </select>
      </div>

      <div className="crypto-chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={dados}
            margin={{ top: 15, right: 20, left: 10, bottom: 5 }}
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
              dataKey="dia"
              stroke="#aaa0b9"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              stroke="#aaa0b9"
              tick={{ fontSize: 12 }}
              width={80}
              tickFormatter={(valor) =>
                `$${valor.toLocaleString('pt-BR')}`
              }
              domain={['auto', 'auto']}
            />

            <Tooltip
              formatter={(valor) => [
                formatarDolar(valor),
                'Preço fictício'
              ]}
              contentStyle={{
                backgroundColor: '#15111f',
                border: '1px solid #6d4d99',
                borderRadius: '10px',
                color: '#fff'
              }}
              labelStyle={{ color: '#c4b5fd' }}
            />

            <Area
              type="monotone"
              dataKey="preco"
              stroke="#a78bfa"
              strokeWidth={3}
              fill="url(#cryptoChartGradient)"
              activeDot={{
                r: 6,
                fill: '#c4b5fd'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="crypto-chart-disclaimer">
        Dados fictícios para fins educativos. Este gráfico
        não representa preços históricos reais nem
        recomendações de investimento.
      </p>
    </section>
  );
}
