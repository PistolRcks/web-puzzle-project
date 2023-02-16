import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, Modal, Row } from 'react-bootstrap';
import puzzlePiece from "../../assets/puzzle-piece.png";
import "./LandingPage.css";

export default function LandingPage() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = event => {
        event.preventDefault();
        console.log('Form submitted')
    };

    return (
        <div className="app min-vh-100 min-vw-100">
            <Container className="min-vw-100 header-container">
                <div><img src={puzzlePiece} alt="puzzle piece" width="50" height="50" />  Welcome to our Web Puzzle</div>
            </Container>
            <Container className="text-container">
                <h3>This website is made to challenge the user to solve multiple 
                    different puzzles that will require them to learn about the tricks of 
                    websites and the hidden information they carry. Each puzzle will get you 
                    closer to solving the hidden message.
                </h3>
                <br />
            </Container>
            <Container className="text-container">
                <h6>All features of this website are intended; it's not a bug, it's a feature. 
                    Make sure to explore the site in its entirety in order to solve the puzzles.
                </h6>
                <br />
            </Container>
            <Button className="button" onClick={handleShow}>Log In</Button>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Log In
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                    
                        <div className="mb-3">
                        <label>User Name</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter User Name"
                        />
                        </div>
                        <div className="mb-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                        />
                        </div>
                        <div className="mb-3 custom-control custom-checkbox">
                            <input
                            type="checkbox"
                            className="custom-control-input"
                            id="customCheck1"
                            />
                            <label className="custom-control-label" htmlFor="customCheck1">
                            Remember me
                            </label>
                        </div>
                        
                        <p className="create-account">
                        Need to <a href="#">Create Account?</a>
                        </p>

                        </Form> 
                </Modal.Body>
                <Modal.Footer>
                    <Button className="close-button" variant="secondary" onClick={handleClose}>Close</Button>
                    <Link to="/PuzzleSelection">
                        <Button className="button" variant="primary" type="submit" onClick={handleClose}>Log In</Button>   
                        {/* ^ should verify log in information*/}
                        </Link>
                </Modal.Footer>
            </Modal>
        </div>
    );
}