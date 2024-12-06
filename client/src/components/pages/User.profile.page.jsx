import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

function UserProfilePage() {
    
    
    
    const [userDetails, setUserDetails] = useState(
        {
            email:"",
            firstName:"",
            lastName:"",
            password:"",

        }
    );
    
    

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
                setUserDetails(res.data.user);
                
            } catch (error) {
                console.log("Failed to fetch user details.")
            }
        }
        console.log(userDetails);

    return ( 
        <>
        <div>
            <div className="firstName">
                <p>First name: {userDetails.firstName}</p>
            </div>
            <div className="lastName">
                <p>First name: {userDetails.lastName}</p>

            </div>
            <div className="password">
                <p>password: {userDetails.password.replace(/./g, '*')}</p>
            </div>
            <div className="Email">
                <p>Email: {userDetails.email}</p>
            </div>
        </div>
        </>
     );
}

export default UserProfilePage;