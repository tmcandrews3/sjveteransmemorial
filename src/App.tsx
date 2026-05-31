import { Routes, Route } from 'react-router-dom';
import BrickFinder from './pages/BrickFinder';
import Admin from './pages/Admin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<BrickFinder />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;