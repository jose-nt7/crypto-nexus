
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import { buscarDetalhesCripto } from '../../services/cryptoApi';
import GraficoCripto from './GraficoCripto';

import './Criptoativos.scss';

const formatarDolar = (valor) => {
  if (valor == null) return 'Indisponível';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: valor < 1 ? 4 : 2
  }).format(valor);
};

const formatarMercado = (valor) => {
  if (valor == null) return 'Indisponível';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2
  }).format(valor);
};

export default function DetalhesCripto() {
  const { id } = useParams();

  const [moeda, setMoeda] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function carregarDetalhes() {
      setCarregando(true);
      setErro('');
      setMoeda(null);

      try {
        const dados = await buscarDetalhesCripto(
          id,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setMoeda(dados);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Erro ao consultar detalhes:', error);
          setErro(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarDetalhes();

    return () => controller.abort();
  }, [id]);

  return (
    <>
      <NavBar />

      <main className="criptoativos-page">
        <div className="criptoativos-container">

          <span className="criptoativos-label">
            CRYPTO NEXUS | DETALHES
          </span>

          {carregando ? (
            <div className="criptoativos-notice" role="status">
              Carregando informações da criptomoeda...
            </div>
          ) : erro ? (
            <div className="criptoativos-notice" role="alert">
              <p>Não foi possível carregar os detalhes.</p>
              <small>{erro}</small>
            </div>
          ) : moeda ? (
            <>
              <div className="crypto-details-heading">
                {moeda.imagem && (
                  <img
                    src={moeda.imagem}
                    alt=""
                    width="70"
                    height="70"
                  />
                )}

                <div>
                  <h1>{moeda.nome}</h1>
                  <span>{moeda.simbolo}</span>
                </div>
              </div>

              <p>
                Informações de mercado fornecidas pela CoinGecko.
                As cotações podem apresentar atraso.
              </p>

              <div className="crypto-details-grid">
                <div className="crypto-details-card">
                  <span>Preço atual</span>
                  <strong>{formatarDolar(moeda.preco)}</strong>
                </div>

                <div className="crypto-details-card">
                  <span>Variação em 24 horas</span>
                  <strong
                    className={
                      moeda.variacao24h == null
                        ? ''
                        : moeda.variacao24h >= 0
                          ? 'crypto-positive'
                          : 'crypto-negative'
                    }
                  >
                    {moeda.variacao24h == null
                      ? 'Indisponível'
                      : `${moeda.variacao24h > 0 ? '+' : ''}${moeda.variacao24h.toFixed(2)}%`}
                  </strong>
                </div>

                <div className="crypto-details-card">
                  <span>Capitalização de mercado</span>
                  <strong>{formatarMercado(moeda.mercado)}</strong>
                </div>

                <div className="crypto-details-card">
                  <span>Volume em 24 horas</span>
                  <strong>{formatarMercado(moeda.volume24h)}</strong>
                </div>

                <div className="crypto-details-card">
                  <span>Máxima em 24 horas</span>
                  <strong>{formatarDolar(moeda.maxima24h)}</strong>
                </div>

                <div className="crypto-details-card">
                  <span>Mínima em 24 horas</span>
                  <strong>{formatarDolar(moeda.minima24h)}</strong>
                </div>
              </div>

              {moeda.ranking != null && (
                <p className="crypto-details-ranking">
                  Posição por capitalização de mercado: #{moeda.ranking}
                </p>
              )}
              <GraficoCripto moedaInicial={id} />
            </>
          ) : null}

          <Link
            to="/Criptoativos"
            className="btn btn-outline-light mt-4"
          >
            ← Voltar para Criptoativos
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
