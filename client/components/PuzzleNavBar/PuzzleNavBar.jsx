import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Navbar, Nav, Modal } from "react-bootstrap";
import { logOut } from "../../api/DataHelper";
import "./PuzzleNavBar.css";

function PuzzleNavBar({puzzleNum, puzzleDesc, onTimerStop}, ref){
  const [showDescription, setShowDesc] = useState(false);
  const [timeOnSite, setTimeOnSite] = useState(0);
  const [timer, setTimer] = useState(null)
  const handleShowDesc = () => setShowDesc(true);
  const handleCloseDesc = () => setShowDesc(false);
  const milliseconds = timeOnSite % 100;
  const totalSeconds = Math.floor(timeOnSite / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

  // Keeps track of the time spent on the site, starts as soon as the page loads
  // Time stops once the puzzle is completed and the time is displayed in the completed modal
  useImperativeHandle(ref, () => ({
    stopTimer() {
      console.log("stop timer was called");
      clearInterval(timer);
      onTimerStop(timeOnSite);
    }
  }));

  useEffect(() => {
    const interval = setInterval(() => {
        setTimeOnSite(timeOnSite => timeOnSite + 1);
    }, 10);
    setTimer(interval)
    return () => clearInterval(interval);
  }, []);


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
            <p className="timer">Time: {minutes}:{seconds?.toString().padStart(2, '0') || '00'}:{milliseconds?.toString().padStart(2, '0') || '00'}</p>
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

export default forwardRef(PuzzleNavBar);
