import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

interface Credentials{
    access_token: String, 
    refresh_token: String
}

interface Props {
    params: Credentials
}

const ProfilePreview = (props) =>{
    const params = new URLSearchParams(props.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const displayName = params.get('name');

    console.info(`Access Token: ${accessToken}`);
    console.info(`Refresh Token: ${refreshToken}`);
    console.info(`Display Name: ${displayName}`);
    return (
        <div className="profile">
            <h1>{displayName}</h1>        
        </div>
    );
}

export default ProfilePreview;