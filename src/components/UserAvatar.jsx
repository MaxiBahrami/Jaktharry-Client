import React from "react";

const UserAvatar = ({ profileImg }) => {
  return (
    <div
      className="user-avi"
      style={{ backgroundImage: `url(${profileImg || ""})` }}
    ></div>
  );
};

export default UserAvatar;
