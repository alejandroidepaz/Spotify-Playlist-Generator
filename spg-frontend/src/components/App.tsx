import React from 'react';
import '../styling/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import NavigationBar from './Nav';
import LoginForm from './Login';

function App() {
  return (
    <div className="App">
      <NavigationBar />
      <LoginForm />
    </div>
  );
}

export default App;
