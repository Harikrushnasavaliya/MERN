import React from 'react';
import './App.css';
import Navbar from './components/navbar';
import Home from './components/home';
import About from './components/about';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NoteState from './context/notes/NoteStates';
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';
import { useState } from 'react'
import ManageUser from './components/manageUser';

function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      tye: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }
  return (
    <NoteState>
      <Router>
        <Navbar alert={alert} />
        <Alert />
        <div className="container">
          <Routes>
            <Route path="/notes" element={<Home showAlert={showAlert} />} />
            <Route path="/about" element={<About showAlert={showAlert} />} />
            <Route path="/login" element={<Login showAlert={showAlert} />} />
            <Route path="/" element={<Login showAlert={showAlert} />} />
            <Route path="/signup" element={<Signup showAlert={showAlert} />} />
            <Route path="/manage" element={<ManageUser/>} />
          </Routes>
        </div>
      </Router>
    </NoteState>
  );
}

export default App;
