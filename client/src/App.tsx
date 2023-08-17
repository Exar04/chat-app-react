import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatPage } from './pages/ChatPage';
import { Login } from './pages/Login';
import { SignIn } from './pages/SignIn';

function App() {
  // const [UserId, setUserId] = useState<number>() 
  // const [UserName, setUserName] = useState<string>('')

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* <RoutLogine path='/' element={<Login setUserId={setUserId}/>}/> */}
          <Route path='/' element={<ChatPage />}/>
          <Route path='/signIn' element={<SignIn />}/>
          {/* <Route path='/chat' element={<ChatPage UserId={UserId} UserName={UserName} />}/> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
