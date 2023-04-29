import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import puzzlePiece from "../../assets/puzzle-piece.png";
import "./LandingPage.css";
import { AccountCreation } from '../../components/AccountCreation/AccountCreation';
import { LogIn } from '../../components/LogIn/LogIn';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import { googleLogin } from "../../api/DataHelper";


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
  
    
  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim()
    });
  }

  const navigate = useNavigate()

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
      <Button 
        className="button" 
        variant="secondary" 
        onClick={handleShowLogin}
        >
        Log In
      </Button>
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
          <LogIn close={handleCloseLogin}/>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            className="close-button"
            variant="secondary" 
            onClick={handleCloseLogin}
            >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Button 
        className="button" 
        variant="secondary" 
        onClick={handleShowCreate}
        >
        Create Account
      </Button>
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
            onClick={handleCloseCreate}
            >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className='center'>
        <GoogleLogin
          onSuccess={async credentialResponse => {
          // console.log(credentialResponse);
          const decoded = jwt_decode(credentialResponse.credential);
          // console.log(decoded.sub);
          await googleLogin(decoded.sub).then((res) => {
            console.log(res.data.username);
            if(res.data.username) {
              navigate("/Puzzle/Selection");
            } else {
              handleShowCreate();
            }
        });
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />;
      </div>
    </div>
    
  );
}