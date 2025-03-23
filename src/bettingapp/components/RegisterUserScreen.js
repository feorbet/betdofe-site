import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db, auth } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// Importe os arquivos de imagem
import LogoSVG from '../../assets/logo.svg'; // Logotipo SVG
import YouTubeIcon from '../../assets/youtube-icon.png'; // Ícone do YouTube PNG
import DiscordIcon from '../../assets/discord-icon.png'; // Ícone do Discord PNG
import InstagramIcon from '../../assets/instagram-icon.png'; // Ícone do Instagram PNG
import FacebookIcon from '../../assets/facebook-icon.png'; // Ícone do Facebook PNG
import TelegramIcon from '../../assets/telegram-icon.png'; // Ícone do Telegram PNG

// Adicione um reset básico para remover margens e padding do body/html
const GlobalStyle = styled.div`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }

  /* Estiliza o pop-up do DatePicker do MUI */
  .MuiPickersPopper-root {
    z-index: 9999 !important; /* Garante que o pop-up fique acima de tudo */
  }

  /* Estiliza o calendário para combinar com o tema */
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
  background-color: #13281E; /* Fundo cor #13281E */
  padding: 0;
  margin: 0; /* Remove margens para evitar bordas brancas */
  width: 100vw; /* Garante que ocupe toda a largura da tela */
  overflow-x: hidden; /* Evita barras de rolagem horizontais */
  position: relative; /* Necessário para posicionamento absoluto */
`;

const Header = styled.header`
  width: 100%; /* Largura total */
  height: 200px; /* Altura padrão para desktop */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #005440; /* Cor #005440 */
  margin: 0; /* Remove margens */
  padding: 0; /* Remove padding */
  border: none; /* Remove qualquer borda */
  outline: none; /* Remove contorno */
  z-index: 1; /* Garante que o header não sobreponha o pop-up */

  /* Responsividade */
  @media (max-width: 768px) { /* Tablet */
    height: 150px; /* Reduz a altura */
  }

  @media (max-width: 480px) { /* Mobile */
    height: 120px; /* Reduz ainda mais a altura */
  }
`;

const Logo = styled.img`
  width: 640px; /* Largura padrão para desktop */
  height: 312px; /* Altura padrão para desktop */
  max-width: 100%; /* Garante que não ultrapasse a largura da tela */
  object-fit: contain; /* Mantém a proporção */

  /* Responsividade */
  @media (max-width: 768px) { /* Tablet */
    width: 400px; /* Reduz a largura */
    height: 195px; /* Reduz a altura proporcionalmente */
  }

  @media (max-width: 480px) { /* Mobile */
    width: 300px; /* Reduz ainda mais a largura */
    height: 146px; /* Reduz ainda mais a altura proporcionalmente */
  }
`;

const MiddleSection = styled.div`
  width: 100%; /* Largura total */
  background-color: #005440; /* Mesma cor do cabeçalho */
  margin: 20px 0 0 0; /* Margem superior ajustada */
  padding: 20px; /* Adiciona padding para o conteúdo */
  border: none; /* Remove qualquer borda */
  outline: none; /* Remove contorno */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Alinha o conteúdo no topo */
  min-height: 400px; /* Ajusta a altura para evitar sobreposição com o rodapé */
  z-index: 1; /* Garante que a seção não sobreponha o pop-up */

  /* Responsividade */
  @media (max-width: 768px) { /* Tablet */
    margin: 15px 0 0 0;
    padding: 15px;
    min-height: 350px;
  }

  @media (max-width: 480px) { /* Mobile */
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
  max-width: 500px; /* Limita a largura do formulário */
  margin-top: 10px; /* Reduz a margem superior para subir o formulário */
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;

  /* Responsividade */
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

const CenteredFormField = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 220px; /* Mantém a largura consistente com os outros campos */
  margin: 0 auto; /* Centraliza o campo */
`;

const Label = styled.label`
  color: #CCCCCC;
  font-size: 14px;
  margin-bottom: 5px;

  /* Responsividade */
  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const Input = styled.input`
  padding: 8px;
  font-size: 14px;
  border-radius: 5px;
  background-color: #333333;
  color: #CCCCCC;
  border: none;
  outline: none;
  width: 100%;
  box-sizing: border-box;

  /* Responsividade */
  @media (max-width: 480px) {
    padding: 6px;
    font-size: 12px;
  }
`;

const Select = styled.select`
  padding: 8px;
  font-size: 14px;
  border-radius: 5px;
  background-color: #333333;
  color: #CCCCCC;
  border: none;
  outline: none;
  width: 100%;
  box-sizing: border-box;

  /* Responsividade */
  @media (max-width: 480px) {
    padding: 6px;
    font-size: 12px;
  }
`;

const AddBetHouseContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const AddBetHouseRow = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
`;

const AddBetHouseButton = styled.button`
  padding: 8px;
  background-color: #000000;
  color: #FFFFFF;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;

  /* Responsividade */
  @media (max-width: 480px) {
    padding: 6px;
    font-size: 12px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  max-width: 500px;

  /* Responsividade */
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
  white-space: nowrap; /* Evita quebra de texto */

  /* Responsividade */
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

  /* Responsividade */
  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const Footer = styled.footer`
  width: 100%;
  height: 60px; /* Altura fixa para o rodapé */
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: transparent; /* Fundo transparente para mostrar a faixa verde */
  position: fixed;
  bottom: 0;
  z-index: 1; /* Garante que o rodapé não sobreponha o pop-up */
