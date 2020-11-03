import React from 'react';
import '../styling/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Switch, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import NavigationBar from './Nav';
import Home from './Home';
import ProfilePreview from './ProfilePreview';

const Router = () => {
    return (
        <ScrollToTop>
            <Switch>
                <Route exact path="/profile" component={ProfilePreview}></Route>
                <Route exact path="/" component={Home}></Route>
            </Switch>
        </ScrollToTop>
    );
  };
function App() {
  return (
    <div className="App">
        <NavigationBar />
        <Router />
    </div>
  );
}

export default App;