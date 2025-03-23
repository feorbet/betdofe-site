import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SobreNos from './pages/SobreNos';
import ProximosJogos from './pages/ProximosJogos';
import Aplicativos from './pages/Aplicativos';
import Cursos from './pages/Cursos';
import App from './bettingapp/App';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sobre-nos" element={<SobreNos />} />
      <Route path="/proximos-jogos" element={<ProximosJogos />} />
      <Route path="/aplicativos" element={<Aplicativos />} />
      <Route path="/cursos" element={<Cursos />} />
      <Route path="/app/*" element={<App />} />
    </Routes>
  );
};

export default AppRouter;