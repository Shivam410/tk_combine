import "./Profile.scss";
import { Context } from "../../context/Context";
import { useContext } from "react";

import {Link} from "react-router-dom"

const Profile = () => {
  const { user } = useContext(Context);

  return (
    <div className="profile">
      <h1>Profile</h1>

      <div className="settingsWrapper">
        <div className="profileData">
          <div className="right">
            <div className="profileName">
              <h3>{user?.user?.name}</h3>
            </div>
            <div className="profileEmail">
              <p>{user?.user?.email}</p>
            </div>
           
          </div>
          <Link to={"/update-password"}>
            <p className="changePwd">Change Password</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
