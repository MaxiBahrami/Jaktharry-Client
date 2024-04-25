import React, { useContext, useEffect, useState } from "react";
import UserAvatar from "../components/UserAvatar";
import "../assets/styles/userProfile.scss";
import PostCard from "../components/PostCard";
import instance from "../axios";
import { AuthContext } from "../context/authContext";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const { currentUser } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);


  const handlePostCardButtonClick = async (postId) => {
    let isError = false;
    console.log("/////////////")
    try {
      const apiUrl = `/api/users/post-signups/${postId}`;

      await instance.delete(apiUrl);
    } catch (err) {
      isError = true;
      console.error("Error unsubscribing activtiy:", err);
    }

    if (!isError) await fetchData();
  };

  const updateUserProfileImg = (img) => {
    currentUser.img = img;

    localStorage.setItem("user", JSON.stringify(currentUser));
  };

  const fetchData = async (user) => {
    const userId = user.id;
    console.log("------------")
    try {
      if (userId) {
        // Fetch activities associated with the user ID
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/users/user-activity?userId=${userId}`;
        const res = await axios.get(apiUrl);
        const items = res.data.data;
  
        if (items.length > 0) {
          // Check if data is not empty
          setPosts(items); // Set the posts state
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  
  useEffect(() => {
    console.log("1111111111111")
    if (currentUser) {

      fetchData(currentUser);
    }
  }, [currentUser]);
  
  return (
    <>
      <div className="user-profile-pg w-100">
        <div className="row mt-5 mx-auto w-75 bg-light">
          <div className="allChildrenCenter d-flex justify-content-center align-items-center col col-4">
            <UserAvatar
              profileImg={currentUser.img}
              onAvatarUpdate={updateUserProfileImg}
            />
          </div>
          <div className="userInfo col col-6 mx-4">
            <p className="text-start  mt-3" style={{ fontSize: '15px' }}><strong>Användarnamn: </strong><span> ... {currentUser.firstName} {currentUser.lastName}</span></p>
            <p className="text-start" style={{ fontSize: '15px' }}><strong>E-post: </strong>{currentUser.email}</p>
            <p className="text-start" style={{ fontSize: '15px' }}><strong>Telefon: </strong>0{currentUser.phone}</p>
            <p className="text-start" style={{ fontSize: '15px' }}><strong>Medlemsnr: </strong>#{currentUser.membershipNo}</p>
            <div className="allChildrenCenter my-3">
              <Link to="/update-password">Uppdatera ditt lösenord</Link>
            </div>
          </div>
        </div>

          <div className="user-post-signups mt-5">
            <h3>Aktiviteter som du registrerat dig i</h3>
            {posts.length > 0 ? (
              <Container className="m-3">
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
    
    </>
  );
};

export default UserProfile;