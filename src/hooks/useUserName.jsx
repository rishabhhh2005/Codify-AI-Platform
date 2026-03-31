import React, { createContext, useContext, useState, useEffect } from 'react';

const UserNameContext = createContext({
  userName: '',
  setUserName: (name) => {},
});

export const UserNameProvider = ({ children }) => {
  const [userName, setUserNameState] = useState('');

  useEffect(() => {
    const storedName = sessionStorage.getItem('userName');
    if (storedName) {
      setUserNameState(storedName);
    }
  }, []);

  const setUserName = (name) => {
    sessionStorage.setItem('userName', name);
    setUserNameState(name);
  };

  return (
    <UserNameContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserNameContext.Provider>
  );
};

export const useUserName = () => useContext(UserNameContext);
