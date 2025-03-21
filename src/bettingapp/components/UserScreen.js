import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../firebase/firebase';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 10px 0;
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

const UserScreen = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>Bem-vindo ao Betdofe!</Title>
      <Button onClick={() => navigate('/app/register')}>
        Cadastro de Conta
      </Button>
      <Button onClick={() => navigate('/app/nova-transacao')}>
        Nova Transação
      </Button>
      <Button onClick={() => navigate('/app/resumo-mensal')}>
        Resumo Mensal
      </Button>
      <Button onClick={() => navigate('/app/transacoes')}>
        Transações
      </Button>
      <Button onClick={() => auth.signOut()}>Sair</Button>
    </Container>
  );
};

export default UserScreen;