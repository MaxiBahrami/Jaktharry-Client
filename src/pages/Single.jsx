import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu"
import axios from "axios";
import moment from "moment";
import {AuthContext} from "../context/authContext.js";

const Single = () => {
  const [post,setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation()
  const navigate = useNavigate()

  const postId = location.pathname.split("/")[2]
  const {currentUser} = useContext(AuthContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.log(error);
        setError("Error fetching post data");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/posts/${postId}`);
      navigate("/");
    } catch (err) {
      console.log(err);
      setError("Error deleting post");
    }
  };
  
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  const paragraphs = post.text ? post.text.split('.') : [];
  console.log('post.text:', post.text);

  return (
    <div className="single">
      <div className="content">
        <img src={`/upload/${post?.img}`}   alt=""  />
        <div className="user">
          {post.userImage && <img
            src={post.userImage}
            alt=""
          />}
          <div className="info">
            <span>{post.username}</span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
          {currentUser.username === post.username && <div className="edit">
            <Link to={`/write?edit=2`} state={post}>
              <img
                src="https://logowik.com/content/uploads/images/888_edit.jpg"
                alt=""
              />
            </Link>
            <img onClick={handleDelete}
              src="https://cdn.iconscout.com/icon/free/png-256/free-delete-2902143-2411575.png"
              alt=""
            />
          </div>}
        </div>
        <h1>{post.title}</h1>
        <p>{post.desc}</p>
         {/* Render each paragraph separately */}
      {paragraphs.map((paragraph, index) => (
      <p key={index} dangerouslySetInnerHTML={{ __html: paragraph.replace(/\n/g, '<br />') }} />
    ))}
        
      </div>
      <Menu cat={post.cat}/>
    </div>
  );
};

export default Single;