import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../firebase/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { auth } from '../firebase/firebase';

const Container = styled.div`
  padding: 20px;
  background-color: #1a1a1a;
  min-height: 100vh;
  color: white;
`;

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #2c2c2c;
  border-radius: 12px;
  margin: 10px 0;
  padding: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 1rem;
  color: white;
  background: none;
  border: none;
  outline: none;
`;

const Select = styled.select`
  flex: 1;
  padding: 10px;
  font-size: 1rem;
  color: white;
  background: none;
  border: none;
  outline: none;
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #ff4d4f;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 20px;
`;

const ErrorText = styled.p`
  color: white;
  font-size: 1rem;
  margin-left: 10px;
`;

const Button = styled.button`
  background-color: #007AFF;
  border-radius: 12px;
  padding: 10px;
  margin: 20px 0;
  align-items: center;
  text-align: center;
  cursor: pointer;
  border: none;
`;

const ButtonText = styled.span`
  color: white;
  font-size: 1rem;
  font-weight: bold;
`;

const RegisterUserScreen = () => {
  const [userDate, setUserDate] = useState('');
  const [userDateError, setUserDateError] = useState('');
  const [userAccountName, setUserAccountName] = useState('');
  const [userAccountNameError, setUserAccountNameError] = useState('');
  const [userBetHouse, setUserBetHouse] = useState('');
  const [userBetHouseError, setUserBetHouseError] = useState('');
  const [newUserBetHouse, setNewUserBetHouse] = useState('');
  const [newUserBetHouseError, setNewUserBetHouseError] = useState('');
  const [showNewBetHouse, setShowNewBetHouse] = useState(false);
  const [userGender, setUserGender] = useState('');
  const [userGenderError, setUserGenderError] = useState('');
  const [userAgeRange, setUserAgeRange] = useState('');
  const [userAgeRangeError, setUserAgeRangeError] = useState('');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPasswordError, setUserPasswordError] = useState('');
  const [userPix, setUserPix] = useState('');
  const [userPixError, setUserPixError] = useState('');
  const [userStatus, setUserStatus] = useState('Ativa');
  const [error, setError] = useState('');
  const [betHouses, setBetHouses] = useState(['']);

  useEffect(() => {
    const fetchBetHouses = async () => {
      try {
        const betHousesCollection = collection(db, 'betHouses');
        const betHousesSnapshot = await getDocs(betHousesCollection);
        const betHousesList = betHousesSnapshot.docs.map(doc => doc.data().name);
        setBetHouses(betHousesList.length ? betHousesList : ['']);
      } catch (err) {
        console.error('Erro ao carregar casas de aposta:', err);
      }
    };
    fetchBetHouses();
  }, []);

  const validateFields = () => {
    let hasError = false;

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const pixRegex = /^(?:\d{11}|\w+@\w+\.\w{2,3}|\d{8}-\d{1})$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (!userDate) {
      setUserDateError('Por favor, selecione a data da conta.');
      hasError = true;
    } else if (!dateRegex.test(userDate)) {
      setUserDateError('A data da conta deve estar no formato aaaa-mm-dd.');
      hasError = true;
    } else {
      const [year, month, day] = userDate.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      if (
        date.getDate() !== day ||
        date.getMonth() + 1 !== month ||
        date.getFullYear() !== year ||
        year < 1900 ||
        year > new Date().getFullYear()
      ) {
        setUserDateError('Por favor, insira uma data válida.');
        hasError = true;
      } else {
        setUserDateError('');
      }
    }

    if (!userAccountName) {
      setUserAccountNameError('Por favor, preencha o nome da conta.');
      hasError = true;
    } else {
      setUserAccountNameError('');
    }

    if (!userBetHouse && !newUserBetHouse) {
      setUserBetHouseError('Por favor, selecione ou adicione uma casa de aposta.');
      hasError = true;
    } else {
      setUserBetHouseError('');
    }

    if (showNewBetHouse && !newUserBetHouse) {
      setNewUserBetHouseError('Por favor, preencha o nome da nova casa de aposta.');
      hasError = true;
    } else {
      setNewUserBetHouseError('');
    }

    if (!userGender) {
      setUserGenderError('Por favor, selecione o gênero.');
      hasError = true;
    } else {
      setUserGenderError('');
    }

    if (!userAgeRange) {
      setUserAgeRangeError('Por favor, selecione a faixa de idade.');
      hasError = true;
    } else {
      setUserAgeRangeError('');
    }

    if (!username) {
      setUsernameError('Por favor, preencha o usuário.');
      hasError = true;
    } else {
      setUsernameError('');
    }

    if (!passwordRegex.test(userPassword)) {
      setUserPasswordError('A senha deve ter pelo menos 6 caracteres, com letras e números.');
      hasError = true;
    } else {
      setUserPasswordError('');
    }

    if (!pixRegex.test(userPix)) {
      setUserPixError('A chave Pix deve ser um CPF (11 dígitos), e-mail válido ou chave aleatória (formato 8 dígitos-1 dígito).');
      hasError = true;
    } else {
      setUserPixError('');
    }

    return hasError ? 'Por favor, corrija os erros acima.' : null;
  };

  const addUser = async () => {
    const validationError = validateFields();
    if (validationError) {
      setError(validationError);
      return;
    }

    const betHouse = newUserBetHouse || userBetHouse;
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Usuário não autenticado. Faça login novamente.');
        return;
      }

      await addDoc(collection(db, 'users'), {
        userDate,
        userAccountName,
        userBetHouse: betHouse,
        userGender,
        userAgeRange,
        username,
        userPassword,
        userPix,
        userStatus,
        uid: user.uid,
        createdAt: new Date(),
      });

      if (newUserBetHouse && !betHouses.includes(newUserBetHouse)) {
        await addDoc(collection(db, 'betHouses'), { name: newUserBetHouse });
        setBetHouses([...betHouses, newUserBetHouse]);
      }

      setUserDate('');
      setUserAccountName('');
      setUserBetHouse('');
      setNewUserBetHouse('');
      setShowNewBetHouse(false);
      setUserGender('');
      setUserAgeRange('');
      setUsername('');
      setUserPassword('');
      setUserPix('');
      setUserStatus('Ativa');
      setError('');

      alert('Usuário cadastrado com sucesso!');
      window.location.href = '/app';
    } catch (err) {
      setError('Erro ao cadastrar usuário: ' + err.message);
    }
  };

  return (
    <Container>
      <Title>Cadastro de Usuários</Title>
      {error && (
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
        </ErrorContainer>
      )}

      <InputContainer>
        <Input
          type="date"
          value={userDate}
          onChange={(e) => setUserDate(e.target.value)}
        />
      </InputContainer>
      {userDateError && <ErrorText>{userDateError}</ErrorText>}

      <InputContainer>
        <Input
          placeholder="Nome da Conta"
          value={userAccountName}
          onChange={(e) => setUserAccountName(e.target.value)}
        />
      </InputContainer>
      {userAccountNameError && <ErrorText>{userAccountNameError}</ErrorText>}

      <InputContainer>
        <Select
          value={userBetHouse}
          onChange={(e) => {
            setUserBetHouse(e.target.value);
            setShowNewBetHouse(e.target.value === 'new');
          }}
        >
          <option value="">Selecione uma Casa de Aposta</option>
          {betHouses.map((house, index) => (
            <option key={index} value={house}>{house}</option>
          ))}
          <option value="new">Nova Casa de Aposta</option>
        </Select>
      </InputContainer>
      {userBetHouseError && <ErrorText>{userBetHouseError}</ErrorText>}
      {showNewBetHouse && (
        <InputContainer>
          <Input
            placeholder="Nova Casa de Aposta"
            value={newUserBetHouse}
            onChange={(e) => setNewUserBetHouse(e.target.value)}
          />
        </InputContainer>
      )}
      {newUserBetHouseError && <ErrorText>{newUserBetHouseError}</ErrorText>}

      <InputContainer>
        <Select
          value={userGender}
          onChange={(e) => setUserGender(e.target.value)}
        >
          <option value="">Selecione o Gênero</option>
          <option value="masculino">Masculino</option>
          <option value="feminino">Feminino</option>
        </Select>
      </InputContainer>
      {userGenderError && <ErrorText>{userGenderError}</ErrorText>}

      <InputContainer>
        <Select
          value={userAgeRange}
          onChange={(e) => setUserAgeRange(e.target.value)}
        >
          <option value="">Selecione a Faixa de Idade</option>
          <option value="18-29">18-29</option>
          <option value="30-48">30-48</option>
          <option value="49-70">49-70</option>
        </Select>
      </InputContainer>
      {userAgeRangeError && <ErrorText>{userAgeRangeError}</ErrorText>}

      <InputContainer>
        <Input
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </InputContainer>
      {usernameError && <ErrorText>{usernameError}</ErrorText>}

      <InputContainer>
        <Input
          type="password"
          placeholder="Senha"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />
      </InputContainer>
      {userPasswordError && <ErrorText>{userPasswordError}</ErrorText>}

      <InputContainer>
        <Input
          placeholder="Chave Pix"
          value={userPix}
          onChange={(e) => setUserPix(e.target.value)}
        />
      </InputContainer>
      {userPixError && <ErrorText>{userPixError}</ErrorText>}

      <InputContainer>
        <Select
          value={userStatus}
          onChange={(e) => setUserStatus(e.target.value)}
        >
          <option value="Ativa">Ativa</option>
          <option value="Inativa">Inativa</option>
        </Select>
      </InputContainer>

      <Button onClick={addUser}>
        <ButtonText>Cadastrar</ButtonText>
      </Button>
    </Container>
  );
};

export default RegisterUserScreen;