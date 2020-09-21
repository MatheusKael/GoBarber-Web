import React from 'react';
import SignIn from './pages/SignIn/index';
import GlobalStyles from './styles/GlobalStyles';
import AuthContext from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <>
      <AuthContext.Provider value={{ name: 'Matheus' }}>
        <SignIn />
      </AuthContext.Provider>
      <GlobalStyles />
    </>
  );
};
export default App;
