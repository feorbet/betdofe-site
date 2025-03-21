import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import DatePicker from 'react-datepicker';

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

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const StyledDatePicker = styled(DatePicker)`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #2c2c2c;
  color: white;
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

const Table = styled.table`
  width: 100%;
  max-width: 800px;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const Th = styled.th`
  padding: 10px;
  background-color: #2c2c2c;
  border: 1px solid #444;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #444;
  text-align: center;
`;

const SummaryContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 600px;
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

const Transacoes = () => {
  const navigate = useNavigate();
  const [transacoes, setTransacoes] = useState([]);
  const [dataInicial, setDataInicial] = useState(null);
  const [dataFinal, setDataFinal] = useState(null);
  const [filteredTransacoes, setFilteredTransacoes] = useState([]);

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
        setFilteredTransacoes(transacoesList);
      } catch (err) {
        console.error('Erro ao carregar transações:', err);
      }
    };

    fetchTransacoes();
  }, []);

  const handleFilter = () => {
    if (!dataInicial || !dataFinal) {
      setFilteredTransacoes(transacoes);
      return;
    }

    const startDate = new Date(dataInicial);
    const endDate = new Date(dataFinal);

    const filtered = transacoes.filter(transacao => {
      const transacaoDate = new Date(transacao.data);
      return transacaoDate >= startDate && transacaoDate <= endDate;
    });

    setFilteredTransacoes(filtered);
  };

  const calculateTotals = () => {
    const totalInvestido = filteredTransacoes.reduce((sum, transacao) => sum + transacao.valorInvestido, 0);
    const totalGanhos = filteredTransacoes.reduce((sum, transacao) => sum + transacao.valorGanho, 0);
    const saldo = totalGanhos - totalInvestido;

    return { totalInvestido, totalGanhos, saldo };
  };

  const { totalInvestido, totalGanhos, saldo } = calculateTotals();

  return (
    <Container>
      <Title>Transações</Title>
      <FilterContainer>
        <StyledDatePicker
          selected={dataInicial}
          onChange={(date) => setDataInicial(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Data Inicial"
          onKeyDown={(e) => e.preventDefault()}
        />
        <StyledDatePicker
          selected={dataFinal}
          onChange={(date) => setDataFinal(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Data Final"
          onKeyDown={(e) => e.preventDefault()}
        />
        <Button onClick={handleFilter}>Pesquisar</Button>
      </FilterContainer>
      <Table>
        <thead>
          <tr>
            <Th>Casa de Aposta</Th>
            <Th>Investido</Th>
            <Th>Ganhos</Th>
            <Th>Saldo</Th>
            <Th>Data</Th>
            <Th>Nome da Conta</Th>
          </tr>
        </thead>
        <tbody>
          {filteredTransacoes.map((transacao) => {
            const saldoTransacao = transacao.valorGanho - transacao.valorInvestido;
            return (
              <tr key={transacao.id}>
                <Td>{transacao.casaAposta}</Td>
                <Td>R$ {transacao.valorInvestido.toFixed(2)}</Td>
                <Td>R$ {transacao.valorGanho.toFixed(2)}</Td>
                <Td style={{ color: saldoTransacao >= 0 ? '#28a745' : '#dc3545' }}>
                  R$ {saldoTransacao.toFixed(2)}
                </Td>
                <Td>{new Date(transacao.data).toLocaleDateString('pt-BR')}</Td>
                <Td>{transacao.nomeConta}</Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <SummaryContainer>
        <SummaryItem>
          <SummaryLabel>Total Investido</SummaryLabel>
          <SummaryValue style={{ color: '#dc3545' }}>R$ {totalInvestido.toFixed(2)}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Total Ganhos</SummaryLabel>
          <SummaryValue style={{ color: '#28a745' }}>R$ {totalGanhos.toFixed(2)}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Saldo Total</SummaryLabel>
          <SummaryValue style={{ color: saldo >= 0 ? '#28a745' : '#dc3545' }}>
            R$ {saldo.toFixed(2)}
          </SummaryValue>
        </SummaryItem>
      </SummaryContainer>
      <BackButton onClick={() => navigate('/app')}>
        <ButtonText>Voltar</ButtonText>
      </BackButton>
    </Container>
  );
};

export default Transacoes;