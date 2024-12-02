import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [loggedData, setLoggedData] = useState({});

  function handleChange(e) {
    try {
      e.preventDefault();
      let { value, name } = e.target;
      setLoggedData({ ...loggedData, [name]: value });
      // console.log(`Updated ${name}: ${value}`);
    } catch (error) {
      console.log(`Error updating input: ${error}`);
    }
  }
  const logIn = async () => {
    try {
      const { email, password } = loggedData;

      if (!email || !password) {
        return alert("Both fields are required");
      }

      let response = await axios.post(
        `http://localhost:8080/users/login`,
        loggedData
      );

      if (response.status === 200 || response.status === 201) {
        // console.log("Registration successful:", response.data);
        localStorage.setItem("token", response.data.token);
        alert(response.data.message);

        navigate("/");
      } else {
        console.warn("Unexpected navigating error response:", response);
      }
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
        type="email"
        name="email"
        value={loggedData.email}
        placeholder="Email"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        value={loggedData.password}
        placeholder="Password"
        onChange={handleChange}
      />
      <button onClick={()=>logIn()}>Log In</button>
      <p>
        Doesn't have an account?{" "}
        <a onClick={() => navigate("/register")} style={{ cursor: "pointer" }}>
          Register Now
        </a>
      </p>







      
    </div>



  );
}

export default Login;