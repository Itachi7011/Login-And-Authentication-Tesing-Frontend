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
import "./css/ClientRegistration.css"
import "./css/ClientApiKeys.css"
import "./css/ClientProfile.css"



import Navbar from './components/Navbar';
import NewRegistration from './pages/User/NewRegistration';
import Login from './pages/User/Login';
import UserProfile from './pages/User/UserProfile';
import ClientApiKeys from './pages/Client/ClientApiKeys';
import ClientLogin from './pages/Client/ClientLogin';
import ClientRegistration from './pages/Client/ClientRegistration';
import ClientProfile from './pages/Client/ClientProfile';

// import Error404 from './components/Error/Error404';



function App() {
  const { isDarkMode } = useContext(ThemeContext);
  const [state, dispatch] = useReducer(reducer, initialState)


  useEffect(() => {
    // console.log("Current localStorage user:", localStorage.getItem("user"));
    dispatch({ type: "LOAD_USER" });
  }, []);

  console.log(state)

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
            <Route path="/ClientRegistration" element={<ClientRegistration />} />
            <Route path="/ClientLogin" element={<ClientLogin />} />
            <Route path="/ClientProfile" element={<ClientProfile />} />
            <Route path="/ClientApiKeys" element={<ClientApiKeys />} />





            {/* <Route path="*" element={<Error404 />} /> */}
          </Routes>
        </Router>

      </div>

    </UserContext.Provider>

  )
}

export default App
