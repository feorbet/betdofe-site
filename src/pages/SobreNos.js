import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #666;
  text-align: center;
  max-width: 600px;
`;

const SobreNos = () => {
  return (
    <Container>
      <Title>Sobre Nós</Title>
      <Description>
        Bem-vindo ao Betdofe! Somos uma plataforma dedicada a oferecer a melhor experiência em apostas esportivas. Nossa missão é proporcionar um ambiente seguro, confiável e divertido para os amantes de esportes e apostas. Junte-se a nós e faça parte da nossa comunidade!
      </Description>
    </Container>
  );
};

export default SobreNos;