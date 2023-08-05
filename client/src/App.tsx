import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatPage } from './pages/ChatPage';
import { Login } from './pages/Login';
import { SignIn } from './pages/SignIn';

function App() {
  const [UserId, setUserId] = useState<number>() 
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Login setUserId={setUserId}/>}/>
          <Route path='/signIn' element={<SignIn />}/>
          <Route path='/chat' element={<ChatPage UserId={UserId}/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
