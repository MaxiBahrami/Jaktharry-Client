import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Button} from 'react-bootstrap';

const Menu = ({cat}) => {
  const [posts,setPosts] = useState([])

  useEffect(()=>{
    const fetchData = async()=>{
      try{
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts/?cat=${cat}`);
        setPosts(res.data)
      }catch(err){
        console.log(err)

      }
    };
    fetchData();
  }, [cat]);


  return (
    <Container className='menu'>
      <h1>Andra nyheter som du kan gilla</h1>
      {posts.map((post)=>(
        <div className="post" key={post.id}>
          <img src={`../upload/${post?.img}`} alt="" />
          <h2>{post.title}</h2>
          <Button>Läs mer</Button>
        </div>
      ))}
    </Container>
  );
}

export default Menu;
