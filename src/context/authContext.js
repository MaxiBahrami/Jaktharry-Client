import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext()

export const AuthContextProvider = ({children})=>{
  const storedUser = localStorage.getItem("user");
  const [currentUser, setCurrentUser] = useState(storedUser ? JSON.parse(storedUser) : null);


  const login = async (inputs) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, inputs);
      console.log('Response Data:', res.data);

      if (res.data && res.data.token) {
        // Assuming the response contains user data and access token
        setCurrentUser(res.data.user);
        localStorage.setItem('access_token', res.data.token);
      } else {
        // Handle the case where the response does not contain the expected user data
        console.error('Login failed: Unexpected response format');
      }
    } catch (error) {
      // Handle error (e.g., show a message to the user)
      console.error('Login failed:', error.message);
    }
  };

  const logout = async(inputs)=>{
    await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/logout`);
    setCurrentUser(null);
  };

  useEffect(()=>{
    localStorage.setItem("user", JSON.stringify(currentUser));
  },[currentUser]);

  return (
  <AuthContext.Provider value={{currentUser, login, logout}}>{children}</AuthContext.Provider>
  );
};