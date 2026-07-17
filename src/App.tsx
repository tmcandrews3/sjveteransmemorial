import { Routes, Route } from 'react-router-dom';
import BrickFinder from './pages/BrickFinder';
import Admin from './pages/Admin';
import TestOrder from './pages/TestOrder';   // ← Add this line

function App() {
  return (
    <Routes>
      <Route path="/" element={<BrickFinder />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/test-order" element={<TestOrder />} />
    </Routes>
  );
}

export default App;