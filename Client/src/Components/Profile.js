import React, { useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaCog } from 'react-icons/fa';

const Profile = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="profile-container">
      <div className="profile-column profile-background">
        <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="profile-picture"
        />
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        </div>
      </div>
      <div className="profile-column column_2">
        <h2>Jaon Rono</h2>
        <p>Email: joandoe@example.com</p>
        <p>Location: Karen, Nairobi</p>
        <p>Website: <a href="https://joandoe.com" target="_blank" rel="noopener noreferrer">johndoe.com</a></p>
      </div>
      <div className="profile-column settings">
        <FaCog onClick={toggleMenu} />
        {showMenu && (
          <div className="settings-menu">
            <p>Update Profile</p>
            <p>Update Password</p>
            <p>Logout</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
