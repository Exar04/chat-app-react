import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatPage } from './pages/ChatPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<ChatPage />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
