
import '../../styles/Container.scss';
import React, { useState } from 'react';
import { Card, Button, Modal, Row, Col } from 'react-bootstrap';

import {
  FaRocket,
  FaMoneyBillWave,
  FaLock,
  FaUsers,
  FaWallet,
  FaCoins,
  FaShieldAlt,
  FaChartLine,
  FaBookOpen,
  FaGraduationCap
} from 'react-icons/fa';

export default function Main() {
  const bitCoin = '../../img/bitcoin.png';
  const ether = '../../img/Ethereum.png';
  const liteCoin = '../../img/litecoin.png';



    // Estado para controlar a visibilidade dos modais
    const [showBitcoin, setShowBitcoin] = useState(false);
    const [showEthereum, setShowEthereum] = useState(false);
    const [showLitecoin, setShowLitecoin] = useState(false);

    return (
      <>
        {/* sessão 2 */}
        <section className="coins-info" id="crypto-info">
          <h2>Principais Criptomoedas</h2>
          <div className="cards-container">
            {/* Cartão Bitcoin */}
            <Card style={{ width: "19rem" }}>
              <Card.Img
                variant="top"
                style={{ width: 80, height: 80 }}
                src={bitCoin}
                className="coin-img"
              />
              <Card.Body>
                <Card.Title>Bitcoin (BTC)</Card.Title>
                <Card.Text>A primeira e mais conhecida criptomoeda.</Card.Text>
                <Button
                  className="btn-infosCrypto"
                  onClick={() => setShowBitcoin(true)}
                >
                  Saiba Mais sobre Bitcoin
                </Button>
              </Card.Body>
            </Card>

            {/* Cartão Ethereum */}
            <Card style={{ width: "19rem" }}>
              <Card.Img
                variant="top"
                style={{ width: 80, height: 80 }}
                src={ether}
                className="coin-img"
              />
              <Card.Body>
                <Card.Title>Ethereum (ETH)</Card.Title>
                <Card.Text>
                  Plataforma de contratos inteligentes e finanças
                  descentralizadas.
                </Card.Text>
                <Button
                  className="btn-infosCrypto"
                  onClick={() => setShowEthereum(true)}
                >
                  Saiba Mais sobre Ethereum
                </Button>
              </Card.Body>
            </Card>

            {/* Cartão Litecoin */}
            <Card style={{ width: "19rem" }}>
              <Card.Img
                variant="top"
                style={{ width: 80, height: 80 }}
                src={liteCoin}
                className="coin-img"
              />
              <Card.Body>
                <Card.Title>Litecoin (LTC)</Card.Title>
                <Card.Text>Uma versão mais rápida e leve do Bitcoin.</Card.Text>
                <Button
                  className="btn-infosCrypto"
                  onClick={() => setShowLitecoin(true)}
                >
                  Saiba Mais sobre Litecoin
                </Button>
              </Card.Body>
            </Card>
          </div>
          <a href="/Criptoativos" className="btn btn-primary mt-4">
  Ver todos os criptoativos
</a>
        </section>

        {/* Modal Bitcoin */}
        <Modal
          show={showBitcoin}
          onHide={() => setShowBitcoin(false)}
          className="modal-custom"
        >
          <Modal.Header closeButton>
            <Modal.Title>Mais sobre Bitcoin (BTC)</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Bitcoin é a primeira criptomoeda e a mais conhecida no mercado.
            Criada em 2009 por uma entidade desconhecida sob o pseudônimo de
            Satoshi Nakamoto, o Bitcoin permite transações diretas entre os
            usuários, sem a necessidade de intermediários.
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setShowBitcoin(false)} style={{ backgroundColor: "#811dc3", borderColor: "#811dc3" }}> 
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Ethereum */}
        <Modal
          show={showEthereum}
          onHide={() => setShowEthereum(false)}
          className="modal-custom"
        >
          <Modal.Header closeButton>
            <Modal.Title>Mais sobre Ethereum (ETH)</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Ethereum é uma plataforma que permite a criação de contratos
            inteligentes e aplicativos descentralizados (dApps). Lançada em
            2015, é a segunda maior criptomoeda em termos de capitalização de
            mercado.
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setShowEthereum(false)}  style={{ backgroundColor: "#811dc3", borderColor: "#811dc3" }}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Litecoin */}
        <Modal
          show={showLitecoin}
          onHide={() => setShowLitecoin(false)}
          className="modal-custom"
        >
          <Modal.Header closeButton>
            <Modal.Title>Mais sobre Litecoin (LTC)</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Litecoin é uma criptomoeda criada em 2011 como uma versão mais leve
            e rápida do Bitcoin. Com confirmações de transação mais rápidas e
            taxas menores, o Litecoin é frequentemente usado para transações
            diárias.
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setShowLitecoin(false)}  style={{ backgroundColor: "#811dc3", borderColor: "#811dc3" }}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>

        <section className="crypto-advantages" id="coins-info">
          <h2 className="text-center mb-4">Vantagens das Criptomoedas</h2>
          <Row className="g-4 justify-content-center">
            <Col xs={12} md={3} className="d-flex justify-content-center mb-3">
              <Card className="w-100">
                <Card.Body className="text-center">
                  <FaRocket size={40} className="mb-3" />
                  <Card.Title>Transações Rápidas e Globais</Card.Title>
                  <Card.Text>
                    "Envie e receba pagamentos em qualquer lugar do mundo em
                    minutos."
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={3} className="d-flex justify-content-center mb-3">
              <Card className="w-100">
                <Card.Body className="text-center">
                  <FaMoneyBillWave size={40} className="mb-3" />
                  <Card.Title>Baixas Taxas</Card.Title>
                  <Card.Text>
                    "Economize com taxas mais baixas em comparação com bancos
                    tradicionais."
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={3} className="d-flex justify-content-center mb-4">
              <Card className="w-100">
                <Card.Body className="text-center">
                  <FaLock size={40} className="mb-3" />
                  <Card.Title>Segurança com Blockchain</Card.Title>
                  <Card.Text>
                    "A tecnologia de blockchain garante transparência e
                    segurança nas transações."
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={3} className="d-flex justify-content-center mb-3">
              <Card className="w-100">
                <Card.Body className="text-center">
                  <FaUsers size={40} className="mb-3" />
                  <Card.Title>Descentralização</Card.Title>
                  <Card.Text>
                    "Sem intermediários, você controla seus próprios ativos."
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        <section className="start-now-crypto" id="start-now">
          <h2>Como Começar com Criptomoedas</h2>
          <Row className="g-5 mt-4 justify-content-center">
            <Col xs={12} md={3} className="d-flex justify-content-center">
              <Card className="w-100">
                <Card.Body>
                  <FaWallet className="mb-3" size={40} />
                  <Card.Title>Passo 1: Crie uma Carteira Digital</Card.Title>
                  <Card.Text>
                    "Escolha uma carteira segura para armazenar suas
                    criptomoedas."
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={3} className="d-flex justify-content-center">
              <Card className="w-100">
                <Card.Body>
                  <FaCoins className="mb-3" size={40} />
                  <Card.Title>Passo 2: Compre Criptomoedas</Card.Title>
                  <Card.Text>
                    "Use nossa plataforma para comprar suas primeiras moedas."
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={3} className="d-flex justify-content-center">
              <Card className="w-100">
                <Card.Body>
                  <FaShieldAlt className="mb-3" size={40} />
                  <Card.Title>Passo 3: Invista com Segurança</Card.Title>
                  <Card.Text>
                    "Diversifique seu portfólio e explore o mundo das finanças
                    descentralizadas."
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={3} className="d-flex justify-content-center">
              <Card className="w-100">
                <Card.Body>
                  <FaChartLine className="mb-3" size={40} />
                  <Card.Title>Passo 4: Monitore Seus Investimentos</Card.Title>
                  <Card.Text>
                    "Acompanhe o desempenho de suas criptomoedas e ajuste suas
                    estratégias."
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        <div className="container-fluid">
          {" "}
          {/* Altera para container-fluid para ocupar toda a tela */}
          <section className="investment-tips-section">
            <h2 className="investment-tips-title">
              Dicas para Investidores Iniciantes
            </h2>
            <ul className="investment-tips-list">
              <li className="investment-tip-item">
                <i className="bi bi-check-circle"></i> Pesquise antes de
                investir: entenda no que você está investindo.
              </li>
              <li className="investment-tip-item">
                <i className="bi bi-check-circle"></i> Nunca invista mais do que
                você pode perder.
              </li>
              <li className="investment-tip-item">
                <i className="bi bi-check-circle"></i> Diversifique suas
                criptomoedas para reduzir riscos.
              </li>
              <li className="investment-tip-item">
                <i className="bi bi-check-circle"></i> Use carteiras seguras
                para armazenar suas criptomoedas.
              </li>
              <li className="investment-tip-item">
                <i className="bi bi-check-circle"></i> Mantenha-se informado
                sobre as notícias do mercado.
              </li>
              <li className="investment-tip-item">
                <i className="bi bi-check-circle"></i> Evite seguir a manada;
                faça sua própria pesquisa.
              </li>
              <li className="investment-tip-item">
                <i className="bi bi-check-circle"></i> Tenha paciência e não se
                deixe levar pela volatilidade do mercado.
              </li>
            </ul>
          </section>
        </div>

        
        {/* Seção final - Aprenda, Explore e Evolua */}
        <section className="crypto-learning" id="crypto-learning">
          <div className="crypto-learning-header">
            <span className="crypto-learning-label">
              SUA JORNADA COMEÇA AQUI
            </span>

            <h2>Aprenda, Explore e Evolua</h2>

            <p>
              Descubra o universo das criptomoedas, desenvolva seus
              conhecimentos e explore o mercado em um ambiente educativo.
            </p>
          </div>

          <div className="crypto-learning-grid">
            {/* Card 1 - Aprenda */}
            <article className="crypto-learning-card">
              <div className="crypto-learning-icon">
                <FaBookOpen />
              </div>

              <h3>Aprenda</h3>

              <p>
                Conheça os fundamentos das criptomoedas, a tecnologia
                blockchain e os principais conceitos do mercado digital.
              </p>
            </article>

            {/* Card 2 - Explore */}
            <article className="crypto-learning-card">
              <div className="crypto-learning-icon">
                <FaChartLine />
              </div>

              <h3>Explore</h3>

              <p>
                Entenda como o mercado funciona, acompanhe tendências
                e conheça diferentes ativos digitais.
              </p>
            </article>

            {/* Card 3 - Evolua */}
            <article className="crypto-learning-card">
              <div className="crypto-learning-icon">
                <FaGraduationCap />
              </div>

              <h3>Evolua</h3>

              <p>
                Desenvolva seus conhecimentos financeiros e aprenda
                sobre segurança, riscos e simulações de investimentos.
              </p>
            </article>
          </div>

          <p className="crypto-learning-disclaimer">
            Conteúdo exclusivamente educativo. Não constitui
            recomendação de investimento.
          </p>
        </section>
      </>
    );
}
 