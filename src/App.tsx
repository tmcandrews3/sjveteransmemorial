import BrickFinder from './pages/BrickFinder';
import AdminPage from './pages/Admin';

function App() {
  const isAdmin = false; // Simple version for demo

  return isAdmin ? <AdminPage /> : <BrickFinder />;
}

export default App;