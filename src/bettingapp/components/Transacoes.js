import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db, auth } from '../firebase/firebase';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button as MuiButton, Checkbox, FormControlLabel } from '@mui/material';

// Importe os arquivos de imagem
import LogoSVG from '../../assets/logo.svg';
import YouTubeIcon from '../../assets/youtube-icon.png';
import DiscordIcon from '../../assets/discord-icon.png';
import InstagramIcon from '../../assets/instagram-icon.png';
import FacebookIcon from '../../assets/facebook-icon.png';
import TelegramIcon from '../../assets/telegram-icon.png';

// Adicione um reset básico para remover margens e padding do body/html
const GlobalStyle = styled.div`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }

  .MuiPickersPopper-root {
    z-index: 9999 !important;
  }

  .MuiDateCalendar-root {
    background-color: #333333;
    border-radius: 5px;
    color: #CCCCCC;
  }

  .MuiPickersCalendarHeader-root {
    background-color: #005440;
    color: #CCCCCC;
  }

  .MuiPickersCalendarHeader-label {
    color: #CCCCCC;
  }

  .MuiDayCalendar-weekDayLabel {
    color: #CCCCCC;
  }

  .MuiPickersDay-root {
    color: #CCCCCC;
  }

  .MuiPickersDay-root:hover {
    background-color: #555555;
    cursor: pointer;
  }

  .MuiPickersDay-root.Mui-selected {
    background-color: #000000 !important;
    color: #FFFFFF !important;
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
  height: 200px;
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
    height: 150px;
  }

  @media (max-width: 480px) {
    height: 120px;
  }
`;

const Logo = styled.img`
  width: 640px;
  height: 312px;
  max-width: 100%;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 400px;
    height: 195px;
  }

  @media (max-width: 480px) {
    width: 300px;
    height: 146px;
  }
`;

const MiddleSection = styled.div`
  width: 100%;
  background-color: #005440;
  margin: 20px 0 0 0;
  padding: 20px;
  border: none;
  outline: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 400px;
  z-index: 1;

  @media (max-width: 768px) {
    margin: 15px 0 0 0;
    padding: 15px;
    min-height: 350px;
  }

  @media (max-width: 480px) {
    margin: 10px 0 0 0;
    padding: 10px;
    min-height: 450px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
  max-width: 500px;
  margin-top: 10px;
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const FormField = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Label = styled.label`
  color: #CCCCCC;
  font-size: 14px;
  margin-bottom: 5px;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const Summary = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: #333333;
  color: #CCCCCC;
  padding: 15px;
  border-radius: 5px;
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  gap: 10px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 5px;
    padding: 10px;
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
  font-size: 14px;
  margin: 0;
  font-weight: bold;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const SummaryValue = styled.p`
  font-size: 16px;
  margin: 5px 0 0 0;
  color: ${(props) => (props.isNegative ? '#FF5555' : '#55FF55')};

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  max-width: 800px;
  overflow-x: auto;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #333333;
  color: #CCCCCC;
`;

const TableHeader = styled.th`
  padding: 10px;
  background-color: #005440;
  font-size: 14px;
  text-align: left;

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px;
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #444444;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  font-size: 14px;
  text-align: left;

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px;
  }
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  margin-right: 5px;
  background-color: ${(props) => (props.danger ? '#FF5555' : '#000000')};
  color: #FFFFFF;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: ${(props) => (props.danger ? '#FF7777' : '#222222')};
  }

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 4px 8px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  max-width: 500px;
  margin-top: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const Button = styled.button`
  flex: 1;
  padding: 10px;
  background-color: #000000;
  color: #FFFFFF;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;

  &:disabled {
    background-color: #555555;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 8px;
    font-size: 12px;
  }
`;

const Error = styled.p`
  color: red;
  font-size: 12px;
  margin: 5px 0;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const Footer = styled.footer`
  width: 100%;
  height: 60px;
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
  height: 60px;
  background-color: #005440;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;

  @media (max-width: 768px) {
    height: 50px;
  }

  @media (max-width: 480px) {
    height: 40px;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 20px;
  margin-right: 20px;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    gap: 15px;
    margin-right: 15px;
  }
`;

const SocialIcon = styled.img`
  width: 30px;
  height: 30px;

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
  }
`;

