
import React from "react";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import "../../styles/Footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-brand">
          <h2 className="footer-title">
            Crypto<span>Nexus</span>
          </h2>

          <p className="footer-description">
            Explore o universo das criptomoedas, conheça
            a tecnologia blockchain e desenvolva seus
            conhecimentos em um ambiente educativo.
          </p>
        </div>

        <div className="footer-contact">
          <h3>Entre em contato</h3>

          <div className="footer-contact-item">
            <FaEnvelope />

            <a href="mailto:cryptonexusinvestimentos@gmail.com">
              cryptonexusinvestimentos@gmail.com
            </a>
          </div>

          <div className="footer-contact-item">
            <FaPhoneAlt />

            <div className="footer-phone-list">
              <span>+55 (81) 98993-6229</span>
              <span>+55 (81) 9763-2462</span>
              <span>+55 (81) 9395-3509</span>
              <span>+55 (81) 8534-8133</span>
            </div>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} CryptoNexus.
          Todos os direitos reservados.
        </p>

        <p>
          Plataforma educativa sobre criptomoedas.
        </p>
      </div>
    </footer>
  );
}