`;

const FooterBackground = styled.div`
  width: 100%;
  height: 60px; /* Altura menor para desktop */
  background-color: #005440; /* Mesma cor do cabeçalho e MiddleSection */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0; /* Coloca a faixa atrás dos ícones */

  /* Responsividade */
  @media (max-width: 768px) { /* Tablet */
    height: 50px; /* Reduz a altura */
  }

  @media (max-width: 480px) { /* Mobile */
    height: 40px; /* Reduz ainda mais a altura */
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 20px;
  margin-right: 20px;
  position: relative; /* Garante que os ícones fiquem acima da faixa verde */
  z-index: 1; /* Coloca os ícones acima da faixa verde */

  /* Responsividade */
  @media (max-width: 480px) {
    gap: 15px;
    margin-right: 15px;
  }
`;

const SocialIcon = styled.img`
  width: 30px;
  height: 30px;

  /* Responsividade */
  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
  }
`;

const RegisterUserScreen = () => {
  const navigate = useNavigate();
  // Define a data atual (23/03/2025) como padrão usando dayjs
  const [createdAt, setCreatedAt] = useState(dayjs('2025-03-23')); // Data atual conforme instruções
  const [accountName, setAccountName] = useState('');
  const [betHouse, setBetHouse] = useState('');
  const [newBetHouse, setNewBetHouse] = useState('');
  const [showNewBetHouseInput, setShowNewBetHouseInput] = useState(false);
  const [betHouses, setBetHouses] = useState(['Bet365', 'Betano', 'Sportingbet']); // Lista inicial de casas de aposta
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [status, setStatus] = useState('Ativo');
  const [error, setError] = useState('');

  const handleAddBetHouse = () => {
    if (newBetHouse.trim() && !betHouses.includes(newBetHouse.trim())) {
      setBetHouses([...betHouses, newBetHouse.trim()]);
      setBetHouse(newBetHouse.trim());
      setNewBetHouse('');
      setShowNewBetHouseInput(false);
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

      if (!createdAt) {
        setError('Por favor, selecione a data de criação.');
        return;
      }

      await addDoc(collection(db, 'accounts'), {
        uid: user.uid, // Associa a conta ao UID do usuário logado
        createdAt: createdAt.toDate(), // Converte o dayjs para Date antes de salvar
        accountName,
        betHouse,
        username,
        password,
        pixKey,
        status,
      });

      navigate('/app');
    } catch (err) {
      setError('Erro ao cadastrar conta: ' + err.message);
    }
  };

  const handleDateChange = (newValue) => {
    console.log('Data selecionada:', newValue); // Log para debugging
    setCreatedAt(newValue);
  };

  return (
    <GlobalStyle>
      <Container>
        <Header>
          <Logo src={LogoSVG} alt="Bet do Fe Logo" />
        </Header>
        <MiddleSection>
          <Form onSubmit={handleSubmit}>
            {/* Linha 1: Data de Criação | Nome da Conta */}
            <FormRow>
              <FormField>
                <Label>Data de Criação</Label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={createdAt}
                    onChange={handleDateChange}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        readOnly: true, // Impede a digitação manual
                        sx: {
                          '& .MuiInputBase-root': {
                            backgroundColor: '#333333',
                            color: '#CCCCCC',
                            borderRadius: '5px',
                            paddingRight: '30px', // Espaço para o ícone
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
                            color: '#CCCCCC', // Cor do ícone de calendário
                          },
                        },
                      },
                      popper: {
                        sx: {
                          zIndex: 9999, // Garante que o pop-up fique acima de tudo
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormField>
              <FormField>
                <Label>Nome da Conta</Label>
                <Input
                  type="text"
                  placeholder="Nome da Conta"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  required
                />
              </FormField>
            </FormRow>

            {/* Linha 2: Casa de Aposta | Status */}
            <FormRow>
              <FormField>
                <Label>Casa de Aposta</Label>
                <AddBetHouseContainer>
                  <Select
                    value={betHouse}
                    onChange={(e) => {
                      if (e.target.value === 'add-new') {
                        setShowNewBetHouseInput(true);
                        setBetHouse('');
                      } else {
                        setShowNewBetHouseInput(false);
                        setBetHouse(e.target.value);
                      }
                    }}
                    required
                  >
                    <option value="" disabled>Selecione a Casa de Aposta</option>
                    {betHouses.map((house) => (
                      <option key={house} value={house}>
                        {house}
                      </option>
                    ))}
                    <option value="add-new">Adicionar Nova Casa</option>
                  </Select>
                  {showNewBetHouseInput && (
                    <AddBetHouseRow>
                      <Input
                        type="text"
                        placeholder="Nova Casa de Aposta"
                        value={newBetHouse}
                        onChange={(e) => setNewBetHouse(e.target.value)}
                      />
                      <AddBetHouseButton type="button" onClick={handleAddBetHouse}>
                        +
                      </AddBetHouseButton>
                    </AddBetHouseRow>
                  )}
                </AddBetHouseContainer>
              </FormField>
              <FormField>
                <Label>Status</Label>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Nova">Nova</option>
                </Select>
              </FormField>
            </FormRow>

            {/* Linha 3: Usuário | Senha */}
            <FormRow>
              <FormField>
                <Label>Usuário</Label>
                <Input
                  type="text"
                  placeholder="Usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </FormField>
              <FormField>
                <Label>Senha</Label>
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormField>
            </FormRow>

            {/* Linha 4: Chave PIX (centralizado) */}
            <FormRow>
              <CenteredFormField>
                <Label>Chave PIX</Label>
                <Input
                  type="text"
                  placeholder="Chave PIX"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  required
                />
              </CenteredFormField>
            </FormRow>

            {/* Mensagem de erro */}
            {error && <Error>{error}</Error>}

            {/* Linha 5: Botões Adicionar | Voltar */}
            <ButtonRow>
              <Button type="submit">Adicionar</Button>
              <Button type="button" onClick={() => navigate('/app')}>
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

export default RegisterUserScreen;