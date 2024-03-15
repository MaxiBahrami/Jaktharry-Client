
import React, { useContext, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const Login = () => {

  const [inputs,setInputs] = useState({
    username:"",
    password:"",
  })

  const [err,setError] = useState(null);

  const navigate = useNavigate();

  const { login} = useContext(AuthContext);

  const handleChange = e =>{
    setInputs(prev=>({...prev, [e.target.name]: e.target.value}))
  };

  const handleSubmit = async e =>{
    e.preventDefault();
    try{
      const { username, password } = inputs;
      const response = await login({ username, password });
      const { token } = response.data;
      
      // Store the token in localStorage
      localStorage.setItem('access_token', token);
      
      navigate("/");
    }catch(error) {
    if (error.response) {
      // Server responded with an error status code
      setError(error.response.data.message);
    } else if (error.request) {
      // The request was made but no response was received
      setError("Server did not respond. Please try again later.");
    } else {
      // Something else happened in making the request
      setError("An unexpected error occurred. Please try again later.");
    }
  }
  };

  return (
    <Container className='auth'>
      <h1>Logga in</h1>
      <form onSubmit={handleSubmit}>
        <input required type="text" placeholder='Användarnamn ' name="username" onChange={handleChange}/>
        <input required type="password " placeholder='Lösenord' name="password" onChange={handleChange}/>
        <Button type="submit">Logga in</Button>
        {err && <p>{err}</p>}
        <span>Har du inget konto?.. <Link to="/register">Registrera</Link></span>
      </form>
      <Link className='HemClass nav-link' to="/">Gå hem ..</Link>
    </Container>
  );
}

export default Login;
