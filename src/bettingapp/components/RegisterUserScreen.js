import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db, auth } from '../firebase/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import DatePicker from 'react-datepicker';

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
  background-color: #2c2c2c;
  border: none;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  option {
    background-color: #2c2c2c;
    color: white;
  }
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

const BackButton = styled.button`
  background-color: #6c757d;
  border-radius: 12px;
  padding: 10px;
  margin: 40px 0 20px 0;
  align-items: center;
  text-align: center;
  cursor: pointer;
  border: none;
`;

const StyledDatePicker = styled(DatePicker)`
  flex: 1;
  padding: 10px;
  font-size: 1rem;
  color: white;
  background-color: #2c2c2c;
  border: none;
  border-radius: 12px;
  outline: none;
`;

const RegisterUserScreen = () => {
  const navigate = useNavigate();
  const [userDate, setUserDate] = useState(null);
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
  const [existingUserData, setExistingUserData] = useState([]); // Dados do usuário logado

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

    const fetchExistingUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const usersCollection = collection(db, 'users');
          const usersSnapshot = await getDocs(usersCollection);
          const userDataList = usersSnapshot.docs
            .map(doc => doc.data())
            .filter(data => data.uid === user.uid); // Filtra apenas os dados do usuário logado
          setExistingUserData(userDataList);
        }
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err);
      }
    };

    fetchBetHouses();
    fetchExistingUserData();
  }, []);

  const validateFields = () => {
    let hasError = false;

    const pixRegex = /^(?:\d{11}|\w+@\w+\.\w{2,3}|\d{8}-\d{1})$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    // Validação de duplicatas apenas para o usuário logado
    const accountNameExists = existingUserData.some(data => data.userAccountName === userAccountName);
    const usernameExists = existingUserData.some(data => data.username === username);
    const pixExists = existingUserData.some(data => data.userPix === userPix);

    if (accountNameExists) {
      setUserAccountNameError('Este nome da conta já está em uso por você.');
      hasError = true;
    } else {
      setUserAccountNameError('');
    }

    if (usernameExists) {
      setUsernameError('Este usuário já está em uso por você.');
      hasError = true;
    } else {
      setUsernameError('');
    }

    if (pixExists) {
      setUserPixError('Esta chave Pix já está em uso por você.');
      hasError = true;
    } else {
      setUserPixError('');
    }

    if (!userDate) {
      setUserDateError('Por favor, selecione a data da conta.');
      hasError = true;
    } else {
      const year = userDate.getFullYear();
      if (year < 1900 || year > new Date().getFullYear()) {
        setUserDateError('Por favor, insira uma data válida.');
        hasError = true;
      } else {
        setUserDateError('');
      }
    }

    if (!userAccountName) {
      setUserAccountNameError('Por favor, preencha o nome da conta.');
      hasError = true;
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
        userDate: userDate.toISOString().split('T')[0],
        userAccountName,
        userBetHouse: betHouse,
        userGender,
        userAgeRange,
        username,
        userPassword,
        userPix,
        userStatus,
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
      });

      if (newUserBetHouse && !betHouses.includes(newUserBetHouse)) {
        await addDoc(collection(db, 'betHouses'), { name: newUserBetHouse });
        setBetHouses([...betHouses, newUserBetHouse]);
      }

      setUserDate(null);
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
      <Title>Cadastro de Contas</Title>
      {error && (
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
        </ErrorContainer>
      )}

      <InputContainer>
        <StyledDatePicker
          selected={userDate}
          onChange={(date) => setUserDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Selecione a Data da Conta"
          onKeyDown={(e) => e.preventDefault()}
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

      <BackButton onClick={() => navigate('/app')}>
        <ButtonText>Voltar</ButtonText>
      </BackButton>
    </Container>
  );
};

export default RegisterUserScreen;