import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

function UserProfilePage() {
    
    
    
    const [userDetails, setUserDetails] = useState({
        email:"",
        firstName:"",

    });
    
    

    useEffect(() => {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        if (token) {
            const decodedToken = jwtDecode(token); // Decode the token to get the user id
            console.log(decodedToken);
            const userId = decodedToken.id; // Assuming your JWT has a userId
            console.log(userId);
            fetchUserDetails(userId); // Fetch user details using userId
        }
    }, []); // Empty dependency array ensures this only runs on mount

    async function fetchUserDetails(userId) {
        try {
            const res = await axios.get(
                `http://localhost:8080/users/${userId}`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }); 
                  console.log(res.data);
                setUserDetails(res.data);
                // console.log(userDetails);
            
            } catch (error) {
                console.log("Failed to fetch user details.")
            }
        }

    return ( 
        <>
        <div>
            <div className="username">
                <p>First name: {userDetails.user.firstName}</p>
            </div>
            <div className="password">
                <p>password: {}</p>
            </div>
            <div className="Email">
                <p>Email: {}</p>
            </div>
        </div>
        </>
     );
}

export default UserProfilePage;