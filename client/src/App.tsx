import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatPage } from './pages/ChatPage';
import { Login } from './pages/Login';
import { SignIn } from './pages/SignIn';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/signIn' element={<SignIn />}/>
          <Route path='/chat' element={<ChatPage />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
