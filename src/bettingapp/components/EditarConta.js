// src/bettingapp/components/EditarConta.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #13281E;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 500px;
  background-color: #333333;
  padding: 20px;
  border-radius: 5px;
`;

const Label = styled.label`
  color: #CCCCCC;
  font-size: 14px;
  margin-bottom: 5px;
`;

const Input = styled.input`
  background-color: #444444;
  color: #CCCCCC;
  border: none;
  border-radius: 5px;
  padding: 8px;
  font-size: 14px;
`;

const Select = styled.select`
  background-color: #444444;
  color: #CCCCCC;
  border: none;
  border-radius: 5px;
  padding: 8px;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #000000;
  color: #FFFFFF;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;

  &:disabled {
    background-color: #555555;
    cursor: not-allowed;
  }
`;

const Error = styled.p`
  color: red;
  font-size: 12px;
  text-align: center;
`;

const EditarConta = () => {
  const { id } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();

  const [accountName, setAccountName] = useState('');
  const [betHouse, setBetHouse] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('Usuário não autenticado.');
          navigate('/login');
          return;
        }

        const docRef = doc(db, 'accounts', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAccountName(data.accountName || '');
          setBetHouse(data.betHouse || '');
          setStatus(data.status || '');
        } else {
          setError('Conta não encontrada.');
        }
      } catch (err) {
        console.error('Erro ao carregar conta:', err);
        setError('Erro ao carregar conta: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccount();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Usuário não autenticado.');
        navigate('/login');
        return;
      }

      const docRef = doc(db, 'accounts', id);
      await updateDoc(docRef, {
        accountName,
        betHouse,
        status,
      });

      navigate('/app/consulta-contas-cadastradas');
    } catch (err) {
      console.error('Erro ao atualizar conta:', err);
      setError('Erro ao atualizar conta: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Container>
      <h2 style={{ color: '#CCCCCC' }}>Editar Conta</h2>
      <Form onSubmit={handleSubmit}>
        <FormField>
          <Label>Nome da Conta</Label>
          <Input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            required
          />
        </FormField>
        <FormField>
          <Label>Casa de Aposta</Label>
          <Input
            type="text"
            value={betHouse}
            onChange={(e) => setBetHouse(e.target.value)}
            required
          />
        </FormField>
        <FormField>
          <Label>Status</Label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Selecione o Status</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Nova">Nova</option>
          </Select>
        </FormField>
        {error && <Error>{error}</Error>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
        <Button type="button" onClick={() => navigate('/app/consulta-contas-cadastradas')}>
          Voltar
        </Button>
      </Form>
    </Container>
  );
};

export default EditarConta;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;