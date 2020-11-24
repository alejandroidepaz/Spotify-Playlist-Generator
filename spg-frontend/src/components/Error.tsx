import React from 'react';
import '../styling/App.css';
import 'bootstrap/dist/css/bootstrap.css';

function Error() {
  return (
    <div className="Page">
      <div className="jumbotron">
        <h1 className="display-1">Oops!</h1>
        <h1 className="display-4">We encountered an unexpected error.</h1>
        <a href="/">Back to home</a>
      </div>
    </div>
  );
}

export default Error;
