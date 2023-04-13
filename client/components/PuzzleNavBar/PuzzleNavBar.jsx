import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Navbar, Nav, Modal } from "react-bootstrap";
import { logOut } from "../../api/DataHelper";
import "./PuzzleNavBar.css";

export function PuzzleNavBar({puzzleNum, puzzleDesc}) {
  const [showDescription, setShowDesc] = useState(false);
  const handleShowDesc = () => setShowDesc(true);
  const handleCloseDesc = () => setShowDesc(false);

  return (
    <>
      <Navbar className="puzzle-nav" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>Puzzle {puzzleNum}</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Link to="/Puzzle/Selection">
                <Nav.Link href="/Puzzle/Selection">
                  Puzzle Selection Page
                </Nav.Link>
              </Link>
              <Nav.Link href="/UserProfile">User Profile</Nav.Link>
              <Nav.Link onClick={handleShowDesc}>Puzzle Description</Nav.Link>
            </Nav>
            <Link to="/" onClick={logOut}>
              <Button className="button" width="150" onClick={logOut}>
                Log Out
              </Button>
            </Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Modal
        show={showDescription}
        onHide={handleCloseDesc}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>Puzzle Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>{puzzleDesc}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDesc}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
