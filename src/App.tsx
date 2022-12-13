import React from 'react';
import './App.css';
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import SignIn from './components/login/SignIn';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
