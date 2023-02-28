import React, { useState } from 'react';
import { Button, Container, Navbar, Nav, Modal, Row }from 'react-bootstrap';
import './PuzzlePageTemplate.css';

export function PuzzlePageTemplate(){
    const [showHint, setShowHint] = useState(false);
    const handleCloseHint = () => setShowHint(false);
    const handleShowHint = () => setShowHint(true); 

    return (
        <>
            <div className="puzzle-page min-vh-100 min-vw-100">
                <Navbar className="puzzle-nav" variant="dark" expand="lg">
                    <Container>
                        <Navbar.Brand >Puzzle 1</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="/">Home</Nav.Link>
                                <Nav.Link href="/Puzzle/Selection">Puzzle Selection Page</Nav.Link>
                                <Nav.Link href="/UserProfile">User Profile</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>

                    </Container>    
                </Navbar>
                <Button className="button hint rounded-circle" onClick={handleShowHint}>?</Button>
                <Modal
                    show={showHint}
                    onHide={handleCloseHint}
                    size="lg"
                    className="modal left fade in"
                    >
                    <Modal.Header className="hint-modal">
                        <Modal.Title>Hints</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="hint-modal">
                        <h5>Opening the Console</h5>
                        <ol>
                            <li>
                                Right click on the screen and select Inspect
                            </li>
                            <li>
                                Once the side bar is open on the right, select Console
                                from the top tabs in the side bar. 
                            </li>
                        </ol>
                    </Modal.Body>
                    <Modal.Footer className="hint-modal">
                        <Button className="close-button" variant="secondary" onClick={handleCloseHint}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}