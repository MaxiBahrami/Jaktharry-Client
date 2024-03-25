import React, { useContext, useEffect, useState } from "react";
import UserAvatar from "../components/UserAvatar";
import "../assets/styles/userProfile.scss";
import PostCard from "../components/PostCard";
import instance from "../axios";
import { AuthContext } from "../context/authContext";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { currentUser } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handlePostCardButtonClick = async (postId) => {
    let isError = false;

    try {
      const apiUrl = `/api/users/post-signups/${postId}`;

      await instance.delete(apiUrl);
    } catch (err) {
      isError = true;
      console.error("Error unsubscribing activtiy:", err);
      setError("Error unsubscribing activtiy. Please try again later.");
    }

    if (!isError) await fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiUrl = `/api/users/post-signups`;
      const res = await instance.get(apiUrl);
      setPosts(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error fetching data. Please try again later.");
      setLoading(false);
    }
  };

  const updateUserProfileImg = (img) => {
    currentUser.img = img;

    localStorage.setItem("user", JSON.stringify(currentUser));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {error ? (
        <p>Error: {error}</p>
      ) : loading ? (
        <p>Loading...</p>
      ) : (
        <div className="user-profile-pg ">
          <div className="allChildrenCenter d-flex justify-content-center align-items-center">
            <UserAvatar
              profileImg={currentUser.img}
              onAvatarUpdate={updateUserProfileImg}
            />
          </div>

          <div className="allChildrenCenter my-3 text-center">
            <Link to="/update-password">Uppdatera lösenord</Link>
          </div>

          <div className="user-post-signups">
            <h3 className="text-center">Registreringar för aktiviteter</h3>
            {posts.length > 0 ? (
              <Container>
                <Row xs={1} sm={1}>
                  {posts.map((post, idx) => {
                    return (
                      <Col key={idx}>
                        <PostCard
                          post={post}
                          onButtonClick={handlePostCardButtonClick}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </Container>
            ) : (
              <h6 className="text-center">Inga prenumerationer hittades!</h6>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
