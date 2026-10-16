
import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaShieldAlt, FaCoins } from 'react-icons/fa';
import '../../styles/HeroCrypto.scss';

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
          <Link to="/Cadastro" className="crypto-hero__primary">
            Começar gratuitamente
          </Link>

          <a href="#crypto-info" className="crypto-hero__secondary">
            Explorar criptomoedas
          </a>
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

          <div className="crypto-hero__coin">
            <span className="crypto-hero__symbol bitcoin">₿</span>
            <div>
              <strong>Bitcoin</strong>
              <small>BTC</small>
            </div>
            <span className="crypto-hero__tag">Explorar</span>
          </div>

          <div className="crypto-hero__coin">
            <span className="crypto-hero__symbol ethereum">Ξ</span>
            <div>
              <strong>Ethereum</strong>
              <small>ETH</small>
            </div>
            <span className="crypto-hero__tag">Explorar</span>
          </div>

          <div className="crypto-hero__coin">
            <span className="crypto-hero__symbol litecoin">Ł</span>
            <div>
              <strong>Litecoin</strong>
              <small>LTC</small>
            </div>
            <span className="crypto-hero__tag">Explorar</span>
          </div>

          <p className="crypto-hero__disclaimer">
            Painel ilustrativo. Não representa cotações em tempo real.
          </p>
        </div>
      </div>
    </section>
  );
}
