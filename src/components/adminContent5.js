import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";
import del from "../img/del.png";
import { Link } from "react-router-dom";
import "react-datetime/css/react-datetime.css";

export const TabContent16 = () => {
  return (
    <div>
      <h3>Admin meddelanden</h3>
    </div>
  );
};

export const TabContent17 = () => {
  return (
    <div>
      <h3>Mod meddelanden</h3>
    </div>
  );
};

export const TabContent18 = () => {
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

  // const handleClick = (postId) => {
  //   const postUrl = `${window.location.origin}/post/${postId}`;
  //   window.open(postUrl, "_blank");
  // };

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
                  <select onChange={(e) => handleVisibilityChange(comment.id, e.target.value)}>
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

export const TabContent19 = () => {
  return (
    <div>
      <h3>Inläggets kommentarer</h3>
    </div>
  );
};
