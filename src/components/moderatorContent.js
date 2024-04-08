import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import del from "../img/del.png";
import edit from "../img/edit.png";
import circle from "../img/green-circle.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext.js";

export const TabContent2 = ({ kretsar }) => {
  const [posts, setPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!kretsar) {
      setErrorMessage('Det finns ingen tillåtelse att gå in i ett annat krets');
      return;
    }
    const fetchData = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/posts?cat=${kretsar}`;
        const res = await axios.get(apiUrl);
        const sortedPosts = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPosts(sortedPosts);
        setErrorMessage('');
      } catch (err) {
        console.error("Error fetching data:", err);
        setErrorMessage('Error fetching posts.');
      }
    };

    fetchData();
  }, [kretsar]);

  const handleClick = (postId) => {
    // Construct the URL for the single post page with the clicked post ID
    const postUrl = `${window.location.origin}/post/${postId}`;
    
    // Open the URL in a new tab
    window.open(postUrl, '_blank');
  };

  const handleWriteClick = (post) => {
    // Pass the 'post' object as an argument
    navigate("/write", { state: { currentUser, ...post } });
  };

  const handleDelete = async (post) => {
    try {
      // Ask for confirmation before deleting
      const confirmDelete = window.confirm("Are you sure you want to delete this post?");
      if (!confirmDelete) return;
  
      // Retrieve the token from local storage
      const token = localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };
  
      // Perform the delete operation with the Authorization header
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/posts/${post.id}`;
      await axios.delete(apiUrl, { headers });
  
      // Update the UI after successful deletion
      setPosts(posts.filter(p => p.id !== post.id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (errorMessage) {
    return <h5 className="text-danger m-5">{errorMessage}</h5>;
  }

  return (
    <div className="PostClass">
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th width="20%">Datum</th>
              <th width="40%">Titel</th>
              <th>Kategori</th>
              <th width="10%">Redigera</th>
              <th width="10%">Ta bort</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={post.id}>
                <td>{index + 1}</td>
                <td width="20%">{moment(post.date).format("LL")}</td>
                <td width="40%">
                  <Link className="titleClass" onClick={() => handleClick(post.id)}>{post.title}</Link>
                </td>
                <td>{post.cat}</td>
                <td width="10%">
                  {/* Pass 'post' as an argument */}
                  <Link to={`/write?edit=2`} state={post} onClick={() => handleWriteClick(post)}>
                    <img src={edit} alt="" className="iconClass1" />
                  </Link>
                </td>
                <td width="10%">
                  <Link to="" onClick={() => handleDelete(post)}>
                  <img src={del} alt="" className="iconClass2" />
                  </Link>
                </td>
                {/* Add your edit and delete buttons here */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const TabContent5 = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/users`;
        const res = await axios.get(apiUrl);
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const formatLastActivity = (lastActivity) => {
    const now = moment();
    const activityTime = moment(lastActivity);
    const minutesDiff = now.diff(activityTime, "minutes");

    if (minutesDiff < 5) {
      return "Online";
    } else {
      return activityTime.format("LLL"); // Format the timestamp as desired
    }
  };
  const sortedUsers = [...users].sort((a, b) => {
    const isAOnline = formatLastActivity(a.lastActivity) === "Online";
    const isBOnline = formatLastActivity(b.lastActivity) === "Online";
    return isBOnline - isAOnline;
  });

  return (
    <div className="PostClass">
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th width="5%">#</th>
              <th width="20%">Senaste aktivitet</th>
              <th width="20%">Användarnamn</th>
              <th width="30%">e-post</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user, index) => (
              <tr width="5%" key={user.id}>
                <td>{index + 1}</td>
                <td width="20%">
                  {formatLastActivity(user.lastActivity) === "Online" && (
                    <img
                      src={circle}
                      alt="Online"
                      style={{ width: "12px", marginRight: "5px" }}
                    />
                  )}
                  {formatLastActivity(user.lastActivity)}
                </td>
                <td width="20%">{user.username}</td>
                <td width="30%">{user.email} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};