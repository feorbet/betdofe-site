import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db, auth } from '../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button as MuiButton, Checkbox, FormControlLabel } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

import LogoSVG from '../../assets/logo.svg';
import YouTubeIcon from '../../assets/youtube-icon.png';
import DiscordIcon from '../../assets/discord-icon.png';
import InstagramIcon from '../../assets/instagram-icon.png';
import FacebookIcon from '../../assets/facebook-icon.png';
import TelegramIcon from '../../assets/telegram-icon.png';

dayjs.locale('pt-br');

ChartJS.register(ArcElement, Tooltip, Legend);

const GlobalStyle = styled.div`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #13281E;
  padding: 0;
  margin: 0;
  width: 100vw;
  overflow-x: hidden;
  position: relative;
`;

const Header = styled.header`
  width: 100%;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #005440;
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  z-index: 1;

  @media (max-width: 768px) {
    height: 120px;
  }

  @media (max-width: 480px) {
    height: 100px;
  }
`;

const Logo = styled.img`
  width: 500px;
  height: 244px;
  max-width: 100%;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 350px;
    height: 170px;
  }

  @media (max-width: 480px) {
    width: 250px;
    height: 122px;
  }
`;

const MiddleSection = styled.div`
  width: 100%;
  background-color: #005440;
  margin: 30px 0 0 0; /* Ajustado para centralizar verticalmente */
  padding: 15px;
  border: none;
  outline: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Centraliza verticalmente */
  min-height: 300px;
  z-index: 1;

  @media (max-width: 768px) {
    margin: 25px 0 0 0;
    padding: 10px;
    min-height: 250px;
  }

  @media (max-width: 480px) {
    margin: 20px 0 0 0;
    padding: 8px;
    min-height: 200px;
  }
`;

const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
`;

const MonthButton = styled.button`
  background: none;
  border: none;
  color: #CCCCCC;
  cursor: pointer;
  padding: 3px;

  &:disabled {
    color: #555555;
    cursor: not-allowed;
  }
`;

const MonthDisplay = styled.div`
  background-color: #333333;
  color: #CCCCCC;
  padding: 6px 12px;
  border-radius: 5px;
  font-size: 14px;
  min-width: 180px;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 12px;
    min-width: 140px;
  }
`;

const Summary = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: #333333;
  color: #CCCCCC;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  gap: 8px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 4px;
    padding: 8px;
  }
`;

const SummaryItem = styled.div`
  flex: 1;
  text-align: center;

  @media (max-width: 480px) {
    text-align: left;
  }
`;

const SummaryLabel = styled.p`
  font-size: 12px;
  margin: 0;
  font-weight: bold;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const SummaryValue = styled.p`
  font-size: 14px;
  margin: 3px 0 0 0;
  color: ${(props) => (props.isNegative ? '#FF5555' : '#55FF55')};

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const ChartContainer = styled.div`
  width: 100%;
  max-width: 250px;
  margin: 10px 0;
  background-color: #333333;
  padding: 10px;
  border-radius: 5px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  width: 100%;
  max-width: 400px;
  margin-top: 10px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const Button = styled.button`
  flex: 1;
  padding: 8px;
  background-color: #000000;
  color: #FFFFFF;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;

  &:disabled {
    background-color: #555555;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 6px;
    font-size: 10px;
  }
`;

const Error = styled.p`
  color: red;
  font-size: 10px;
  margin: 3px 0;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 8px;
  }
`;

const Footer = styled.footer`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: transparent;
  position: fixed;
  bottom: 0;
  z-index: 1;
`;

const FooterBackground = styled.div`
  width: 100%;
  height: 50px;
  background-color: #005440;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;

  @media (max-width: 768px) {
    height: 40px;
  }

  @media (max-width: 480px) {
    height: 30px;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
  margin-right: 15px;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    gap: 10px;
    margin-right: 10px;
  }
