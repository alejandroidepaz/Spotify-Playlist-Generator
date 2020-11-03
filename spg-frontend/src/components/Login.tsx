import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';

import Jumbotron from 'react-bootstrap/Jumbotron';
import logo from '../assets/logo.svg';

const LoginForm = () => {

    return (
        <Jumbotron>
            <img src={logo} className="App-logo" alt="logo" />
            <h1>Spotify Moods</h1>
            <p>
            Welcome! Log in to your Spotify account to instantly categorize your 
            songs into organized playlists based on their vibe. 
            </p>
            <Button variant="outline-success" onClick={() => {
                window.location.href = "http://localhost:8000/login";
            }}>
            <FontAwesomeIcon icon={faSpotify}/>    Log In
            </Button>
        </Jumbotron>
    )
}

export default LoginForm;