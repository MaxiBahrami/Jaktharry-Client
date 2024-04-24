import React, { useContext, useEffect, useState,useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import axios from 'axios';
import DOMPurify from 'dompurify';
import StarRating from '../components/StarRating';
import { AuthContext } from '../context/authContext';
import moment from "moment";
import 'moment/locale/sv'; 

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const cat = useLocation().search;
  const navigate = useNavigate();
  moment.locale('sv');
  const [postsToShow, setPostsToShow] = useState([])
  const postsPerPage = 10
  const arrayForHoldingPostsRef = useRef([]);
  const ref = useRef({ current: postsPerPage });
  
  const loopWithSlice = (start, end) => {
    const slicedPosts = posts.slice(start, end);
    setPostsToShow(prevPosts => [...prevPosts, ...slicedPosts]);
    arrayForHoldingPostsRef.current = [...arrayForHoldingPostsRef.current, ...slicedPosts];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/posts${cat}`;
        const res = await axios.get(apiUrl);
        const sortedPosts = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPosts(sortedPosts);
        arrayForHoldingPostsRef.current = sortedPosts.slice(0, postsPerPage);
        setPostsToShow(arrayForHoldingPostsRef.current);

    } catch (err) {
      console.error('Error fetching data:', err);
    } 
  };

  fetchData();
}, [cat]);

  const truncateText = (text, limit) => {
    // Find the second occurrence of a dot (.)
    const secondDotIndex = text.indexOf('.', text.indexOf('.') + 1);
  
    // Truncate at the second dot or use the entire text if no second dot is found
    const truncatedText = secondDotIndex !== -1 ? text.substring(0, secondDotIndex + 1) : text;
  
    // Add "mer..." to indicate more content
    const moreText = text.length > truncatedText.length ? ' mer...' : '';
  
    return truncatedText + moreText;
  };

  const handleClick = (postId) => {
    // Navigate to the single post page with the clicked post ID
    navigate(`/post/${postId}`);
    window.scrollTo(0, 0);
  };

  const sanitizeHTML = (html) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  useEffect(() => {
      loopWithSlice(0, postsPerPage)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser])


    const handleShowMorePosts = () => {
      loopWithSlice(ref.current.current, ref.current.current + postsPerPage);
      ref.current.current += postsPerPage;
    };
    

  return (
    <Container className='home'>
    <div className="posts">
      {postsToShow.map(post => (
        <div className="post" key={post.postId}>
          <div className="img">
            <img src={post.img} alt="" />
          </div>
          <div className="content">
            <Link className='link' to={`/post/${post.postId}`}>
              <h1>{post.title}</h1>
              <p className="DateClass">{moment(post.date).calendar()}</p>
              {/* Use the truncateText function for post.desc */}
              <p dangerouslySetInnerHTML={sanitizeHTML(truncateText(post.desc, 150))}></p>
              {currentUser && currentUser.id && <StarRating userId={currentUser.id} post={post} />}
              <Button onClick={() => handleClick(post.postId)}>Läs mer</Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-5 me-5 text-end">
      <button className='btn btn-dark' onClick={handleShowMorePosts}>Load more</button>
    </div>    
  </Container>
  );
};

export default Home;