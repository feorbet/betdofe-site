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

const Cursos = () => {
  return (
    <Container>
      <Title>Cursos</Title>
      <Description>
        Oferecemos cursos para iniciantes e apostadores experientes que desejam melhorar suas estratégias de apostas. Em breve, lançaremos nossos primeiros cursos. Inscreva-se para receber novidades!
      </Description>
    </Container>
  );
};

export default Cursos;