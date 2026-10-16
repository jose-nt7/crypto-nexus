import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import Main from '../../components/layout/Main';
import HeroCrypto from '../../components/layout/HeroCrypto';

export default function Home() {
  return (
    <>
      <NavBar />
      <HeroCrypto />
      <Main />
      <Footer />
    </>
  );
}