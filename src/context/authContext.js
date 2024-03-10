import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext()

export const AuthContextProvider = ({children})=>{
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")|| null))

  const login = async(inputs)=>{
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, inputs);
      setCurrentUser(res.data);
      return res.data; // Return the response data
    } catch (error) {
      console.error('Error during login:', error);
      // Handle the error (e.g., display an error message to the user)
    }
  };

  const logout = async(inputs)=>{
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`);
      setCurrentUser(null);
      return true; // Indicate successful logout
    } catch (error) {
      console.error('Error during logout:', error);
      // Handle the error (e.g., display an error message to the user)
    }
  };

  useEffect(()=>{
    localStorage.setItem("user", JSON.stringify(currentUser));
  },[currentUser]);

  return (
  <AuthContext.Provider value={{currentUser, login, logout}}>{children}</AuthContext.Provider>
  );
};