import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import puzzlePiece from "../../assets/puzzle-piece.png";
import "./LandingPage.css";
import { AccountCreation } from '../../components/AccountCreation/AccountCreation';

export default function LandingPage() {
    const [showLogin, setShowLogin] = useState(false);
    const handleCloseLogin = () => setShowLogin(false);
    const handleShowLogin = () => setShowLogin(true);

    const [showCreate, setShowCreate] = useState(false);
    const handleCloseCreate = () => setShowCreate(false);
    const handleShowCreate = () => setShowCreate(true);

    const initialFormData = Object.freeze({
        username: "",
        password: "",
        confirmPassword: ""
    }); 

    const [formData, updateFormData] = React.useState(initialFormData);
    const validateUserAndPass = (user) => {
        let userStr = String(user);
        if(userStr.length < 5) {
            alert("Your username you created should be at least 5 characters")
            return false;
        }
        if(/^\w+$/.test(userStr)) {
            return true;
        }
        else {
            alert("The username or password you entered contains illegal characters, please make sure it contains letters, numbers, and underscores only")
            return false;
        }
    }
    const handleSubmit = event => {
        
        console.log('Form submitted')
        if(!validateUserAndPass(formData.password)||!validateUserAndPass(formData.username)){
            event.preventDefault();
        }
        else if(validateUserAndPass(formData.password)&&validateUserAndPass(formData.username)){
            setShow(false);
            console.log("This is correct");
        }
        

    };
    
    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim()
        });
    }
    


    return (
        <div className="app min-vh-100 min-vw-100" data-testid="landing-1">
            <Container className="min-vw-100 header-container">
                <div>
                    <img 
                    src={puzzlePiece} 
                    alt="puzzle piece" 
                    width="50" 
                    height="50" /> 
                    Welcome to our Web Puzzle
                </div>
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
            <Button className="button" variant="secondary" onClick={handleShowLogin}>Log In</Button>
            <Modal
                show={showLogin}
                onHide={handleCloseLogin}
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
                                data-testid="username" 
                                name="username"
                                onChange={handleChange} 
                                class="form-control" 
                                type="text" 
                                placeholder="Enter User Name"></input>
                        
                            </div>
                            <div className="mb-3">
                                <label>Password</label>
                                <input 
                                    data-testid="password" 
                                    type="password" 
                                    name="password"                
                                    className="form-control"
                                    placeholder="Enter password"
                                    onChange={handleChange}
                                />
                            </div>
                                <div className="mb-3">
                                <div className="custom-control custom-checkbox">
                                    <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="customCheck1"
                                    />
                                    <label className="custom-control-label" htmlFor="customCheck1">
                                        Remember me
                                    </label>
                                </div>
                                </div>
                        
                                <p className="create account">
                                Need to <a href="#">Create Account?</a>
                                </p>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            className="close-button" 
                            variant="secondary" 
                            onClick={handleCloseLogin}>
                            Close
                        </Button>
                        <Link to="/Puzzle/Selection">
                            <Button 
                                className="button" 
                                variant="secondary" 
                                type="submit" 
                                onClick={handleCloseLogin}>
                                Log In
                            </Button>   
                        </Link>
                    </Modal.Footer>
            </Modal>
            <Button className="button" variant="secondary" onClick={handleShowCreate}>Create Account</Button>
            <Modal
                show={showCreate}
                onHide={handleCloseCreate}
                backdrop="static"
                keyboard={false}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Create Account
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AccountCreation close={handleCloseCreate}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        className="close-button" 
                        variant="secondary" 
                        onClick={handleCloseCreate}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
      
    );
}