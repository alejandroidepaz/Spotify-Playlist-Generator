import React from 'react';
import '../styling/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import LoginForm from './Login';

function Home() {
  return (
    <div className="App">
      <LoginForm />
    </div>
  );
}

export default Home;
