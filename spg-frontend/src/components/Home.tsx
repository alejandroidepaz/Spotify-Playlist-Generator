import React from 'react';
import '../styling/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import LoginForm from './Login';

function Home(props) {
  return (
    <div className="Page">
      <LoginForm location={props.location} />
    </div>
  );
}

export default Home;
