import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import del from "../img/del.png";
import edit from "../img/edit.png";
import plus from "../img/plus.png";
// import group from "../img/group.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext.js";

export const TabContent7 = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/posts?cat=aktiviteter`;
        const res = await axios.get(apiUrl);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

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
  
      // Create headers with the Authorization header
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

export const TabContent8 = () => {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [reloadData, setReloadData] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) { 
          // Fetch activities associated with the user ID
          const apiUrl = `${process.env.REACT_APP_API_URL}/api/users/user-activity?userId=${userId}`;
          const res = await axios.get(apiUrl);
          const items = res.data.data;

          if (items.length > 0) { // Check if data is not empty
            setPosts(items);  // Set the posts state
          } 
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [userId, reloadData]); 

  const handleClick = (postId) => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    window.open(postUrl, '_blank');
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSearch = async () => {
    try {
      // Fetch user ID based on the entered username
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/users/check?username=${username}`;
      const res = await axios.get(apiUrl);
      const userData = res.data;
      if (userData.userExists) {
        // If user found, set the user ID
        setUserId(userData.userId);
      } else {
        // If user not found, handle appropriately (e.g., show error message)
        console.log("Användaren hittades inte");
        window.confirm("Användaren hittades inte .. Verifiera användarnamnet");
      }
    } catch (error) {
      console.error("Error searching for user:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleDelete = async (post) => {
    try {
      // Ask for confirmation before deleting
      const confirmDelete = window.confirm("Är du säker på att du vill radera denna aktivitet?");
      if (!confirmDelete) return;
  
      // Retrieve the token from local storage
      const token = localStorage.getItem('accessToken');
  
      // Create headers with the Authorization header
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

  const handleAdd = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionSelect = async (option) => {
    setSelectedOption(option.title); 
    const postId = option; 

    setShowOptions(false);

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/signup/status2?postId=${postId}&userId=${userId}`);
    const exist = response.data.exists;

    if (!exist) {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/adminsignup`, { postId: postId, userId: userId });
        setReloadData(prev => !prev);
        window.alert("Perfect ... Du är registrerad för denna aktivitet");
    } else {
        console.error("User already signed up for this post");
        window.alert("Du är redan registrerad för denna aktivitet");
    }
};

  useEffect(() => {
    const fetchOptionsFromDatabase = async () => {
      try {
        // Fetch options from the database
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/posts?cat=aktiviteter`;
        const res = await axios.get(apiUrl);
        const optionsData = res.data;
        setOptions(optionsData); // Set the options state
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptionsFromDatabase();
  }, []);

  return (
    <div className="PostClass PostClass8" >
      <label className="form-label labelClass"  htmlFor="form1">Ange användarnamnet</label>
      <input className="inputClass" type="search" value={username} onChange={handleUsernameChange} onKeyDown={handleKeyDown} />
      <button className="btnClass" onClick={handleSearch}>Sök</button>
      
      <h4>Användare är registrerad i dessa aktiviteter</h4>

      {userId && (
        <div className="btnDiv">
          <button className="btnClass2" onClick={handleAdd}>
            <img src={plus} alt="" className="iconClass1" />
            <span>Lägg till aktivitet</span>
          </button>
          {showOptions && (
            <div>
              <ul className="ulclass">
                {options.map((option, index) => (
                  <li className="liOptions" key={index} onClick={() => handleOptionSelect(option.id)}>
                    <Link>{option.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selectedOption && <p>Selected option: {selectedOption}</p>}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th width="10%">#</th>
              <th width="20%">Datum</th>
              <th width="40%">Titel</th>
              <th width="10%">Ta bort</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={post.id}>
                <td width="10%">{index + 1}</td>
                <td width="20%">{moment(post.date).format("LL")}</td>
                <td width="40%">
                  <Link className="titleClass" onClick={() => handleClick(post.id)}>{post.title}</Link>
                </td>
                <td width="10%">
                  <Link to="" onClick={() => handleDelete(post)}>
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

export const TabContent9 = () => {
  // Add functionality for Tab pane content 9
  return (
    <div>
      {/* Content for Tab pane content 9 */}
      <p>Content for Tab pane content 9</p>
    </div>
  );
};




export const TabContent10 = () => {
  // Add functionality for Tab pane content 10
  return (
    <div>
      {/* Content for Tab pane content 10 */}
      <p>Content for Tab pane content 10</p>
    </div>
  );
};

export const TabContent11 = () => {
  // Add functionality for Tab pane content 11
  return (
    <div>
      {/* Content for Tab pane content 11 */}
      <p>Content for Tab pane content 11</p>
    </div>
  );
};

export const TabContent12 = () => {
  // Add functionality for Tab pane content 12
  return (
    <div>
      {/* Content for Tab pane content 12 */}
      <p>Content for Tab pane content 12</p>
    </div>
  );
};
