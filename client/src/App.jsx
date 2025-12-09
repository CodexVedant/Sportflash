import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar />
        <div className="main">
          <TopBar />
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/match/:sport" element={<div style={{ color: 'white', padding: '2rem' }}>Match Details Component Coming Soon</div>} />
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
