import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SobreNos from './pages/SobreNos';
import ProximosJogos from './pages/ProximosJogos';
import Aplicativos from './pages/Aplicativos';
import Cursos from './pages/Cursos';
import BettingApp from './bettingapp/App';
import 'react-datepicker/dist/react-datepicker.css'; // Importe o CSS do react-datepicker

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre-nos" element={<SobreNos />} />
        <Route path="/proximos-jogos" element={<ProximosJogos />} />
        <Route path="/aplicativos" element={<Aplicativos />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/app/*" element={<BettingApp />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;