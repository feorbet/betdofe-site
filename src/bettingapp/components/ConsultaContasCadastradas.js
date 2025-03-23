import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db, auth } from '../firebase/firebase';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button as MuiButton, Checkbox, FormControlLabel } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import LogoSVG from '../../assets/logo.svg';
import YouTubeIcon from '../../assets/youtube-icon.png';
import DiscordIcon from '../../assets/discord-icon.png';
import InstagramIcon from '../../assets/instagram-icon.png';
import FacebookIcon from '../../assets/facebook-icon.png';
import TelegramIcon from '../../assets/telegram-icon.png';

dayjs.locale('pt-br');

const GlobalStyle = styled.div`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #13281E;
  padding: 0;
  margin: 0;
  width: 100vw;
  overflow-x: hidden;
  position: relative;
`;

const Header = styled.header`
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #005440;
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  z-index: 1;

  @media (max-width: 768px) {
    height: 150px;
  }

  @media (max-width: 480px) {
    height: 120px;
  }
`;

const Logo = styled.img`
  width: 640px;
  height: 312px;
  max-width: 100%;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 400px;
    height: 195px;
  }

  @media (max-width: 480px) {
    width: 300px;
    height: 146px;
  }
`;

const MiddleSection = styled.div`
  width: 100%;
  background-color: #005440;
  margin: 20px 0 0 0;
  padding: 20px;
  border: none;
  outline: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 400px;
  z-index: 1;

  @media (max-width: 768px) {
    margin: 15px 0 0 0;
    padding: 15px;
    min-height: 350px;
  }

  @media (max-width: 480px) {
    margin: 10px 0 0 0;
    padding: 10px;
    min-height: 450px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
  max-width: 500px;
  margin-top: 10px;
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  align-items: flex-end;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const FormField = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Label = styled.label`
  color: #CCCCCC;
  font-size: 14px;
  margin-bottom: 5px;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  max-width: 800px;
  overflow-x: auto;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #333333;
  color: #CCCCCC;
`;

const TableHeader = styled.th`
  padding: 10px;
  background-color: #005440;
  font-size: 14px;
  text-align: left;

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px;
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #444444;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  font-size: 14px;
  text-align: left;

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px;
  }
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  margin-right: 5px;
  background-color: ${(props) => (props.danger ? '#FF5555' : '#000000')};
  color: #FFFFFF;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: ${(props) => (props.danger ? '#FF7777' : '#222222')};
  }

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 4px 8px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  max-width: 500px;
  margin-top: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const Button = styled.button`
  flex: 1;
  padding: 10px;
  background-color: #000000;
  color: #FFFFFF;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;

  &:disabled {
    background-color: #555555;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 8px;
    font-size: 12px;
  }
`;

const Error = styled.p`
  color: red;
  font-size: 12px;
  margin: 5px 0;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const Footer = styled.footer`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: transparent;
  position: fixed;
  bottom: 0;
  z-index: 1;
`;

const FooterBackground = styled.div`
  width: 100%;
  height: 60px;
  background-color: #005440;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;

  @media (max-width: 768px) {
    height: 50px;
  }

  @media (max-width: 480px) {
    height: 40px;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 20px;
  margin-right: 20px;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    gap: 15px;
    margin-right: 15px;
  }
`;

const SocialIcon = styled.img`
  width: 30px;
  height: 30px;

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
  }
