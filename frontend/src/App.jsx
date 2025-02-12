import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Navigation from './components/Navigation'; 
import logo from './images/badminton-logo.svg';
import './styles.css';
function App() {
  return (
    <Router>
      <div className="badminton-container">
        <header className="event-header">
          <img 
            src={logo}
            alt="BadMatTon Logo" 
            className="event-logo"
          />
        </header>
        <Navigation /> {/* Optional: Add navigation menu */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;