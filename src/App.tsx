import { useState } from 'react';
import BrickFinder from './pages/BrickFinder';
import AdminPage from './pages/Admin';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <>
      {isAdmin ? (
        <AdminPage />
      ) : (
        <BrickFinder />
      )}
    </>
  );
}

export default App;