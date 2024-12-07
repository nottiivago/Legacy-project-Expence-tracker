import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

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

  async function handleSaveNewCredentials(e) {
    e.preventDefault();

    const { newPassword, newPasswordConfirmation, oldPassword } = editedUserData;

    // Check if passwords match
    if (newPassword !== newPasswordConfirmation) {
      setError("Passwords don't match!");
      return;
    }
    setError('');

    const userId = userDetails._id;
    try {
      const res = await axios.put(
        `http://localhost:8080/users/updateUser/${userId}`,
        {
          ...editedUserData,
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setUserDetails(res.data.user);
      setEditedUserData(res.data.user);
      setEditForm(false);
      console.log('User updated successfully:', res.data);
    } catch (error) {
      console.log('Failed to update user credentials:', error);
      setError('Failed to update credentials.');
    }
  }

  return (
    <>
      <button onClick={() => setEditForm(!editForm)}>
        {editForm ? 'Cancel' : 'Change credentials'}
      </button>

      {error && <div className="error">{error}</div>}

      {editForm ? (
        <form onSubmit={handleSaveNewCredentials}>
          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={editedUserData.firstName || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={editedUserData.lastName || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="oldPassword">Old Password</label>
            <input
              type="password"
              placeholder="Old Password"
              name="oldPassword"
              value={editedUserData.oldPassword || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              placeholder="New Password"
              name="newPassword"
              value={editedUserData.newPassword || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="newPasswordConfirmation">New Password Confirmation</label>
            <input
              type="password"
              placeholder="Confirm New Password"
              name="newPasswordConfirmation"
              value={editedUserData.newPasswordConfirmation || ''}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Save changes</button>
        </form>
      ) : (
        <div className="d-flex flex-column">
          <div className="firstName d-flex p-2 flex-row mb-3">
            <p>First name: {userDetails.firstName}</p>
          </div>
          <div className="lastName">
            <p>Last name: {userDetails.lastName}</p>
          </div>
          <div className="password">
            <p>Password: ********</p>
          </div>
          <div className="email">
            <p>Email: {userDetails.email}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default UserProfilePage;



