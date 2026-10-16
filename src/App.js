
import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

import Home from './pages/Home/home';
import Cadastro from './pages/auth/cadastro';
import Login from './pages/auth/login';
import Planos from './pages/Planos/Planos';
import Criptoativos from './pages/Criptoativos/Criptoativos';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;

