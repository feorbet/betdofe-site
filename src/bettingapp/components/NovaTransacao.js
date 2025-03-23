import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db, auth } from '../firebase/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// Importe os arquivos de imagem
import LogoSVG from '../../assets/logo.svg';
import YouTubeIcon from '../../assets/youtube-icon.png';
import DiscordIcon from '../../assets/discord-icon.png';
import InstagramIcon from '../../assets/instagram-icon.png';
import FacebookIcon from '../../assets/facebook-icon.png';
import TelegramIcon from '../../assets/telegram-icon.png';

// Estilos (semelhantes ao Transacoes.js)
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

const Input = styled.input`
  width: 100%;
  padding: 8px;
  background-color: #333333;
  color: #CCCCCC;
  border: none;
  border-radius: 5px;
  font-size: 14px;

  &:focus {
    outline: none;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 6px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  background-color: #333333;
  color: #CCCCCC;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 6px;
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

const NovaTransacao = () => {
  const navigate = useNavigate();
  const currentDate = dayjs('2025-03-23'); // Data atual fornecida
  const minDate = currentDate.subtract(12, 'month'); // 12 meses atrás: 23/03/2024
  const maxDate = currentDate; // Data máxima: 23/03/2025

  const [transactionDate, setTransactionDate] = useState(dayjs('2025-03-23'));
  const [accountId, setAccountId] = useState('');
  const [betHouse, setBetHouse] = useState('');
  const [investedAmount, setInvestedAmount] = useState('');
  const [earnedAmount, setEarnedAmount] = useState('');
  const [status, setStatus] = useState('Pendente');
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState('');

  // Carregar as contas do usuário
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('Usuário não autenticado.');
          return;
        }

        const q = query(collection(db, 'accounts'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const userAccounts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAccounts(userAccounts);
        if (userAccounts.length > 0) {
          setAccountId(userAccounts[0].id); // Selecionar a primeira conta por padrão
          setBetHouse(userAccounts[0].betHouse); // Preencher a casa de aposta com base na conta
        }
      } catch (err) {
        setError('Erro ao carregar contas: ' + err.message);
      }
    };

    fetchAccounts();
  }, []);

  const handleAccountChange = (e) => {
    const selectedAccountId = e.target.value;
    setAccountId(selectedAccountId);
    const selectedAccount = accounts.find((account) => account.id === selectedAccountId);
    if (selectedAccount) {
      setBetHouse(selectedAccount.betHouse);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Usuário não autenticado.');
        return;
      }

      if (!transactionDate || !accountId || !investedAmount || !earnedAmount || !status) {
        setError('Por favor, preencha todos os campos.');
        return;
      }

      await addDoc(collection(db, 'transactions'), {
        uid: user.uid,
        transactionDate: transactionDate.toDate(),
        accountId,
        betHouse,
        investedAmount: parseFloat(investedAmount),
        earnedAmount: parseFloat(earnedAmount),
        status,
      });

      navigate('/transacoes');
    } catch (err) {
      setError('Erro ao salvar transação: ' + err.message);
    }
  };

  return (
    <GlobalStyle>
      <Container>
        <Header>
          <Logo src={LogoSVG} alt="Bet do Fe Logo" />
        </Header>
        <MiddleSection>
          <Form onSubmit={handleSubmit}>
            <FormRow>
              <FormField>
                <Label>Data da Transação</Label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={transactionDate}
                    onChange={(newValue) => setTransactionDate(newValue)}
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
                <Label>Conta</Label>
                <Select value={accountId} onChange={handleAccountChange}>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.accountName}
                    </option>
                  ))}
                </Select>
              </FormField>
            </FormRow>

            <FormRow>
              <FormField>
                <Label>Casa de Aposta</Label>
                <Input value={betHouse} readOnly />
              </FormField>
              <FormField>
                <Label>Status</Label>
                <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Pendente">Pendente</option>
                  <option value="Concluída">Concluída</option>
                  <option value="Cancelada">Cancelada</option>
                </Select>
              </FormField>
            </FormRow>

            <FormRow>
              <FormField>
                <Label>Valor Investido</Label>
                <Input
                  type="number"
                  value={investedAmount}
                  onChange={(e) => setInvestedAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </FormField>
              <FormField>
                <Label>Valor Ganho</Label>
                <Input
                  type="number"
                  value={earnedAmount}
                  onChange={(e) => setEarnedAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </FormField>
            </FormRow>

            {error && <Error>{error}</Error>}

            <ButtonRow>
              <Button type="submit">Salvar</Button>
              <Button type="button" onClick={() => {
                console.log('Botão Voltar clicado, navegando para /app');
                navigate('/app');
              }}>
                Voltar
              </Button>
            </ButtonRow>
          </Form>
        </MiddleSection>

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

export default NovaTransacao;