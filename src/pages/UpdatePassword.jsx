import React, { useState } from "react";
import "../assets/styles/updatePassword.scss";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UpdatePassword = () => {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password must match");
      return;
    }

    setIsLoading(true);

    try {
      const data = {
        oldPassword,
        newPassword,
        confirmPassword,
      };

      await axios.put(
        `${process.env.REACT_APP_API_URL}/users/update-password`,
        data
      );

      setMessage("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      navigate("/");
    } catch (err) {
      setMessage(err?.response?.data || "Error updating your password");
      setIsLoading(false);
    }
  };

  return (
    <div className="password-update-form-container">
      <h2>Password Update</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleUpdatePassword}>
        <div className="form-group">
          <label htmlFor="oldPassword">Old Password:</label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          Update Password
        </Button>
      </form>
    </div>
  );
};

export default UpdatePassword;
