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

const Aplicativos = () => {
  return (
    <Container>
      <Title>Aplicativos</Title>
      <Description>
        Nosso aplicativo Betdofe está em desenvolvimento e estará disponível em breve para iOS e Android. Fique atento para baixar e aproveitar a melhor experiência de apostas no seu celular!
      </Description>
    </Container>
  );
};

export default Aplicativos;