`;

const ConsultaContasCadastradas = () => {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [betHouses, setBetHouses] = useState([]);
  const [selectedBetHouses, setSelectedBetHouses] = useState([]);
  const [error, setError] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log('Usuário não autenticado ao montar o componente');
        setError('Usuário não autenticado.');
        navigate('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchAccounts = useCallback(async () => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('Usuário não autenticado ao carregar contas');
        setError('Usuário não autenticado.');
        navigate('/login');
        return;
      }

      let q = query(collection(db, 'accounts'), where('uid', '==', user.uid));
      if (statusFilter && statusFilter !== 'todos') {
        q = query(q, where('status', '==', statusFilter));
      }

      const querySnapshot = await getDocs(q);
      const userAccounts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Contas carregadas:', userAccounts);
      console.log('Valores de status encontrados:', [...new Set(userAccounts.map(account => account.status))]);

      const uniqueBetHouses = [...new Set(userAccounts.map((account) => account.betHouse))];
      setAccounts(userAccounts);
      setFilteredAccounts(userAccounts);
      setBetHouses(uniqueBetHouses);
      setSelectedBetHouses(uniqueBetHouses);
      console.log('Casas de aposta disponíveis:', uniqueBetHouses);
    } catch (err) {
      console.error('Erro ao carregar contas:', err);
      setError('Erro ao carregar contas: ' + err.message);
    } finally {
      setIsFetching(false);
    }
  }, [statusFilter, navigate, isFetching]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (!statusFilter) {
      setError('Por favor, selecione um status para pesquisar.');
      return;
    }
    fetchAccounts();
  };

  const handleEdit = (account) => {
    navigate(`/editar-conta/${account.id}`);
  };

  const handleDeleteClick = (account) => {
    setAccountToDelete(account);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (accountToDelete) {
        await deleteDoc(doc(db, 'accounts', accountToDelete.id));
        setAccounts(accounts.filter((a) => a.id !== accountToDelete.id));
        setFilteredAccounts(
          filteredAccounts.filter((a) => a.id !== accountToDelete.id)
        );
      }
      setOpenDeleteDialog(false);
      setAccountToDelete(null);
    } catch (err) {
      console.error('Erro ao excluir conta:', err);
      setError('Erro ao excluir conta: ' + err.message);
    }
  };

  const handleFilterDialogOpen = () => {
    setOpenFilterDialog(true);
  };

  const handleFilterDialogClose = () => {
    setOpenFilterDialog(false);
  };

  const handleBetHouseChange = (house) => {
    setSelectedBetHouses((prev) =>
      prev.includes(house)
        ? prev.filter((h) => h !== house)
        : [...prev, house]
    );
  };

  const handleApplyFilter = () => {
    const filtered = accounts.filter((account) =>
      selectedBetHouses.includes(account.betHouse)
    );
    setFilteredAccounts(filtered);
    setOpenFilterDialog(false);
  };

  const handleNovaContaClick = () => {
    console.log('Botão Nova Conta clicado, navegando para /register');
    navigate('/register');
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error === 'Usuário não autenticado.') {
    return <div>Redirecionando para login...</div>;
  }

  return (
    <GlobalStyle>
      <Container>
        <Header>
          <Logo src={LogoSVG} alt="Bet do Fe Logo" />
        </Header>
        <MiddleSection>
          <Form onSubmit={handleFilterSubmit}>
            <FormRow>
              <FormField>
                <Label>Status da Conta</Label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    backgroundColor: '#333333',
                    color: '#CCCCCC',
                    borderRadius: '5px',
                    height: '40px',
                    width: '100%',
                    padding: '8px',
                    border: 'none',
                    fontSize: '14px',
                  }}
                >
                  <option value="">Selecione o Status</option>
                  <option value="todos">Todos</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Nova">Nova</option>
                </select>
              </FormField>
              <FormField>
                <Button type="submit" disabled={isFetching}>
                  {isFetching ? 'Pesquisando...' : 'Pesquisar'}
                </Button>
              </FormField>
            </FormRow>

            {error && <Error>{error}</Error>}

            <ButtonRow>
              <Button
                type="button"
                onClick={handleFilterDialogOpen}
                disabled={accounts.length === 0}
              >
                Filtrar
              </Button>
              <Button type="button" onClick={handleNovaContaClick}>
                Nova Conta
              </Button>
              <Button type="button" onClick={() => navigate('/consulta-contas')}>
                Voltar
              </Button>
            </ButtonRow>
          </Form>

          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <TableHeader>Nome da Conta</TableHeader>
                  <TableHeader>Casa de Aposta</TableHeader>
                  <TableHeader>Data de Cadastro</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Ações</TableHeader>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.accountName}</TableCell>
                    <TableCell>{account.betHouse || 'N/A'}</TableCell>
                    <TableCell>
                      {account.createdAt && typeof account.createdAt.toDate === 'function'
                        ? dayjs(account.createdAt.toDate()).format('DD/MM/YYYY')
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{account.status || 'N/A'}</TableCell>
                    <TableCell>
                      <ActionButton onClick={() => handleEdit(account)}>Editar</ActionButton>
                      <ActionButton danger onClick={() => handleDeleteClick(account)}>
                        Excluir
                      </ActionButton>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </MiddleSection>

        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          PaperProps={{
            style: {
              backgroundColor: '#333333',
              color: '#CCCCCC',
            },
          }}
        >
          <DialogTitle sx={{ backgroundColor: '#005440', color: '#CCCCCC' }}>
            Confirmação de Exclusão
          </DialogTitle>
          <DialogContent sx={{ padding: '20px' }}>
            <p>Tem certeza de que deseja excluir esta conta?</p>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: '#333333', padding: '10px' }}>
            <MuiButton
              onClick={() => setOpenDeleteDialog(false)}
              sx={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                '&:hover': { backgroundColor: '#222222' },
              }}
            >
              Cancelar
            </MuiButton>
            <MuiButton
              onClick={handleDeleteConfirm}
              sx={{
                backgroundColor: '#FF5555',
                color: '#FFFFFF',
                '&:hover': { backgroundColor: '#FF7777' },
              }}
            >
              Excluir
            </MuiButton>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openFilterDialog}
          onClose={handleFilterDialogClose}
          PaperProps={{
            style: {
              backgroundColor: '#333333',
              color: '#CCCCCC',
            },
          }}
        >
          <DialogTitle sx={{ backgroundColor: '#005440', color: '#CCCCCC' }}>
            Filtrar por Casa de Aposta
          </DialogTitle>
          <DialogContent sx={{ padding: '20px' }}>
            {betHouses.map((house) => (
              <FormControlLabel
                key={house}
                control={
                  <Checkbox
                    checked={selectedBetHouses.includes(house)}
                    onChange={() => handleBetHouseChange(house)}
                    sx={{
                      color: '#CCCCCC',
                      '&.Mui-checked': {
                        color: '#55FF55',
                      },
                    }}
                  />
                }
                label={house}
                sx={{ color: '#CCCCCC' }}
              />
            ))}
          </DialogContent>
          <DialogActions sx={{ backgroundColor: '#333333', padding: '10px' }}>
            <MuiButton
              onClick={handleFilterDialogClose}
              sx={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                '&:hover': { backgroundColor: '#222222' },
              }}
            >
              Cancelar
            </MuiButton>
            <MuiButton
              onClick={handleApplyFilter}
              sx={{
                backgroundColor: '#55FF55',
                color: '#000000',
                '&:hover': { backgroundColor: '#77FF77' },
              }}
            >
              Aplicar
            </MuiButton>
          </DialogActions>
        </Dialog>

        <Footer>
          <FooterBackground />
          <SocialIcons>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <SocialIcon src={YouTubeIcon} alt="YouTube" />
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
              <SocialIcon src={DiscordIcon} alt="Discord" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <SocialIcon src={InstagramIcon} alt="Instagram" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <SocialIcon src={FacebookIcon} alt="Facebook" />
            </a>
            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
              <SocialIcon src={TelegramIcon} alt="Telegram" />
            </a>
          </SocialIcons>
        </Footer>
      </Container>
    </GlobalStyle>
  );
};

export default ConsultaContasCadastradas;