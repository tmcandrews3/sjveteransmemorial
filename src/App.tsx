import BrickFinder from './pages/BrickFinder';
import AdminPage from './pages/Admin';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <>
      {isAdmin ? (
        <AdminPage onExit={() => setIsAdmin(false)} />
      ) : (
        <BrickFinder onEnterAdmin={() => setIsAdmin(true)} />
      )}
    </>
  );
}

export default App;