import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserScreen from './components/UserScreen';
import RegisterUserScreen from './components/RegisterUserScreen';
import NovaTransacao from './components/NovaTransacao';
import ResumoMensal from './components/ResumoMensal';
import Transacoes from './components/Transacoes';
import ConsultaContasCadastradas from './components/ConsultaContasCadastradas';
import EditarConta from './components/EditarConta'; // Importe o componente EditarConta

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<UserScreen />} />
      <Route path="/register" element={<RegisterUserScreen />} />
      <Route path="/nova-transacao" element={<NovaTransacao />} />
      <Route path="/resumo-mensal" element={<ResumoMensal />} />
      <Route path="/transacoes" element={<Transacoes />} />
      <Route path="/consulta-contas" element={<ConsultaContasCadastradas />} />
      <Route path="/editar-conta/:id" element={<EditarConta />} /> {/* Adicionada a rota */}
    </Routes>
  );
};

export default App;