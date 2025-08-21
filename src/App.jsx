import { useState, useContext, useEffect } from 'react'
import { ThemeContext } from './context/ThemeContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createContext, useReducer } from "react";
import { reducer, initialState } from "./reducers/UseReducer"
import UserContext from './context/UserContext';


import './App.css'
import "./css/NewRegistration.css"
import "./css/Login.css"
import "./css/UserProfile.css"
import "./css/Navbar.css"



import Navbar from './components/Navbar';
import NewRegistration from './pages/User/NewRegistration';
import Login from './pages/User/Login';
import UserProfile from './pages/User/UserProfile';

// import Error404 from './components/Error/Error404';



function App() {
  const { isDarkMode } = useContext(ThemeContext);
  const [state, dispatch] = useReducer(reducer, initialState)


  useEffect(() => {
    // console.log("Current localStorage user:", localStorage.getItem("user"));
    dispatch({ type: "LOAD_USER" });
  }, []);

  return (
    <UserContext.Provider value={{ state, dispatch }}>




      <div className={isDarkMode ? 'dark' : 'light'}>

        <Router>
          <Navbar />
          {/* <AdminNavSidebar /> */}
          <Routes>
            <Route path="/Signup" element={<NewRegistration />} />
            <Route path="/" element={<Login />} />
            <Route path="/UserProfile" element={<UserProfile />} />





            {/* <Route path="*" element={<Error404 />} /> */}
          </Routes>
        </Router>

      </div>

    </UserContext.Provider>

  )
}

export default App
