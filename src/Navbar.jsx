import React, { useState, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';
import { useUser } from './UserContext';
import './Navbar.css';
import axios from 'axios';

const backendUrl =  process.env.REACT_APP_BACKEND_URL;

function Navbar() {
    const [user, setUser] = useState(null);
    const { setUserEmail } = useUser();
    useEffect(() => {
        
    
    // Function to fetch user info from the server
    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`${backendUrl}/user-info`, {
                method: 'GET',
                credentials: 'include', // Include credentials to send cookies with the request
            });
	
            if (!response.ok) {
		console.log(response);
                throw new Error('Failed to fetch user info');
            }

            const data = await response.json();
            const { email } = data;
            setUser({ email });
            setUserEmail(email);

            // Initialize WhatsApp client after fetching user info
             // Replace with actual token retrieval logic
            initializeWhatsAppClient(email);

        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };


    fetchUserInfo();
}, [setUserEmail]);

    const initializeWhatsAppClient = (email) => {
        axios.post(`${backendUrl}/initialize`, { email })
            .then(response => {
                console.log(response.data);
                if (response.data.success) {
                    // Open the created Google Sheet in a new tab
                    window.open(response.data.url, '_blank');
                } else {
                    console.error('Failed to initialize WhatsApp client');
                }
            })
            .catch(error => console.error('Error initializing client:', error));
    };

    // Function to handle client disconnection
    const handleClientDisconnection = async () => {
        try {
            const encodedEmail = encodeURIComponent(user.email);
            await fetch(`${backendUrl}/disconnect/${encodedEmail}`, {
                method: 'POST',
                credentials: 'include', // Include credentials to send cookies with the request
            });
        } catch (error) {
            console.error('Error disconnecting client:', error);
        }
    };

    // Function to handle login
    const handleLogin = () => {
        window.location.href = `${backendUrl}/auth`;
    };

    // Function to handle logout
    const handleLogout = () => {
        handleClientDisconnection(); // Notify backend to disconnect client
        googleLogout();
        setUser(null);
        setUserEmail(null);
        console.log('Logout successful!');
    };

    // Fetch user info on component mount if already logged in
    

    return (
        <nav className="navbar">
            <h1>WhatsApp-Archiver</h1>
            <div >
                {user ? (
                    <>

                        <button onClick={handleLogout} className="google-login-button">{user.email}</button>
                    </>
                ) : (
                    <button onClick={handleLogin} className="google-login-button">
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
