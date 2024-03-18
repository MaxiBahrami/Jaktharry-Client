import React, { useContext, useEffect, useState } from "react";
import UserAvatar from "../components/UserAvatar";
import "../assets/styles/userProfile.scss";
import PostCard from "../components/PostCard";
import axios from "../axios";
import { AuthContext } from "../context/authContext";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { currentUser } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/users/post-signups`;
        const res = await axios.get(apiUrl);
        setPosts(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data. Please try again later.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      {error ? (
        <p>Error: {error}</p>
      ) : loading ? (
        <p>Loading...</p>
      ) : (
        <div className="user-profile-pg">
          <div className="allChildrenCenter my-3">
            <Link to="/update-password">Update Password</Link>
          </div>

          <div className="allChildrenCenter">
            <UserAvatar profileImg={currentUser.img} />
          </div>

          <div className="user-post-signups">
            <h3 className="text-center">Activities Sign Ups</h3>
            <Container>
              <Row xs={1} sm={3}>
                {posts.map((post, idx) => {
                  return (
                    <Col key={idx}>
                      <PostCard post={post} />
                    </Col>
                  );
                })}
              </Row>
            </Container>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
