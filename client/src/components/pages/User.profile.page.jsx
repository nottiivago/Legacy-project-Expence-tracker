import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import '../../style/user.page.css'; // Import the CSS file

let userValues = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
};

let EditedUserValues = {
  email: '',
  firstName: '',
  lastName: '',
  newPassword: '',
  newPasswordConfirmation: '',
  oldPassword: '',
};

function UserProfilePage() {
  const [userDetails, setUserDetails] = useState(userValues);
  const [editForm, setEditForm] = useState(false);
  const [editedUserData, setEditedUserData] = useState(EditedUserValues);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData({ ...editedUserData, [name]: value });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      // console.log(token);
      fetchUserDetails(userId);
    }
  }, []);

  async function fetchUserDetails(userId) {
    try {
      const res = await axios.get(`http://localhost:8080/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUserDetails(res.data.user);
     
    } catch (error) {
      console.log('Failed to fetch user details.');
    }
  }
  console.log(userDetails.image);
  async function handleSaveNewCredentials(e) {
    e.preventDefault();
    const { newPassword, newPasswordConfirmation, oldPassword } = editedUserData;

    if (newPassword !== newPasswordConfirmation) {
      setError("Passwords don't match!");
      return;
    }
    setError('');

    const userId = userDetails._id;
    try {
      const res = await axios.put(
        `http://localhost:8080/users/updateUser/${userId}`,
        { ...editedUserData, oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setUserDetails(res.data.user);
      setEditedUserData(res.data.user);
      setEditForm(false);
      console.log('User updated successfully:', res.data);
      alert(res.data.msg)
    } catch (error) {
      console.log('Failed to update user credentials:', error);
      setError('Failed to update credentials.');
    }
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-card">
        <h2>{userDetails.firstName} {userDetails.lastName}</h2>



{/** Display user image */}

  <img 
    src={`http://localhost:8080/uploads/${userDetails.image}`} 
    alt={`${userDetails.firstName} ${userDetails.lastName}`} 
    className="user-profile-image" 
  />



        {error && <div className="error">{error}</div>}

        {editForm ? (
          <form onSubmit={handleSaveNewCredentials}>
            <div>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                name="firstName"
                value={editedUserData.firstName || ''}
                onChange={handleChange}
                placeholder={userDetails.firstName}
              />
            </div>
            <div>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={editedUserData.lastName || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="oldPassword">Old Password</label>
              <input
                type="password"
                name="oldPassword"
                value={editedUserData.oldPassword || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={editedUserData.newPassword || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="newPasswordConfirmation">New Password Confirmation</label>
              <input
                type="password"
                name="newPasswordConfirmation"
                value={editedUserData.newPasswordConfirmation || ''}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="save-button">Save changes</button>
          </form>
        ) : (
          <div className="user-info">
            <p><span>First name:</span> {userDetails.firstName}</p>
            <p><span>Last name:</span> {userDetails.lastName}</p>
            <p><span>Email:</span> {userDetails.email}</p>
          </div>
        )}
        <button 
          className="edit-button" 
          onClick={() => setEditForm(!editForm)}
        >
          {editForm ? 'Cancel' : 'Change credentials'}
        </button>
      </div>
    </div>
  );
}

export default UserProfilePage;