const Transacoes = () => {
  const navigate = useNavigate();
  const currentDate = dayjs('2025-03-23'); // Data atual fornecida
  const minDate = currentDate.subtract(12, 'month'); // 12 meses atrás: 23/03/2024
  const maxDate = currentDate; // Data máxima: 23/03/2025

  const [startDate, setStartDate] = useState(dayjs('2025-03-01'));
  const [endDate, setEndDate] = useState(dayjs('2025-03-31'));
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]); // Transações filtradas
  const [accounts, setAccounts] = useState([]);
  const [betHouses, setBetHouses] = useState([]); // Lista de casas de aposta
  const [selectedBetHouses, setSelectedBetHouses] = useState([]); // Casas de aposta selecionadas
  const [error, setError] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Modal de exclusão
  const [openFilterDialog, setOpenFilterDialog] = useState(false); // Modal de filtro
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento

  // Verificar estado de autenticação
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

  // Carregar as contas do usuário e extrair as casas de aposta
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log('Usuário não autenticado ao carregar contas');
          setError('Usuário não autenticado.');
          navigate('/login');
          return;
        }

        const q = query(collection(db, 'accounts'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const userAccounts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAccounts(userAccounts);
        console.log('Contas carregadas:', userAccounts);

        // Extrair casas de aposta únicas
        const uniqueBetHouses = [...new Set(userAccounts.map((account) => account.betHouse))];
        setBetHouses(uniqueBetHouses);
        setSelectedBetHouses(uniqueBetHouses); // Inicialmente, todas as casas estão selecionadas
        console.log('Casas de aposta disponíveis:', uniqueBetHouses);
      } catch (err) {
        console.error('Erro ao carregar contas:', err);
        setError('Erro ao carregar contas: ' + err.message);
      }
    };

    if (!isLoading) {
      fetchAccounts();
    }
  }, [isLoading, navigate]);

  // Função para buscar transações (só será chamada ao clicar em "Pesquisar")
  const fetchTransactions = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('Usuário não autenticado ao carregar transações');
        setError('Usuário não autenticado.');
        navigate('/login');
        return;
      }

      if (!startDate || !endDate) {
        setError('Por favor, selecione as datas inicial e final.');
        return;
      }

      if (startDate.isAfter(endDate)) {
        setError('A data inicial não pode ser posterior à data final.');
        return;
      }

      const monthsDiff = endDate.diff(startDate, 'month');
      if (monthsDiff > 12) {
        setError('O intervalo entre as datas não pode exceder 12 meses.');
        return;
      }

      const start = startDate.startOf('day').toDate();
      const end = endDate.endOf('day').toDate();

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
      setFilteredTransactions(
        userTransactions.filter((transaction) => selectedBetHouses.includes(transaction.betHouse))
      );
      console.log('Transações carregadas:', userTransactions);
    } catch (err) {
      console.error('Erro ao carregar transações:', err);
      setError('Erro ao carregar transações: ' + err.message);
    }
  }, [startDate, endDate, selectedBetHouses, navigate]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  const handleEdit = (transaction) => {
    navigate(`/editar-transacao/${transaction.id}`);
  };

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (transactionToDelete) {
        await deleteDoc(doc(db, 'transactions', transactionToDelete.id));
        setTransactions(transactions.filter((t) => t.id !== transactionToDelete.id));
        setFilteredTransactions(
          filteredTransactions.filter((t) => t.id !== transactionToDelete.id)
        );
      }
      setOpenDeleteDialog(false);
      setTransactionToDelete(null);
    } catch (err) {
      console.error('Erro ao excluir transação:', err);
      setError('Erro ao excluir transação: ' + err.message);
    }
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
      selectedBetHouses.includes(transaction.betHouse)
    );
    setFilteredTransactions(filtered);
    setOpenFilterDialog(false);
  };

  const handleNovaTransacaoClick = () => {
    console.log('Botão Nova Transação clicado, navegando para /nova-transacao');
    navigate('/app/nova-transacao');
  };

  const calculateSummary = () => {
    const totalInvested = filteredTransactions.reduce((sum, t) => sum + (t.investedAmount || 0), 0);
    const totalEarned = filteredTransactions.reduce((sum, t) => sum + (t.earnedAmount || 0), 0);
    const totalBalance = totalEarned - totalInvested;

    return { totalInvested, totalEarned, totalBalance };
  };

  const { totalInvested, totalEarned, totalBalance } = calculateSummary();

  // Renderizar mensagem de carregamento enquanto verifica autenticação
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Renderizar mensagem de erro se houver problema de autenticação
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
          <Form onSubmit={handleFilterSubmit}>
            <FormRow>
              <FormField>
                <Label>Data Inicial</Label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    format="DD/MM/YYYY"
                    minDate={minDate}
                    maxDate={maxDate}
                    slotProps={{
                      textField: {
                        readOnly: true,
                        sx: {
                          '& .MuiInputBase-root': {
                            backgroundColor: '#333333',
                            color: '#CCCCCC',
                            borderRadius: '5px',
                            paddingRight: '30px',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                          '& .MuiInputBase-input': {
                            padding: '8px',
                            fontSize: '14px',
                            cursor: 'pointer',
                          },
                          '& .MuiSvgIcon-root': {
                            color: '#CCCCCC',
                          },
                        },
                      },
                      popper: {
                        sx: {
                          zIndex: 9999,
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormField>
              <FormField>
                <Label>Data Final</Label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    format="DD/MM/YYYY"
                    minDate={minDate}
                    maxDate={maxDate}
                    slotProps={{
                      textField: {
                        readOnly: true,
                        sx: {
                          '& .MuiInputBase-root': {
                            backgroundColor: '#333333',
                            color: '#CCCCCC',
                            borderRadius: '5px',
                            paddingRight: '30px',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                          '& .MuiInputBase-input': {
                            padding: '8px',
                            fontSize: '14px',
                            cursor: 'pointer',
                          },
                          '& .MuiSvgIcon-root': {
                            color: '#CCCCCC',
                          },
                        },
                      },
                      popper: {
                        sx: {
                          zIndex: 9999,
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormField>
            </FormRow>

            {error && <Error>{error}</Error>}

            <ButtonRow>
              <Button type="submit">Pesquisar</Button>
              <Button
                type="button"
                onClick={handleFilterDialogOpen}
                disabled={transactions.length === 0}
              >
                Filtrar
              </Button>
              <Button type="button" onClick={handleNovaTransacaoClick}>
                Nova Transação
              </Button>
              <Button type="button" onClick={() => navigate('/app')}>
                Voltar
              </Button>
            </ButtonRow>
          </Form>

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

          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <TableHeader>Data</TableHeader>
                  <TableHeader>Conta</TableHeader>
                  <TableHeader>Casa de Aposta</TableHeader>
                  <TableHeader>Valor Investido</TableHeader>
                  <TableHeader>Valor Ganho</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Ações</TableHeader>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => {
                  const account = accounts.find((acc) => acc.id === transaction.accountId);
                  console.log('Transaction accountId:', transaction.accountId);
                  console.log('Accounts available:', accounts);
                  console.log('Found account:', account);
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {transaction.transactionDate && typeof transaction.transactionDate.toDate === 'function'
                          ? dayjs(transaction.transactionDate.toDate()).format('DD/MM/YYYY')
                          : 'Data inválida'}
                      </TableCell>
                      <TableCell>{account ? account.accountName : 'Desconhecida'}</TableCell>
                      <TableCell>{transaction.betHouse || 'N/A'}</TableCell>
                      <TableCell>
                        {typeof transaction.investedAmount === 'number'
                          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                              transaction.investedAmount
                            )
                          : 'Valor inválido'}
                      </TableCell>
                      <TableCell>
                        {typeof transaction.earnedAmount === 'number'
                          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                              transaction.earnedAmount
                            )
                          : 'Valor inválido'}
                      </TableCell>
                      <TableCell>{transaction.status || 'N/A'}</TableCell>
                      <TableCell>
                        <ActionButton onClick={() => handleEdit(transaction)}>Editar</ActionButton>
                        <ActionButton danger onClick={() => handleDeleteClick(transaction)}>
                          Excluir
                        </ActionButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </tbody>
            </Table>
          </TableContainer>
        </MiddleSection>

        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          PaperProps={{
            style: {
              backgroundColor: '#333333',
              color: '#CCCCCC',
            },
          }}
        >
          <DialogTitle sx={{ backgroundColor: '#005440', color: '#CCCCCC' }}>
            Confirmação de Exclusão
          </DialogTitle>
          <DialogContent sx={{ padding: '20px' }}>
            <p>Tem certeza de que deseja excluir esta transação?</p>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: '#333333', padding: '10px' }}>
            <MuiButton
              onClick={() => setOpenDeleteDialog(false)}
              sx={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                '&:hover': { backgroundColor: '#222222' },
              }}
            >
              Cancelar
            </MuiButton>
            <MuiButton
              onClick={handleDeleteConfirm}
              sx={{
                backgroundColor: '#FF5555',
                color: '#FFFFFF',
                '&:hover': { backgroundColor: '#FF7777' },
              }}
            >
              Excluir
            </MuiButton>
          </DialogActions>
        </Dialog>

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

export default Transacoes;