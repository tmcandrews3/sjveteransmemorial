import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BrickFinder from './pages/BrickFinder';
import OrderForm from './pages/OrderForm';
import Admin from './pages/Admin';
import Contact from './pages/Contact';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/find-a-brick" element={<BrickFinder />} />
      <Route path="/buy-a-brick" element={<OrderForm />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;