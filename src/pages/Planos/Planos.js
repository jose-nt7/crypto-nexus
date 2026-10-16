
import React from 'react';
import Navbar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import './Planos.css';

export default function Planos() {
  return (
    <>
      <Navbar />

      <main className="planos-page">
        <div className="planos-content">
          <header className="planos-header">
            <h1>Nossos Planos</h1>
            <p>
              Conheça as funcionalidades do Crypto Nexus
              e acompanhe a evolução da nossa plataforma.
            </p>
          </header>

          <section className="planos-card">
            <h2>Crypto Nexus</h2>

            <p>
              Estamos desenvolvendo novas ferramentas
              para acompanhar criptoativos e simular
              investimentos.
            </p>

            <p>
              Informações sobre planos e funcionalidades
              estarão disponíveis futuramente.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

