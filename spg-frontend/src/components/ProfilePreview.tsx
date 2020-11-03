import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';

interface Credentials{
    access_token: String, 
    refresh_token: String
}

interface Props {
    params: Credentials
}

const ProfilePreview = (props) =>{
    const params = new URLSearchParams(props.location.search);
    const imageLink = params.get('image');
    const displayName = params.get('name');
    const profileLink = params.get('profileLink');
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    console.info(imageLink);
    console.info(profileLink);
    console.info(accessToken);
    console.info(refreshToken);

    const history = useHistory();

    return (
        <div className="profile">
            <div style={{ textAlign: 'right', margin: 20 }}>
                <Button variant="outline-danger" onClick={() => {history.push('/')}}>
                    Log Out
                </Button>
            </div>
            <h1>{displayName}</h1>        
        </div>
    );
}

export default ProfilePreview;