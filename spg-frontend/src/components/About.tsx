import React from 'react';
import '../styling/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Jumbotron from 'react-bootstrap/esm/Jumbotron';
import us from '../assets/us.jpg';

const GitHubLink = ({ name, username }) => (
  <a href={`https://github.com/${username}`}>{name}</a>
);

const About = () => {
  return (
    <div className="Page">
      <Jumbotron style={{ textAlign: 'center' }}>
        <h1 className="display-3">About Spotify Moods</h1>
        <p>
          Spotify Moods is a collaberation between <GitHubLink name="Alejandro De Paz" username="alejandroidepaz" /> and <GitHubLink name="Taylor Griffin" username="taylorrgriffin" />.
        </p>
        <img src={us} style={{ width: 200 }} />
        <p>
          We are software engineers from Portland, OR who are passionate about music and creating delightful user experiences. 
        </p>
        <p>
          This project was made possible by the <a href="https://developer.spotify.com/documentation/web-api/">Spotify API</a>. You can check out the source code <a href="https://github.com/alejandroidepaz/Spotify-Playlist-Generator">on GitHub</a>.
        </p>
      </Jumbotron>
    </div>
  );
}

export default About;