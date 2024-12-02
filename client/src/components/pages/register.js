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
    


      <div className="shadow-[10px_10px_6px_rgba(250,234,182,0.2)] w-[300px] sm:w-[400px] lg:w-[450px] text-[#101e40] h-[400px] sm:h-[500px] lg:h-[550px] flex flex-col items-center justify-center gap-5 mx-auto mt-20 p-5 bg-[#C6B796]   rounded ">
      <input
        type="text"
        name="firstName"
        value={newUser.firstName}
        placeholder="First name"
        onChange={handleChange}
        className="bg-[#C6B796]  border border-[#101e40]  sm:text-xl lg:text-2xl"
      />
      <input
        type="text"
        name="lastName"
        value={newUser.lastName}
        placeholder="Last name"
        onChange={handleChange}
        className="bg-[#C6B796]  border border-[#101e40] sm:text-xl lg:text-2xl "
      />
      <input
        type="email"
        name="email"
        value={newUser.email}
        placeholder="Email"
        onChange={handleChange}
        className="bg-[#C6B796]  border border-[#101e40] sm:text-xl lg:text-2xl "
      />
      <input
        type="password"
        name="password"
        value={newUser.password}
        placeholder="Password"
        onChange={handleChange}
        className="bg-[#C6B796]  border border-[#101e40] sm:text-xl lg:text-2xl "
      />
      <input
        type="password"
        name="password2"
        value={newUser.password2}
        placeholder="Confirm password"
        onChange={handleChange}
        className="bg-[#C6B796]  border border-[#101e40] sm:text-xl lg:text-2xl "
      />
      <button className="w-[195px] sm:w-[245px] lg:w-[294px] bg-[#101e40] text-[#FAEAB6] sm:text-xl lg:text-2xl" onClick={register}>Register</button>
      <p className="font-light text-xs sm:text-base lg:text-lg italic">
       Already have an account?{" "}
        <button className="text-[#212735]  text-base sm:text-lg lg:text-xl font-bold italic" onClick={() => navigate("/login")} >
          Log In
        </button>
      </p>
    </div>
    </div>
  );
}

export default Register;