import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import '../../styles/NavBar.scss'

export default function NavBar() {
    return (
        <>
<Navbar expand="lg" className="fixed-top navbar-custom">
    <Container fluid className="container-nav">
        <Navbar.Brand href="/">CryptoNexus</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" className="menu-toogle" />
        <Navbar.Collapse id="navbarScroll">
            <Nav
                className="me-auto my-0 my-lg-0"
                style={{ maxHeight: '200px' }}
                navbarScroll
            >
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/Planos">Nossos Planos</Nav.Link>
                <NavDropdown title="Criptoativos" id="navbarScrollingDropdown">
                    <NavDropdown.Item href="/Criptoativos"> Moedas & Tokens</NavDropdown.Item>
                    <NavDropdown.Item href="/Portfolio">Carteira de Criptomoedas</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/Investimentos">
                        Investimentos em Cripto
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/Simulador">
                        Simulador de Transações
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/Calculadora">
                        Calculadora de Taxas
                    </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/Blog">Blog & Notícias</Nav.Link>
                <Nav.Link href="/Contato">Contatos</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Container>
</Navbar>


        </>
    )
}