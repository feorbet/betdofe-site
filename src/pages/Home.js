import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin: 20px 0;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
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

const Home = () => {
  return (
    <Container>
      <Title>Bem-vindo ao Betdofe</Title>
      <Description>Sua plataforma de apostas esportivas confiável.</Description>
      <Button onClick={() => window.location.href = '/app'}>Acesse o BettingApp</Button>
    </Container>
  );
};

export default Home;