`;

const SocialIcon = styled.img`
  width: 25px;
  height: 25px;

  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
  }
`;

const ResumoMensal = () => {
  const navigate = useNavigate();
  const currentDate = dayjs('2025-03-23');
  const minDate = currentDate.subtract(12, 'month');
  const maxDate = currentDate;

  const [selectedMonth, setSelectedMonth] = useState(dayjs('2025-03-01'));
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [betHouses, setBetHouses] = useState([]);
  const [selectedBetHouses, setSelectedBetHouses] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log('Usuário não autenticado ao montar o componente');
        setError('Usuário não autenticado.');
        navigate('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchTransactions = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('Usuário não autenticado ao carregar transações');
        setError('Usuário não autenticado.');
        navigate('/login');
        return;
      }

      const start = selectedMonth.startOf('month').toDate();
      const end = selectedMonth.endOf('month').toDate();

      const q = query(
        collection(db, 'transactions'),
        where('uid', '==', user.uid),
        where('transactionDate', '>=', start),
        where('transactionDate', '<=', end)
      );

      const querySnapshot = await getDocs(q);
      const userTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(userTransactions);

      const uniqueBetHouses = [...new Set(userTransactions.map((transaction) => transaction.betHouse || 'Desconhecida'))];
      setBetHouses(uniqueBetHouses);
      setSelectedBetHouses(uniqueBetHouses);
      setFilteredTransactions(userTransactions);
      console.log('Transações carregadas:', userTransactions);
      console.log('Casas de aposta disponíveis:', uniqueBetHouses);
    } catch (err) {
      console.error('Erro ao carregar transações:', err);
      setError('Erro ao carregar transações: ' + err.message);
    }
  }, [selectedMonth, navigate]);

  useEffect(() => {
    if (!isLoading) {
      fetchTransactions();
    }
  }, [isLoading, fetchTransactions]);

  const handlePreviousMonth = () => {
    setSelectedMonth(selectedMonth.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setSelectedMonth(selectedMonth.add(1, 'month'));
  };

  const handleFilterDialogOpen = () => {
    setOpenFilterDialog(true);
  };

  const handleFilterDialogClose = () => {
    setOpenFilterDialog(false);
  };

  const handleBetHouseChange = (house) => {
    setSelectedBetHouses((prev) =>
      prev.includes(house)
        ? prev.filter((h) => h !== house)
        : [...prev, house]
    );
  };

  const handleApplyFilter = () => {
    const filtered = transactions.filter((transaction) =>
      selectedBetHouses.includes(transaction.betHouse || 'Desconhecida')
    );
    setFilteredTransactions(filtered);
    setOpenFilterDialog(false);
  };

  const calculateSummary = () => {
    const totalInvested = filteredTransactions.reduce((sum, t) => sum + (t.investedAmount || 0), 0);
    const totalEarned = filteredTransactions.reduce((sum, t) => sum + (t.earnedAmount || 0), 0);
    const totalBalance = totalEarned - totalInvested;

    return { totalInvested, totalEarned, totalBalance };
  };

  const prepareChartData = () => {
    const betHouseSummary = filteredTransactions.reduce((acc, transaction) => {
      const betHouse = transaction.betHouse || 'Desconhecida';
      if (!acc[betHouse]) {
        acc[betHouse] = { earned: 0 };
      }
      acc[betHouse].earned += transaction.earnedAmount || 0;
      return acc;
    }, {});

    const labels = Object.keys(betHouseSummary);
    const data = labels.map((house) => betHouseSummary[house].earned);

    return {
      labels,
      datasets: [
        {
          label: 'Valor Ganho por Casa de Aposta',
          data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
          borderColor: '#FFFFFF',
          borderWidth: 1,
        },
      ],
    };
  };

  const { totalInvested, totalEarned, totalBalance } = calculateSummary();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error === 'Usuário não autenticado.') {
    return <div>Redirecionando para login...</div>;
  }

  return (
    <GlobalStyle>
      <Container>
        <Header>
          <Logo src={LogoSVG} alt="Bet do Fe Logo" />
        </Header>
        <MiddleSection>
          <MonthSelector>
            <MonthButton
              onClick={handlePreviousMonth}
              disabled={selectedMonth.isSame(minDate, 'month')}
            >
              <ChevronLeft />
            </MonthButton>
            <MonthDisplay>
              {selectedMonth.format('MMMM YYYY')}
            </MonthDisplay>
            <MonthButton
              onClick={handleNextMonth}
              disabled={selectedMonth.isSame(maxDate, 'month')}
            >
              <ChevronRight />
            </MonthButton>
          </MonthSelector>

          {error && <Error>{error}</Error>}

          <ButtonRow>
            <Button
              type="button"
              onClick={handleFilterDialogOpen}
              disabled={transactions.length === 0}
            >
              Filtrar
            </Button>
            <Button type="button" onClick={() => navigate('/app')}>
              Voltar
            </Button>
          </ButtonRow>

          <Summary>
            <SummaryItem>
              <SummaryLabel>Valor Investido Total</SummaryLabel>
              <SummaryValue>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvested)}
              </SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Valor Ganho Total</SummaryLabel>
              <SummaryValue>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalEarned)}
              </SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Saldo Total</SummaryLabel>
              <SummaryValue isNegative={totalBalance < 0}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalBalance)}
              </SummaryValue>
            </SummaryItem>
          </Summary>

          {filteredTransactions.length > 0 && (
            <ChartContainer>
              <Pie
                data={prepareChartData()}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: '#CCCCCC',
                        font: {
                          size: 10,
                        },
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          return `${label}: ${new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(value)}`;
                        },
                      },
                    },
                  },
                }}
              />
            </ChartContainer>
          )}
        </MiddleSection>

        <Dialog
          open={openFilterDialog}
          onClose={handleFilterDialogClose}
          PaperProps={{
            style: {
              backgroundColor: '#333333',
              color: '#CCCCCC',
            },
          }}
        >
          <DialogTitle sx={{ backgroundColor: '#005440', color: '#CCCCCC' }}>
            Filtrar por Casa de Aposta
          </DialogTitle>
          <DialogContent sx={{ padding: '20px' }}>
            {betHouses.map((house) => (
              <FormControlLabel
                key={house}
                control={
                  <Checkbox
                    checked={selectedBetHouses.includes(house)}
                    onChange={() => handleBetHouseChange(house)}
                    sx={{
                      color: '#CCCCCC',
                      '&.Mui-checked': {
                        color: '#55FF55',
                      },
                    }}
                  />
                }
                label={house}
                sx={{ color: '#CCCCCC' }}
              />
            ))}
          </DialogContent>
          <DialogActions sx={{ backgroundColor: '#333333', padding: '10px' }}>
            <MuiButton
              onClick={handleFilterDialogClose}
              sx={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                '&:hover': { backgroundColor: '#222222' },
              }}
            >
              Cancelar
            </MuiButton>
            <MuiButton
              onClick={handleApplyFilter}
              sx={{
                backgroundColor: '#55FF55',
                color: '#000000',
                '&:hover': { backgroundColor: '#77FF77' },
              }}
            >
              Aplicar
            </MuiButton>
          </DialogActions>
        </Dialog>

        <Footer>
          <FooterBackground />
          <SocialIcons>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <SocialIcon src={YouTubeIcon} alt="YouTube" />
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
              <SocialIcon src={DiscordIcon} alt="Discord" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <SocialIcon src={InstagramIcon} alt="Instagram" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <SocialIcon src={FacebookIcon} alt="Facebook" />
            </a>
            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
              <SocialIcon src={TelegramIcon} alt="Telegram" />
            </a>
          </SocialIcons>
        </Footer>
      </Container>
    </GlobalStyle>
  );
};

export default ResumoMensal;