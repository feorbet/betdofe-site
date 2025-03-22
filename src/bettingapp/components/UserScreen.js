import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../firebase/firebase';

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
  height: 300px; /* Altura padrão para desktop */
  background-color: #005440; /* Mesma cor do cabeçalho */
  margin: 50px 0 0 0; /* Margem superior para centralizar */
  padding: 0; /* Remove padding */
  border: none; /* Remove qualquer borda */
  outline: none; /* Remove contorno */
  display: flex; /* Para centralizar os botões */
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Centraliza verticalmente */

  /* Responsividade */
  @media (max-width: 768px) { /* Tablet */
    height: 250px; /* Reduz a altura */
    margin: 30px 0 0 0; /* Reduz a margem superior */
  }

  @media (max-width: 480px) { /* Mobile */
    height: 200px; /* Reduz ainda mais a altura */
    margin: 20px 0 0 0; /* Reduz ainda mais a margem superior */
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;

  /* Responsividade */
  @media (max-width: 480px) {
    gap: 10px;
    margin-bottom: 10px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 20px;

  /* Responsividade */
  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const Button = styled.button`
  width: 200px;
  padding: 10px;
  background-color: #000000;
  color: #FFFFFF;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;

  /* Responsividade */
  @media (max-width: 768px) {
    width: 150px;
    padding: 8px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    width: 120px;
    padding: 6px;
    font-size: 10px;
  }
`;

const LogoutButton = styled(Button)`
  margin-top: 20px;

  /* Responsividade */
  @media (max-width: 480px) {
    margin-top: 10px;
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
  z-index: 1; /* Garante que o rodapé fique acima de outros elementos */
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

const UserScreen = () => {
  const navigate = useNavigate();

  return (
    <GlobalStyle>
      <Container>
        <Header>
          <Logo src={LogoSVG} alt="Bet do Fe Logo" />
        </Header>
        <MiddleSection>
          <ButtonContainer>
            <ButtonRow>
              <Button onClick={() => navigate('/app/register')}>
                Cadastro de Conta
              </Button>
              <Button onClick={() => navigate('/app/nova-transacao')}>
                Nova Transação
              </Button>
            </ButtonRow>
            <ButtonRow>
              <Button onClick={() => navigate('/app/resumo-mensal')}>
                Resumo Mensal
              </Button>
              <Button onClick={() => navigate('/app/transacoes')}>
                Transações
              </Button>
            </ButtonRow>
          </ButtonContainer>
          <LogoutButton onClick={() => auth.signOut()}>Sair</LogoutButton>
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

export default UserScreen;