import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({});
  const [image, setImage] = useState(null);  // State to hold the selected image

  function handleChange(e) {
    try {
      e.preventDefault();
      let { value, name } = e.target;
      setNewUser({ ...newUser, [name]: value });
    } catch (error) {
      console.log(`Error updating input: ${error}`);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];  // Get the selected file
    if (file) {
      setImage(URL.createObjectURL(file));  // Create a preview URL
      setNewUser({ ...newUser, image: file });  // Store the file in the state
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      register();
    }
  };

  const register = async () => {
    try {
      const { firstName, lastName, email, password, password2, image } = newUser;

      if (!firstName || !lastName || !email || !password || !password2) {
        return alert("All fields are required");
      }
      if (password !== password2) {
        return alert("Both passwords don't match");
      }

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("image", image);  // Append the image file to the FormData

      let response = await axios.post("http://localhost:8080/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",  
        },
      });

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("token", response.data.token);
        alert(response.data.message);
      } else {
        console.warn("Unexpected navigating error response:", response);
      }

      navigate("/");
    } catch (error) {
      if (error.response) {
        console.error("Server responded with error:", error.response.data.message);
        alert(error.response.data.message);
      } else {
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
        <span className="transform ml-[-20px] sm:ml-[-25px] pt-12 sm:pt-16 text-xl font-bold text-[#FAEAB6] ">
          F<span className="text-white">L</span>O
          <span className="text-white">W</span>
        </span>
      </h1>

      <div className="shadow-[10px_10px_6px_rgba(250,234,182,0.2)] w-[300px] sm:w-[400px] lg:w-[450px] text-[#101e40] h-[400px] sm:h-[500px] lg:h-[550px] flex flex-col items-center justify-center gap-5 mx-auto mt-20 p-5 bg-[#C6B796] rounded ">
        <h2 className="sm:text-2xl lg:text-3xl">Register</h2>

        <input
          type="text"
          name="firstName"
          value={newUser.firstName}
          placeholder="First name"
          onChange={handleChange}
          onKeyDown={handleEnter}
          className="bg-[#C6B796]  border border-[#101e40]  sm:text-xl lg:text-2xl"
        />
        <input
          type="text"
          name="lastName"
          value={newUser.lastName}
          placeholder="Last name"
          onChange={handleChange}
          onKeyDown={handleEnter}
          className="bg-[#C6B796]  border border-[#101e40] sm:text-xl lg:text-2xl "
        />
        <input
          type="email"
          name="email"
          value={newUser.email}
          placeholder="Email"
          onChange={handleChange}
          onKeyDown={handleEnter}
          className="bg-[#C6B796]  border border-[#101e40] sm:text-xl lg:text-2xl "
        />
        <input
          type="password"
          name="password"
          value={newUser.password}
          placeholder="Password"
          onChange={handleChange}
          onKeyDown={handleEnter}
          className="bg-[#C6B796]  border border-[#101e40] sm:text-xl lg:text-2xl "
        />
        <input
          type="password"
          name="password2"
          value={newUser.password2}
          placeholder="Confirm password"
          onChange={handleChange}
          onKeyDown={handleEnter}
          className="bg-[#C6B796]  border border-[#101e40] sm:text-xl lg:text-2xl "
        />

        {/* Image upload input */}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="bg-[#C6B796]  border border-[#101e40] sm:text-xl lg:text-2xl "
        />
        {image && <img src={image} alt="preview" className="mt-3 w-24 h-24 object-cover rounded" />}

        <button className="w-[195px] sm:w-[245px] lg:w-[294px] bg-[#101e40] text-[#FAEAB6] sm:text-xl lg:text-2xl hover:scale-105" onClick={register}>
          Register
        </button>
        <p className="font-light text-xs sm:text-base lg:text-lg italic">
          Already have an account?{" "}
          <button className="text-[#212735]  text-base sm:text-lg lg:text-xl font-bold italic hover:scale-110" onClick={() => navigate("/login")}>
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
