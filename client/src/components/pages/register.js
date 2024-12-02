import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({});

  function handleChange(e) {
    try {
      e.preventDefault();
      let { value, name } = e.target;
      setNewUser({ ...newUser, [name]: value });
      // console.log(`Updated ${name}: ${value}`);
    } catch (error) {
      console.log(`Error updating input: ${error}`);
    }
  }

  const register = async () => {
    try {
      const { firstName, lastName, email, password, password2 } = newUser;

      if (!firstName || !lastName || !email || !password || !password2) {
        return alert("front: All fields are required");
      }
      if (password !== password2) {
        return alert("Both passwords don't match");
      }
      let response = await axios.post("http://localhost:8080/users/register", {
        firstName,
        lastName,
        email,
        password,
      });
      //   console.log(response);

      if (response.status === 200 || response.status === 201) {
        // console.log("Registration successful:", response.data);
        localStorage.setItem("token", response.data.token);
        alert(response.data.message);
      } else {
        console.warn("Unexpected navigating error response:", response);
      }

      navigate("/");
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200
        console.error(
          "Server responded with error:",
          error.response.data.message
        );
        alert(error.response.data.message); // Show the backend error message
      } else {
        // Other errors (e.g., network issues)
        console.error("Unexpected error from handling register:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };
  return (
    <div>
      <input
        type="text"
        name="firstName"
        value={newUser.firstName}
        placeholder="First name"
        onChange={handleChange}
      />
      <input
        type="text"
        name="lastName"
        value={newUser.lastName}
        placeholder="Last name"
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        value={newUser.email}
        placeholder="Email"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        value={newUser.password}
        placeholder="Password"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password2"
        value={newUser.password2}
        placeholder="Confirm password"
        onChange={handleChange}
      />
      <button onClick={register}>Register</button>
      <p>
        Have an account?{" "}
        <a onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>
          Log In
        </a>
      </p>
    </div>
  );
}

export default Register;