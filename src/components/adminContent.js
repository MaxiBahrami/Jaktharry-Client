import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";
import del from "../img/del.png";
import edit from "../img/edit.png";
import { Link, useNavigate } from "react-router-dom";

export const TabContent2 = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const handleClick = (postId) => {
    // Navigate to the single post page with the clicked post ID
    navigate(`/post/${postId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/posts`;
        console.log(apiUrl);
        const res = await axios.get(apiUrl);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="PostClass">
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th width="20%">Datum</th>
              <th width="40%">Titel</th>
              <th>kategori</th>
              <th width="10%">Redigera</th>
              <th width="10%">Ta bort</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td width="20%">{moment(post.date).format("LL")}</td>
                <td width="40%">
                <Link className="titleClass" onClick={() => handleClick(post.id)}>{post.title}</Link>
                </td>
                <td>{post.cat}</td>
                <td width="10%">
                  <Link to="/your-link-here">
                    <img src={edit} alt="" className="iconClass1" />
                  </Link>
                </td>
                <td width="10%">
                  <img src={del} alt="" className="iconClass2" />
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

export const TabContent3 = () => {
  // Add functionality for Tab pane content 3
  return (
    <div>
      {/* Content for Tab pane content 3 */}
      <p>Content for Tab pane content 3</p>
    </div>
  );
};

export const TabContent4 = () => {
  // Add functionality for Tab pane content 4
  return (
    <div>
      {/* Content for Tab pane content 4 */}
      <p>Content for Tab pane content 4</p>
    </div>
  );
};

export const TabContent5 = () => {
  // Add functionality for Tab pane content 4
  return (
    <div>
      {/* Content for Tab pane content 5 */}
      <p>Content for Tab pane content 5</p>
    </div>
  );
};

export const TabContent6 = () => {
  // Add functionality for Tab pane content 6
  return (
    <div>
      {/* Content for Tab pane content 6 */}
      <p>Content for Tab pane content 6</p>
    </div>
  );
};

export const TabContent7 = () => {
  // Add functionality for Tab pane content 7
  return (
    <div>
      {/* Content for Tab pane content 7 */}
      <p>Content for Tab pane content 7</p>
    </div>
  );
};

export const TabContent8 = () => {
  // Add functionality for Tab pane content 8
  return (
    <div>
      {/* Content for Tab pane content 8 */}
      <p>Content for Tab pane content 8</p>
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
