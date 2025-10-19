import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'

import Login from './pages/loginPage/Login.jsx'
import SignUp from './pages/signUpPage/SignUp.jsx'
import Home from './pages/Home/Home.jsx'
import PostPage from "./pages/PostPage/PostPage.jsx"


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/post/:id" element={<PostPage />} />
      </Routes>
    </Router>
  );
};

export default App
