import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import axios from 'axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const cat = useLocation().search;

  // Define the API URL
  const apiUrl = 'https://jaktharry-app-130a026cb2e4.herokuapp.com/api';
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the full URL for API requests
        const res = await axios.get(`${apiUrl}/posts${cat}`);
        setPosts(res.data);
      } catch (err) {
        console.log(err);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cat]);

  const handleClick = (postId) => {
    // Navigate to the single post page with the clicked post ID
    navigate(`/post/${postId}`);
  };

  return (
    <Container className="home">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="posts">
          {posts.map((post) => (
            <div className="post" key={post.id}>
              <div className="img">
                <img src={`../upload/${post.img}`} alt={`${post.title}`}  />
              </div>
              <div className="content">
                <Link className="link" to={`/post/${post.id}`}>
                  <h1>{post.title}</h1>
                  <p>{post.desc}</p>
                  <Button onClick={() => handleClick(post.id)}>Läs mer</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Home;