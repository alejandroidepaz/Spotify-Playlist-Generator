import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';

import Jumbotron from 'react-bootstrap/Jumbotron';
import logo from '../assets/logo.svg';
import Alert from 'react-bootstrap/Alert';

const LoginForm = (props) => {
    const params = new URLSearchParams(props.location.search);
    const [error, setError] = useState(params.get('error'));    

    return (
        <div className="Page">
            { error &&
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    <Alert.Heading>Oops! We encountered an error.</Alert.Heading>
                    <p>
                        Something went wrong while authenticating with Spotify.
                        Please try again later.
                    </p>
                </Alert>
            }
            <Jumbotron style={{ textAlign: 'center' }}>
                <h1 className="display-1">Spotify Moods</h1>
                {/* <img src={logo} className="App-logo" alt="logo" /> */}
                <p>
                    Welcome! Log in to your Spotify account to instantly categorize your 
                    songs into organized playlists based on their vibe. 
                </p>
                <Button size="lg" variant="outline-success" onClick={() => {
                    window.location.href = "http://localhost:8000/login";
                }}>
                <FontAwesomeIcon icon={faSpotify} size="lg"/>    Log In
                </Button>
            </Jumbotron>
        </div>
    )
}

export default LoginForm;