import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { gapi } from 'gapi-script';
import QR from './HomePage';
import GeneratePage from './GeneratePage';
import DatePage from './Date';
import { UserProvider } from './UserContext';
import Navbar from './Navbar';


const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: clientId,
                scope: ""
            });
        }

        gapi.load('client:auth2', start);
    }, []); // Add dependency array to ensure this effect runs only once

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <UserProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/qr/:userEmail" element={<QR />} />
                        <Route path="/generate/:userEmail" element={<GeneratePage />} />
                        <Route path="/" element={<DatePage />} />
                        
                    </Routes>
                </Router>
            </UserProvider>
        </GoogleOAuthProvider>
    );
}

export default App;
