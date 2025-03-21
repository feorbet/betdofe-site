import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Container = styled.div`
  padding: 20px;
  background-color: #1a1a1a;
  min-height: 100vh;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const SummaryContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
`;

const SummaryItem = styled.div`
  text-align: center;
`;

const SummaryLabel = styled.p`
  font-size: 1.2rem;
  color: #ccc;
`;

const SummaryValue = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
`;

const ChartContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
`;

const NavigationContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007AFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #005BB5;
  }
`;

const BackButton = styled.button`
  background-color: #6c757d;
  border-radius: 12px;
  padding: 10px;
  margin: 40px 0 20px 0; /* Aumentado o margin-top para 40px */
  align-items: center;
  text-align: center;
  cursor: pointer;
  border: none;
`;

const ButtonText = styled.span`
  color: white;
  font-size: 1rem;
  font-weight: bold;
`;

const ResumoMensal = () => {
  const navigate = useNavigate();
  const [transacoes, setTransacoes] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchTransacoes = async () => {
      try {
        const transacoesCollection = collection(db, 'transacoes');
        const transacoesSnapshot = await getDocs(transacoesCollection);
        const transacoesList = transacoesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransacoes(transacoesList);
      } catch (err) {
        console.error('Erro ao carregar transações:', err);
      }
    };

    fetchTransacoes();
  }, []);

  const getMonthTransacoes = () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    return transacoes.filter(transacao => {
      const transacaoDate = new Date(transacao.data);
      return transacaoDate >= startOfMonth && transacaoDate <= endOfMonth;
    });
  };

  const calculateSummary = () => {
    const monthTransacoes = getMonthTransacoes();
    const totalInvestido = monthTransacoes.reduce((sum, transacao) => sum + transacao.valorInvestido, 0);
    const totalGanhos = monthTransacoes.reduce((sum, transacao) => sum + transacao.valorGanho, 0);
    const saldo = totalGanhos - totalInvestido;

    return { totalInvestido, totalGanhos, saldo };
  };

  const { totalInvestido, totalGanhos, saldo } = calculateSummary();

  const chartData = {
    labels: ['Ganhos', 'Investido'],
    datasets: [
      {
        data: [totalGanhos, totalInvestido],
        backgroundColor: ['#28a745', '#dc3545'],
        hoverBackgroundColor: ['#218838', '#c82333'],
      },
    ],
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <Container>
      <Title>Resumo Mensal - {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</Title>
      <SummaryContainer>
        <SummaryItem>
          <SummaryLabel>Ganhos</SummaryLabel>
          <SummaryValue style={{ color: '#28a745' }}>R$ {totalGanhos.toFixed(2)}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Investido</SummaryLabel>
          <SummaryValue style={{ color: '#dc3545' }}>R$ {totalInvestido.toFixed(2)}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Saldo</SummaryLabel>
          <SummaryValue style={{ color: saldo >= 0 ? '#28a745' : '#dc3545' }}>
            R$ {saldo.toFixed(2)}
          </SummaryValue>
        </SummaryItem>
      </SummaryContainer>
      <ChartContainer>
        <Pie data={chartData} />
      </ChartContainer>
      <NavigationContainer>
        <Button onClick={handlePreviousMonth}>Mês Anterior</Button>
        <Button onClick={handleNextMonth}>Próximo Mês</Button>
      </NavigationContainer>
      <BackButton onClick={() => navigate('/app')}>
        <ButtonText>Voltar</ButtonText>
      </BackButton>
    </Container>
  );
};

export default ResumoMensal;