import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../bettingapp/firebase/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

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

const Nav = styled.nav`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
`;

const NavLink = styled(Link)`
  font-size: 1.2rem;
  color: #007AFF;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 5px;
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

const Error = styled.p`
  color: red;
  margin: 10px 0;
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

  const handleSignUp = () => {
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

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = '/app';
      })
      .catch((err) => setError(err.message));
  };

  return (
    <Container>
      <Title>Bem-vindo ao Betdofe</Title>
      <Nav>
        <NavLink to="/sobre-nos">Sobre Nós</NavLink>
        <NavLink to="/proximos-jogos">Próximos Jogos</NavLink>
        <NavLink to="/aplicativos">Aplicativos</NavLink>
        <NavLink to="/cursos">Cursos</NavLink>
      </Nav>
      {user ? (
        <Link to="/app">
          <Button>Acessar o BettingApp</Button>
        </Link>
      ) : (
        <LoginContainer>
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <Error>{emailError}</Error>}
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <Error>{passwordError}</Error>}
          {error && <Error>{error}</Error>}
          <Button onClick={handleLogin}>Entrar</Button>
          <Button onClick={handleSignUp}>Cadastrar</Button>
        </LoginContainer>
      )}
    </Container>
  );
};

export default Home;