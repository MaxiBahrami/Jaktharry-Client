import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";
import del from "../img/del.png";
import { Link } from "react-router-dom";

export const TabContent11 = ({ kretsar }) => {
  return(
    <div>
      <h5>sssssssssssss</h5>
    </div>
  )
}

export const TabContent12 = () => {
  const [comments, setComments] = useState([]);
  const [membershipNo, setMembershipNo] = useState("");
  const [userId, setUserId] = useState(null);
  const [userInformation, setUserInformation] = useState(null);
  const [reloadData, setReloadData] = useState(false);

  const fetchData = async (userId) => {
    
    setReloadData(true);

    if (!userId) {
      setReloadData(false);
      return;
    }

    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/comments/userComment/${userId}`;

      const res = await axios.get(apiUrl);

      if (res.data) {
        const items = res.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setComments(items);
      } else {
        console.log("No data found");
      }
    } catch (err) {
      console.error(
        "Error fetching data:",
        err.response ? err.response.data : err.message
      );
      window.alert(
        "Ett fel uppstod vid hämtning av data. Vänligen försök igen senare."
      );
    } finally {
      setReloadData(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData(userId);
    }
  }, [userId]);

  const handleMembershipNoChange = (event) => {
    setMembershipNo(event.target.value);
  };

  const handleSearch = async () => {
    try {
      // Fetch user ID based on the entered username
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/users/check?membershipNo=${membershipNo}`;
      const res = await axios.get(apiUrl);

      if (res.data.userExists) {
        // If user found, set the user ID
        const user = res.data.result[0];
        setUserId(user.id);
        setUserInformation(user);
      } else {
        window.confirm(
          "Medlemsnumret hittades inte .. Verifiera medlemsnumret"
        );
      }
    } catch (error) {
      console.error("Error searching for user:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleDelete = async (commentId) => { 
    try {
      // Ask for confirmation before deleting
      const confirmDelete = window.confirm(
        "Är du säker på att du vill radera denna kommentaren?"
      );
      if (!confirmDelete) return;

      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}` };

      const apiUrl = `${process.env.REACT_APP_API_URL}/api/comments/delete/${commentId}`;

      await axios.delete(apiUrl, { headers });
      fetchData(userId);

    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleVisibilityChange = async (commentId, value) => {
    
    if (value === "Dölj") {
      value = "hide";
    } else if (value === "Visa") {
      value = "show";
    }

    try {

      const apiUrl = `${process.env.REACT_APP_API_URL}/api/comments/updateVisibility`;
      await axios.put(apiUrl, { commentId, value });
  
      if (userId) {
        fetchData(userId);
      }
  
    } catch (error) {
      // Handle error
      console.error('Error updating visibility status:', error.response ? error.response.data : error.message);
      window.alert('Ett fel uppstod vid uppdatering av synlighet. Vänligen försök igen senare.');
    }
  };

  return (
    <div className="PostClass PostClass8">
      <label className="form-label labelClass" htmlFor="form1">
        Ange medlemsnr
      </label>
      <input
        className="inputClass"
        type="search"
        value={membershipNo}
        onChange={handleMembershipNoChange}
        onKeyDown={handleKeyDown}
      />

      <button className="btnClass" onClick={handleSearch}>
        Sök
      </button>
      {reloadData && <p>Loading...</p>}
      {userInformation && (
        <div className="userInfo">
          <p className="text-start ps-5 mt-3" style={{ fontSize: "13px" }}>
            <strong>Användarnamn: </strong>
            <span>
              {" "}
              ... {userInformation.firstName} {userInformation.lastName}
            </span>
          </p>
          <p className="text-start ps-5" style={{ fontSize: "13px" }}>
            <strong>E-post: </strong>
            {userInformation.email}
          </p>
          <p className="text-start ps-5" style={{ fontSize: "13px" }}>
            <strong>Telefon: </strong>0{userInformation.phone}
          </p>
          <p className="text-start ps-5" style={{ fontSize: "13px" }}>
            <strong>Medlemsnr: </strong>#{userInformation.membershipNo}
          </p>
          <h5>{userInformation.username} kommentarer</h5>
        </div>
      )}
      {!userInformation && (
        <div>
          <h5 className="my-3">Användarkommentarer</h5>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th width="10%">Post-id</th>
              <th width="20%">Datum</th>
              <th width="40%">Kommentarer</th>
              <th width="15%">dölj/visa</th>
              <th width="10%">Ta bort</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.id}>
                <td width="10%">{comment.postId}</td>
                <td width="20%">{moment(comment.date).format("LL")}</td>
                <td width="40%">
                  <p className="titleClass">{comment.comments}</p>
                </td>
                <td width="15%">
                  {comment.Visibility === "show" ? (
                    <span>syns </span>
                  ) : (
                    <span>dold </span>
                  )}
                  <span>
                  <select onChange={(e) => handleVisibilityChange(comment.id, e.target.value)} >
                    <option value="Dölj">Dölj</option>
                    <option value="Visa">Visa</option>
                  </select>
                  </span>
                </td>
                <td width="10%">
                <Link to="" onClick={() => handleDelete(comment.id)}>
                  <img src={del} alt="delete" className="iconClass2" />
                </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const TabContent13 = () => {
  const [posts, setPosts] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [error, setError] = useState(null);
  const [activityInformation, setActivityInformation] = useState(null); 
  const [allActivities, setAllActivities] = useState([]);
  const [getPostRes, setgetPostRes] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/posts?cat=aktiviteter`;
        const res = await axios.get(apiUrl);
        const sortedPosts = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));

      setPosts(sortedPosts);
      setAllActivities(sortedPosts); 
      return 
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching activities. Please try again later.");
      }
    };
    fetchData();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [selectedActivity]);

  const fetchCommentData = async () => {
    try {
      // making request too get the comment data of news post
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/comments/get/${selectedActivity}`
      );
      setgetPostRes(response.data);
      if (allActivities.length > 0) {
        const selectedActivityObj = allActivities.find(activity => activity.postId.toString() === selectedActivity);
        
        if (selectedActivityObj) {
          setActivityInformation(selectedActivityObj);
        }
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Error fetching users. Please try again later.");
    }
  };

  const handleOptionSelect = (e) => {
    setSelectedActivity(e.target.value);
  };

  const handleVisibilityChange = async (commentId, value) => {
    
    if (value === "Dölj") {
      value = "hide";
    } else if (value === "Visa") {
      value = "show";
    }

    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/comments/updateVisibility`;
      await axios.put(apiUrl, { commentId, value });
  
      fetchCommentData();
  
    } catch (error) {
      // Handle error
      console.error('Error updating visibility status:', error.response ? error.response.data : error.message);
      window.alert('Ett fel uppstod vid uppdatering av synlighet. Vänligen försök igen senare.');
    }
  };

  return (
    <div className="PostClass PostClass9">
      <h3 className="labelClass" htmlFor="form1">
        Välj aktivitetens namn
      </h3>
      <select className="inputClass" onChange={handleOptionSelect}>
        <option>Välj en aktivitet</option>
        {posts.map((activity, index) => (
          <option key={index} value={activity.postId}>
            {activity.title}
          </option>
        ))}
      </select>
      <button className="btnClass" onClick={fetchCommentData}>
        Sök
      </button>
      <div>
        {error && <p>Error: {error}</p>}{" "}
        {activityInformation && (
        <div className="userInfo">
          <p className="text-start ps-3 mt-3"><strong>Aktivitetstitel: </strong><br />
          <span className="text-success ms-5">{activityInformation.title}</span></p>
          <ul className="list-group text-start mb-3 ms-5 w-75">
            <li className="list-group-item userClass text-danger">
              <span><b>Aktivitetsstatus: </b></span>
              {activityInformation.status}
            </li>
            <li className="list-group-item userClass">
              <span><b>Aktiviteten äger rum i: </b></span>
              {moment(activityInformation.adminDate).format("LL")}
            </li>
            <li className="list-group-item userClass">
              <span><b>Sista dag för anmälan: </b></span>
              {moment(activityInformation.deadline).format("LL")}
            </li>
            <li className="list-group-item userClass">
            <span><b>Antal registrerade användare: </b></span>
              {activityInformation.total}
            </li>
            <li className="list-group-item userClass">
            <span><b>Pris: </b></span>
              {activityInformation.price}
            </li>
            <li className="list-group-item userClass">
            <span><b>Totalt tillåtet antal att registrera: </b></span>
              {activityInformation.spots}
            </li>
          </ul>
          <h4 className="text-success">Kommentarer till detta inlägg</h4>
        </div>
        )}
        {!activityInformation && <div>
        <h5 className="my-3">Kommentarer till detta inlägg</h5>
          </div>}
      </div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th width="10%">Medlemsnr</th>
              <th width="15%">Datum</th>
              <th width="20%">Användarnamn</th>
              <th width="30%">Kommentarer</th>
              <th width="15%">dölj/visa</th>
            </tr>
          </thead>
          {getPostRes && getPostRes.map((comment,index)=>(
          <tbody key={comment.id}>
              <tr >
                <td width="10%">#{comment.membershipNo} </td>
                <td width="15%">{moment(comment.commentDate).calendar()}</td>
                <td width="20%">{comment.userName}</td>
                <td width="30%" className="text-start">{comment.comments}</td>
                <td width="15%">
                  {comment.Visibility === "show" ? (
                    <span>syns </span>
                  ) : (
                    <span>dold </span>
                  )}
                  <span>
                  <select onChange={(e) => handleVisibilityChange(comment.id, e.target.value)} >
                    <option value="Dölj">Dölj</option>
                    <option value="Visa">Visa</option>
                  </select>
                  </span>
                </td>
              </tr>
              
          </tbody>
        ))}
        </table>
      </div>

    </div>
  );
};