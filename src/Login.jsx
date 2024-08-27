import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function Login() {

    const onSuccess = (res) => {
        const decodedToken = jwtDecode(res.credential);
        console.log("login success! Current user: ", decodedToken);
    }

    const onFailure = (res) => {
        console.log("Login Failed! res:", res);
    }

    return (
        <div id="signInButton">
            <GoogleLogin
                clientId={clientId}
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </div>
    )
}

export default Login;
