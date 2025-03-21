import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import LoginScreen from '../components/LoginScreen';
import UserScreen from '../components/UserScreen';
import RegisterUserScreen from '../components/RegisterUserScreen';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <Routes>
      {user ? (
        <>
          <Route path="/" element={<UserScreen />} />
          <Route path="/register" element={<RegisterUserScreen />} />
        </>
      ) : (
        <Route path="*" element={<LoginScreen />} />
      )}
    </Routes>
  );
};

export default App;