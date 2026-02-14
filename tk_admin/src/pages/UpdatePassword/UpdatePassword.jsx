import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./UpdatePassword.scss";
import { Context } from "../../context/Context";
import { useContext } from "react";

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:3000/api/auth/update-password",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        { withCredentials: true } 
      );

      if (response.data.success) {
        toast.success(response.data.message || "Password updated successfully!");
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      console.log(error)
      toast.error(
        error.response?.data?.message || "Failed to update password"
      );
    }
  };

  return (
    <div className="updatePassword">
      <h1>Update Password</h1>
      <div className="updatePasswordContainer">
        <div className="updatePasswordContainerWrapper bg-primary">
          <form onSubmit={handleSubmit}>
            <div className="formData">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                placeholder="Enter Current Password"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="formData">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                name="newPassword"
                placeholder="Enter New Password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="formData">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
