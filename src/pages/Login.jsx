
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
      await login(inputs);
      navigate("/");
    }catch(err){
      setError(err.response.data);
    }
  };

  return (
    <Container className='auth'>
      <h1>Logga in</h1>
      <form onSubmit={handleSubmit}>
        <input required type="text" id="username" placeholder='Användarnamn ' name="username" onChange={handleChange}/>
        <input required type="password " id="password" placeholder='Lösenord' name="password" onChange={handleChange}/>
        <Button type="submit">Logga in</Button>
        {err && <p>{err}</p>}
        <span>Har du inget konto?.. <Link to="/register">Registrera</Link></span>
      </form>
    </Container>
  );
}

export default Login;
