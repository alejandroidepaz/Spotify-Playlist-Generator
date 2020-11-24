import React from 'react';
import '../styling/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Switch, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import NavigationBar from './Nav';
import Login from './Login';
import Error from './Error';
import About from './About';
import Donate from './Donate';
import ProfilePreview from './ProfilePreview';

const Router = () => {
  return (
    <ScrollToTop>
      <Switch>
        <Route exact path="/profile" component={ProfilePreview}></Route>
        <Route exact path="/error" component={Error}></Route>
        <Route exact path="/about" component={About}></Route>
        <Route exact path="/donate" component={Donate}></Route>
        <Route exact path="/" component={Login}></Route>
      </Switch>
    </ScrollToTop>
  );
}

function App() {
  return (
    <div className="App">
      <NavigationBar />
      <Router />
    </div>
  );
}

export default App;