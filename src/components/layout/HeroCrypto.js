
import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaShieldAlt, FaCoins } from 'react-icons/fa';
import '../../styles/HeroCrypto.scss';

const criptomoedas = [
  {
    id: 'bitcoin',
    nome: 'Bitcoin',
    simbolo: 'BTC',
    icone: '₿',
    classe: 'bitcoin',
  },
  {
    id: 'ethereum',
    nome: 'Ethereum',
    simbolo: 'ETH',
    icone: 'Ξ',
    classe: 'ethereum',
  },
  {
    id: 'litecoin',
    nome: 'Litecoin',
    simbolo: 'LTC',
    icone: 'Ł',
    classe: 'litecoin',
  },
];

export default function HeroCrypto() {
  return (
    <section className="crypto-hero">
      <div className="crypto-hero__content">
        <span className="crypto-hero__badge">
          O futuro das finanças digitais
        </span>

        <h1>
          Explore o futuro das
          <span> criptomoedas.</span>
        </h1>

        <p>
          Descubra o universo dos criptoativos, aprenda sobre
          blockchain e simule investimentos em uma plataforma
          criada para transformar conhecimento em experiência.
        </p>

        <div className="crypto-hero__actions">
          <Link
            to="/Cadastro"
            className="crypto-hero__primary"
          >
            Começar gratuitamente
          </Link>

          <Link
            to="/Criptoativos"
            className="crypto-hero__secondary"
          >
            Explorar criptomoedas
          </Link>
        </div>

        <div className="crypto-hero__features">
          <div>
            <FaChartLine />
            <span>Aprenda sobre o mercado</span>
          </div>

          <div>
            <FaShieldAlt />
            <span>Simulações educativas</span>
          </div>

          <div>
            <FaCoins />
            <span>Explore criptoativos</span>
          </div>
        </div>
      </div>

      <div className="crypto-hero__visual">
        <div className="crypto-hero__panel">
          <div className="crypto-hero__panel-header">
            <span>Crypto Nexus</span>

            <span className="crypto-hero__demo">
              DEMONSTRAÇÃO
            </span>
          </div>

          <h2 className="crypto-hero__panel-title">
            Visão geral dos criptoativos
          </h2>

          {criptomoedas.map((moeda) => (
            <div
              className="crypto-hero__coin"
              key={moeda.id}
            >
              <span
                className={`crypto-hero__symbol ${moeda.classe}`}
              >
                {moeda.icone}
              </span>

              <div>
                <strong>{moeda.nome}</strong>
                <small>{moeda.simbolo}</small>
              </div>

              <Link
                to="/Criptoativos"
                className="crypto-hero__tag"
                aria-label={`Explorar criptoativos, incluindo ${moeda.nome}`}
              >
                Explorar
              </Link>
            </div>
          ))}

          <p className="crypto-hero__disclaimer">
            
          </p>
        </div>
      </div>
    </section>
  );
}
