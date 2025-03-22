import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../bettingapp/firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Importe os arquivos de imagem
import LogoSVG from '../assets/logo.svg'; // Logotipo SVG
import EmailIcon from '../assets/email-icon.png'; // Ícone de e-mail PNG
import LockIcon from '../assets/lock-icon.png'; // Ícone de cadeado PNG
import UserIcon from '../assets/user-icon.png'; // Ícone de usuário PNG
import YouTubeIcon from '../assets/youtube-icon.png'; // Ícone do YouTube PNG
import DiscordIcon from '../assets/discord-icon.png'; // Ícone do Discord PNG
import InstagramIcon from '../assets/instagram-icon.png'; // Ícone do Instagram PNG
import FacebookIcon from '../assets/facebook-icon.png'; // Ícone do Facebook PNG
import TelegramIcon from '../assets/telegram-icon.png'; // Ícone do Telegram PNG

// Adicione um reset básico para remover margens e padding do body/html
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
  background-color: #13281E; /* Fundo cor #13281E */
  padding: 0;
  margin: 0; /* Remove margens para evitar bordas brancas */
  width: 100vw; /* Garante que ocupe toda a largura da tela */
  overflow-x: hidden; /* Evita barras de rolagem horizontais */
`;

const Header = styled.header`
  width: 1680px; /* Largura 1680px */
  height: 200px; /* Altura 200px */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #005440; /* Cor #005440 */
  margin: 0; /* Remove margens */
  padding: 0; /* Remove padding */
  border: none; /* Remove qualquer borda */
  outline: none; /* Remove contorno */
`;

const Logo = styled.img`
  width: 640px; /* Largura 640px */
  height: 312px; /* Altura 312px */
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const Icon = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  position: relative;
  width: 300px;
  margin: 10px 0;
`;

const InputIcon = styled.img`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 10px 10px 40px; /* Espaço para o ícone à esquerda */
  background-color: #333333;
  border: none;
  border-radius: 5px;
  color: #CCCCCC;
  font-size: 14px;
  &::placeholder {
    color: #CCCCCC;
  }
`;

const Button = styled.button`
  width: 100px;
  padding: 10px;
  margin-top: 20px;
  background-color: #000000;
  color: #FFFFFF;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
`;

const Error = styled.p`
  color: red;
  font-size: 12px;
  margin: 5px 0;
`;

const Footer = styled.footer`
  width: 100%;
  padding: 10px 0;
  display: flex;
  justify-content: flex-end;
  background-color: #13281E;
  position: fixed;
  bottom: 0;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 20px;
  margin-right: 20px;
`;

const SocialIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const Home = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLogin = () => {
    let hasError = false;

    if (!validateEmail(email)) {
      setEmailError('Por favor, insira um e-mail válido.');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!validatePassword(password)) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres.');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) return;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = '/app';
      })
      .catch((err) => setError(err.message));
  };

  return (
    <GlobalStyle>
      <Container>
        <Header>
          <Logo src={LogoSVG} alt="Bet do Fe Logo" />
        </Header>
        {user ? (
          <Link to="/app">
            <Button>Acessar o BettingApp</Button>
          </Link>
        ) : (
          <LoginContainer>
            <Icon src={UserIcon} alt="User Icon" />
            <InputContainer>
              <InputIcon src={EmailIcon} alt="Email Icon" />
              <Input
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputContainer>
            {emailError && <Error>{emailError}</Error>}
            <InputContainer>
              <InputIcon src={LockIcon} alt="Lock Icon" />
              <Input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputContainer>
            {passwordError && <Error>{passwordError}</Error>}
            {error && <Error>{error}</Error>}
            <Button onClick={handleLogin}>Entrar</Button>
          </LoginContainer>
        )}
        <Footer>
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

export default Home;