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


  const handleEnter = (e) => {
    if (e.key === "Enter") {
       logIn();
    }
  };

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

        console.error(
          "Server responded with error:",
          error.response.data.message
        );

        alert(error.response.data.message); // backend-error

      } else {
        // Other errors (e.g., network issues)
        console.error("Unexpected error from handling register:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  //backdrop-blur-md bg-transparent shadow-[10px_0_15px_rgba(0,0,0,0.3)]
  // dark blue bg-[#212735]  //dark gold #C6B796// bright gold #FAEAB6 // expenses #101e40
  return (
    <div className="min-w-screen min-h-screen bg-[#212735] ">
      <h1 className="flex justify-center pt-10  font-bold text-[#C6B796] whitespace-nowrap ">
        <span className="text-6xl sm:text-7xl   px-1">
          Cash
          <span className="inline-block h-[45px] w-[45px] sm:w-[57px] sm:h-[57px]  mx-1 overflow-hidden rounded-full scale-110">
            <img
              src="/assets/Logo1.webp"
              alt="logo"
              className="w-full h-full object-cover object-center"
            />
          </span>
          ver
        </span>
        <span className="  transform ml-[-20px] sm:ml-[-25px] pt-12 sm:pt-16 text-xl font-bold text-[#FAEAB6] ">
          F<span className="text-white">L</span>O
          <span className="text-white">W</span>
        </span>
      </h1>

      <div className=" shadow-[10px_10px_6px_rgba(250,234,182,0.2)] w-[300px] sm:w-[400px] lg:w-[450px] text-[#101e40] h-[300px] sm:h-[400px] 
      flex flex-col items-center justify-center gap-5 mx-auto mt-20 p-5 bg-[#c6b796]   rounded ">
      <h2 className="sm:text-2xl lg:text-3xl">Login</h2>
        <input
          type="email"
          name="email"
          value={loggedData.email}
          placeholder="Email"
          onChange={handleChange}
          className="bg-[#C6B796]  border border-[#101e40] sm:text-xl lg:text-2xl"
          onKeyDown={handleEnter}
        />
        <input
          type="password"
          name="password"
          value={loggedData.password}
          placeholder="Password"
          onChange={handleChange}
          className="bg-[#C6B796]  border border-[#101e40] sm:text-xl lg:text-2xl"
          onKeyDown={handleEnter}
        />
        <button
          className="w-[195px] sm:w-[245px] lg:w-[294px] bg-[#101e40] text-[#FAEAB6] sm:text-xl lg:text-2xl hover:scale-105"
          onClick={() => logIn()}
        >
          Log In
        </button>
        <p className="font-light text-xs sm:text-base lg:text-lg italic">
          Don't have an account?{" "}
          <button className="hover:scale-105"
          onClick={() => navigate("/register")}>
            <span className=" text-[#212735]  text-base sm:text-lg lg:text-xl font-bold italic ">
              Sign Up
            </span>
          </button>
        </p>
      </div>

    </div>
  );
}

export default Login;
