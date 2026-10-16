
import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

import Home from './pages/Home/home';
import Cadastro from './pages/auth/cadastro';
import Login from './pages/auth/login';
import Planos from './pages/Planos/Planos';
import Criptoativos from './pages/Criptoativos/Criptoativos';
import DetalhesCripto from './pages/Criptoativos/DetalhesCripto';
import Simulador from "./pages/Simulador/Simulador";
import Carteira from "./pages/Carteira/Carteira";
import Calculadora from "./pages/Calculadora/Calculadora";
import Dashboard from "./pages/Dashboard/Dashboard";


import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Cadastro" element={<Cadastro />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Planos" element={<Planos />} />
          <Route path="/Criptoativos" element={<Criptoativos />} />
          <Route path="/Criptoativos/:id" element={<DetalhesCripto />} />
          <Route path="/Simulador" element={<Simulador />} />
          <Route path="/Portfolio" element={<Carteira />} />
          <Route path="/Calculadora" element={<Calculadora />} />
          <Route path="/Dashboard" element={<Dashboard />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;

