import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "../context/authContext.js";
import { Button, Container } from "react-bootstrap";
import DOMPurify from 'dompurify'; 
import del from "../img/del.png";
import edit from "../img/edit.png";
import StarRating from "../components/StarRating.jsx";

const Single = () => {
  const [post, setPost] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  const postId = location.pathname.split("/")[2];
  const { currentUser } = useContext(AuthContext);

  const [userIsSignedUp, setUserIsSignedUp] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/posts/${postId}`
        );
        setPost(response.data);
      } catch (error) {
        console.log(error);
      } 
    };

    fetchData();
    if (currentUser) {
      const checkIsUserSignedUp = async () => {
        try {
          const data = { postId };
          const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/posts/signup/status`,
            data
          );

          const { status } = res.data;

          setUserIsSignedUp(status);
        } catch (err) {
          console.log(err);
        }
      };

      checkIsUserSignedUp();
    }
  }, [postId, currentUser]);

  const handleUserSignUp = async () => {
  };

  const handleDelete = async (post) => {
    try {
      // Ask for confirmation before deleting
      const confirmDelete = window.confirm("Are you sure you want to delete this post?");
      if (!confirmDelete) return;
  
      // Retrieve the token from local storage
      const token = localStorage.getItem('accessToken');
      console.log(token);
  
      // Create headers with the Authorization header
      const headers = { Authorization: `Bearer ${token}` };
  
      // Perform the delete operation with the Authorization header
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/posts/${post.id}`;
      await axios.delete(apiUrl, { headers });

      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleWriteClick = () => {
    navigate("/write", { state: { currentUser, ...post } });
  };

  const splitTextAfterThirdDot = (text) => {
    const sentences = text.split(".");

    // Split the array into groups of three sentences
    const groupedSentences = [];
    for (let i = 0; i < sentences.length; i += 4) {
      const group = sentences.slice(i, i + 4).join(".");
      groupedSentences.push(group);
    }

    return groupedSentences;
  };

  const paragraphs = post.text ? splitTextAfterThirdDot(post.text) : [];

  return (
    <Container className="single">
      <div className="content">
        <div>
          <div className="img">
            <img src={post.img} alt="" />
          </div>
          {currentUser && (
          <div className="user">
            {post.userImage && <img src={post.userImage} alt="" />}
            <div className="info">
              <span>{post.username}</span>
              <p>Posted {moment(post.date).fromNow()}</p>
            </div>
            {currentUser.username === post.username && (
              <div className="edit">
                <Link to={`/write?edit=2`} state={post} onClick={handleWriteClick}>
                <img src={edit} alt="" className="iconClass1" />
                </Link>
                <img
                  onClick={() => handleDelete(post)}
                  src={del} alt=""
                />
              </div>
            )}
          </div>)}
          <h1>{post.title}</h1>

          <StarRating initUserHasRated disabled={!currentUser} userId={currentUser?.id} post={post} className="star-rating"/>

          <p className="descP" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.desc) }}></p>
          {/* Render each paragraph separately */}
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(paragraph.replace(/\n/g, "<br />")),
              }}
            />
          ))}
        </div>

        {post.cat === "aktiviteter" && <div className="text-center">
          <Button onClick={handleUserSignUp} disabled={userIsSignedUp}>
            Sign up to Aktivitet
          </Button>
        </div>}
      </div>
      <Menu cat={post.cat} />
    </Container>
  );
};

export default Single;
