
import React, { useContext, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import axios from 'axios';

const Login = () => {

  const [inputs,setInputs] = useState({
    username:"",
    password:"",
  })

  const [err,setError] = useState(null);
  const navigate = useNavigate();
  const { login} = useContext(AuthContext);
  const { currentUser} = useContext(AuthContext);
  
  const handleChange = e =>{
    setInputs(prev=>({...prev, [e.target.name]: e.target.value}))
  };

  const updateLastActivity = async (userId) => {
    
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/users/update-last-activity/${userId}`);
    } catch (error) {
      console.error('Error updating last activity:', error);
    }
  };

  const handleSubmit = async e =>{
    e.preventDefault();
    try{
      await login(inputs);
      console.log(currentUser.id);
    if (currentUser && currentUser.id) {
      updateLastActivity(currentUser.id); 
    }
      navigate("/");
    }catch(err){
      setError(err.response.data);
    }
  };

  return (
    <Container className='auth'>
      <h1>Logga in</h1>
      <form >
        <input required type="text" placeholder='Användarnamn ' name="username" onChange={handleChange}/>
        <input required type="password " placeholder='Lösenord' name="password" onChange={handleChange}/>
        <Button onClick={handleSubmit}>Logga in</Button>
        {err && <p>{err}</p>}
        <span>Har du inget konto?.. <Link to="/register">Registrera</Link></span>
      </form>
      <Link className='HemClass nav-link' to="/">Gå hem ..</Link>
    </Container>
  );
}

export default Login;
