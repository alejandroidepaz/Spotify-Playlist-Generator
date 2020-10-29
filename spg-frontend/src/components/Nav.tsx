import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'; 

const NavigationBar = () => {

    return(
        <div>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#home">Spotify VibeCheck</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#link">About</Nav.Link>
                    <Nav.Link href="#link">Donate</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
};

export default NavigationBar;