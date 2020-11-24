import React from 'react';
import '../styling/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Jumbotron from 'react-bootstrap/esm/Jumbotron';

const Donate = () => {
  return (
    <div className="Page">
      <Jumbotron style={{ textAlign: 'center' }}>
        <h1 className="display-3">Donate</h1>
        <p>
          If you enjoy Spotify Moods, consider supporting development by <a href="https://buymeacoff.ee/taylorrgriffin">buying us a cup of coffee</a>.
        </p>
        <p>
          We provide Spotify Moods for free without ads, and donations help us cover server costs.
        </p>
      </Jumbotron>
    </div>
  );
}

export default Donate;