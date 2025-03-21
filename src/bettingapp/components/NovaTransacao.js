import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db, auth } from '../firebase/firebase';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
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

const ErrorText = styled.p`
  color: #ff4d4f;
  font-size: 1rem;
  margin: 5px 0;
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

const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const ModalMessage = styled.p`
  color: black;
  margin-bottom: 20px;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
`;

const SimButton = styled(ModalButton)`
  background-color: #28a745;
  color: white;
`;

const NaoButton = styled(ModalButton)`
  background-color: #dc3545;
  color: white;
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

const NovaTransacao = () => {
  const navigate = useNavigate();
  const [nomeConta, setNomeConta] = useState('');
  const [casaAposta, setCasaAposta] = useState('');
  const [novaCasaAposta, setNovaCasaAposta] = useState('');
  const [showNovaCasaAposta, setShowNovaCasaAposta] = useState(false);
  const [valorInvestido, setValorInvestido] = useState('');
  const [valorGanho, setValorGanho] = useState('');
  const [tipo, setTipo] = useState('Positivo');
  const [data, setData] = useState(new Date());
  const [contasAtivas, setContasAtivas] = useState([]);
  const [casasAposta, setCasasAposta] = useState([]);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedContaId, setSelectedContaId] = useState(null);

  useEffect(() => {
    const fetchContasAtivas = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const usersCollection = collection(db, 'users');
          const usersSnapshot = await getDocs(usersCollection);
          const usersList = usersSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(userData => userData.uid === user.uid && userData.userStatus === 'Ativa'); // Filtra apenas contas do usuário logado
          setContasAtivas(usersList);
        }
      } catch (err) {
        console.error('Erro ao carregar contas ativas:', err);
      }
    };

    const fetchCasasAposta = async () => {
      try {
        const betHousesCollection = collection(db, 'betHouses');
        const betHousesSnapshot = await getDocs(betHousesCollection);
        const betHousesList = betHousesSnapshot.docs.map(doc => doc.data().name);
        setCasasAposta(betHousesList.length ? betHousesList : ['']);
      } catch (err) {
        console.error('Erro ao carregar casas de aposta:', err);
      }
    };

    fetchContasAtivas();
    fetchCasasAposta();
  }, []);

  const handleNomeContaChange = (e) => {
    const selectedConta = contasAtivas.find(conta => conta.userAccountName === e.target.value);
    setNomeConta(e.target.value);
    if (selectedConta) {
      setCasaAposta(selectedConta.userBetHouse);
      setSelectedContaId(selectedConta.id);
    } else {
      setCasaAposta('');
      setSelectedContaId(null);
    }
  };

  const validateFields = () => {
    if (!nomeConta) {
      setError('Por favor, selecione uma conta.');
      return false;
    }
    if (!casaAposta && !novaCasaAposta) {
      setError('Por favor, selecione ou adicione uma casa de aposta.');
      return false;
    }
    if (!valorInvestido || valorInvestido <= 0) {
      setError('Por favor, insira um valor investido válido.');
      return false;
    }
    if (!valorGanho || valorGanho < 0) {
      setError('Por favor, insira um valor ganho válido.');
      return false;
    }
    if (!data) {
      setError('Por favor, selecione uma data.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmation = async (isActive) => {
    setShowConfirmation(false);

    try {
      const betHouse = novaCasaAposta || casaAposta;

      await addDoc(collection(db, 'transacoes'), {
        nomeConta,
        casaAposta: betHouse,
        valorInvestido: parseFloat(valorInvestido),
        valorGanho: parseFloat(valorGanho),
        tipo,
        data: data.toISOString().split('T')[0],
        createdAt: new Date(),
      });

      if (novaCasaAposta && !casasAposta.includes(novaCasaAposta)) {
        await addDoc(collection(db, 'betHouses'), { name: novaCasaAposta });
        setCasasAposta([...casasAposta, novaCasaAposta]);
      }

      if (!isActive && selectedContaId) {
        const contaRef = doc(db, 'users', selectedContaId);
        await updateDoc(contaRef, { userStatus: 'Inativa' });
        setContasAtivas(contasAtivas.filter(conta => conta.id !== selectedContaId));
      }

      setNomeConta('');
      setCasaAposta('');
      setNovaCasaAposta('');
      setShowNovaCasaAposta(false);
      setValorInvestido('');
      setValorGanho('');
      setTipo('Positivo');
      setData(new Date());
      setSelectedContaId(null);

      alert('Transação registrada com sucesso!');
    } catch (err) {
      setError('Erro ao registrar transação: ' + err.message);
    }
  };

  return (
    <Container>
      <Title>Nova Transação</Title>
      {error && <ErrorText>{error}</ErrorText>}

      <InputContainer>
        <Select value={nomeConta} onChange={handleNomeContaChange}>
          <option value="">Selecione uma Conta</option>
          {contasAtivas.map((conta, index) => (
            <option key={index} value={conta.userAccountName}>
              {conta.userAccountName}
            </option>
          ))}
        </Select>
      </InputContainer>

      <InputContainer>
        <Select
          value={casaAposta}
          onChange={(e) => {
            setCasaAposta(e.target.value);
            setShowNovaCasaAposta(e.target.value === 'new');
          }}
        >
          <option value="">Selecione uma Casa de Aposta</option>
          {casasAposta.map((house, index) => (
            <option key={index} value={house}>{house}</option>
          ))}
          <option value="new">Nova Casa de Aposta</option>
        </Select>
      </InputContainer>
      {showNovaCasaAposta && (
        <InputContainer>
          <Input
            placeholder="Nova Casa de Aposta"
            value={novaCasaAposta}
            onChange={(e) => setNovaCasaAposta(e.target.value)}
          />
        </InputContainer>
      )}

      <InputContainer>
        <Input
          type="number"
          placeholder="Valor Investido"
          value={valorInvestido}
          onChange={(e) => setValorInvestido(e.target.value)}
        />
      </InputContainer>

      <InputContainer>
        <Input
          type="number"
          placeholder="Valor Ganho"
          value={valorGanho}
          onChange={(e) => setValorGanho(e.target.value)}
        />
      </InputContainer>

      <InputContainer>
        <Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="Positivo">Positivo</option>
          <option value="Negativo">Negativo</option>
        </Select>
      </InputContainer>

      <InputContainer>
        <StyledDatePicker
          selected={data}
          onChange={(date) => setData(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Selecione a Data"
          onKeyDown={(e) => e.preventDefault()}
        />
      </InputContainer>

      <Button onClick={handleSubmit}>
        <ButtonText>Adicionar Transação</ButtonText>
      </Button>

      <BackButton onClick={() => navigate('/app')}>
        <ButtonText>Voltar</ButtonText>
      </BackButton>

      {showConfirmation && (
        <ConfirmationModal>
          <ModalContent>
            <ModalMessage>A conta encontra-se Ativa ainda?</ModalMessage>
            <SimButton onClick={() => handleConfirmation(true)}>Sim</SimButton>
            <NaoButton onClick={() => handleConfirmation(false)}>Não</NaoButton>
          </ModalContent>
        </ConfirmationModal>
      )}
    </Container>
  );
};

export default NovaTransacao;