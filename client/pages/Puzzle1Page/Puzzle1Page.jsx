import React, { useState, useRef } from "react";
import { Button, Carousel, Col, Container, Modal, Overlay, Row, Stack, Tooltip } from "react-bootstrap";
import { PuzzleHint } from "../../components/PuzzleHint/PuzzleHint";
import { PuzzleNavBar } from "../../components/PuzzleNavBar/PuzzleNavBar";
import frog from "../../assets/frog.jpg";
import cloud from "../../assets/cloud.jpg";
import clown from "../../assets/clown.jpg";
import dino from "../../assets/dino.jpg";
import food from "../../assets/food.jpg";
import facebook from "../../assets/facebook.png";
import instagram from "../../assets/instagram.png";
import tiktok from "../../assets/tiktok.png";
import email from "../../assets/gmail.png";
import "./Puzzle1Page.css";

export default function Puzzle1Page() {

  const [showOverlay, setShowOverlay] = useState(false);
  const [showTipsHint, setShowTipsHint] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [disableTipsButton, setDisableTipsButton] = useState(true);
  const [disableContactButton, setDisableContactButton] = useState(true);
  const handleCloseComplete = () => setShowComplete(false);
  const handleShowComplete = () => setShowComplete(true);  
  const target = useRef(null);

  const handleShowOverlay = () => {
    setShowOverlay(!showOverlay);
    setDisableTipsButton(false);
  }
  const handleShowTipsHint = () => {
    setShowTipsHint(true);
    console.log("Click on Contact Us");
  }
  const handleCloseTipsHint = () => {
    setShowTipsHint(false);
    setDisableContactButton(false);
  }

  return(
    <>
      <PuzzleNavBar />
      <PuzzleHint />
      <div className="puzzle1 min-vw-100 min-vh-100">
        <Container className="justify-content-center content">
          <Row>
            <Stack direction="horizontal" gap={3}>
              <div className="page-title">               
                How to Photoshop like a Pro
              </div>
              <div className="ms-auto">
                <Button className="button" variant="secondary">
                  Tutorial
                </Button>
              </div>
              <div>
                <Button className="button" variant="secondary">
                  Software
                </Button>
              </div>
              <div>
                <Button 
                  disabled={disableTipsButton}
                  onClick={handleShowTipsHint}
                  data-testid="tips"
                  variant="secondary" 
                  className="button">
                  Tips
                </Button>
                <Modal
                  show={showTipsHint}
                  onHide={handleCloseTipsHint}
                  backdrop="static"
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                  >
                  <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                      Hint
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Check the console
                  </Modal.Body>
                  <Modal.Footer>
                    <p>Click the ? on the bottom left for help opening the console</p>
                    <Button 
                      className="close-button"
                      variant="secondary" 
                      onClick={handleCloseTipsHint}
                      data-testid="close-hint-modal"
                      >
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </Stack>
          </Row>
          <Row>
            <Container className="main-block">
              <Row>
                <Col sm={2}>
                  <Stack gap={5} className="side-nav">
                    <Button 
                      className="button" 
                      variant="secondary"
                      >
                      Ideas
                    </Button>
                    <Button 
                      className="button" 
                      variant="secondary"
                      >
                      FAQs
                    </Button>
                    <Button 
                      className="button" 
                      variant="secondary"
                      >
                      About
                    </Button>
                    <Button 
                      className="button disabled-contact-us" 
                      disabled={disableContactButton}
                      variant="secondary"
                      onClick={handleShowComplete}
                      data-testid="contact-us"
                      >
                      Contact Us
                    </Button>
                    <Button 
                      className="button" 
                      variant="secondary"
                      >
                      Help
                    </Button>
                  </Stack>
                </Col>
                <Modal
                  show={showComplete}
                  onHide={handleCloseComplete}
                  backdrop="static"
                  keyboard={false}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                  >
                  <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                      Congratulations!
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    You have completed Puzzle 1!
                  </Modal.Body>
                  <Modal.Footer>
                    <Button 
                      className="button"
                      variant="secondary" 
                      onClick={handleCloseComplete}
                      >
                      Close
                    </Button>
                    <Button 
                      className="button"
                      variant="secondary" 
                      onClick={handleCloseComplete}
                      >
                      Restart Puzzle
                    </Button>
                    <Button 
                      className="button"
                      variant="secondary" 
                      onClick={handleCloseComplete}
                      >
                      Next Puzzle
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Col sm={10}>
                  <Carousel>
                    <Carousel.Item>
                      <img
                      className="d-block w-100"
                      src={cloud}
                      alt="First slide"
                      />
                      <Carousel.Caption className="carousel-captions">
                        <h3>Welcome</h3>
                      </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item>
                      <img
                      className="d-block w-100"
                      src={dino}
                      alt="Second slide"
                      />

                      <Carousel.Caption className="carousel-captions">
                        <h3>Scroll to the 5th slide</h3>
                      </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item>
                      <img
                      className="d-block w-100"
                      src={frog}
                      alt="Third slide"
                      />
                      <Carousel.Caption className="carousel-captions">
                        <h3>Oooo froggy</h3>
                      </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item>
                      <img
                      className="d-block w-100"
                      src={food}
                      alt="Fourth slide"
                      />
                      <Carousel.Caption className="carousel-captions">
                        <h3>Yummy</h3>
                      </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item>
                      <img
                      className="d-block w-100"
                      src={clown}
                      alt="Fifth slide"
                      />
                      <Carousel.Caption className="carousel-captions">
                        <h3>Welcome to the fifth slide</h3>
                        <p>Click the Email button</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                  </Carousel>
                </Col>
              </Row>
              <Row className="blank-space"></Row>
              <Row>
                <Col sm={9}></Col>
                <Col sm={3}>
                <Button className="social-buttons button">
                    <img src={facebook} alt="facebook"  width="35" height="35"/>
                  </Button>
                  <Button className="social-buttons button">
                    <img src={instagram} alt="instagram"  width="35" height="35"/>
                  </Button>
                  <Button className="social-buttons button">
                    <img src={tiktok} alt="tiktok" width="35" height="35"/>
                  </Button>
                  <Button 
                    ref={target}
                    onClick={handleShowOverlay}
                    className="social-buttons button"
                    data-testid="click-me"
                    >
                    <img src={email} alt="email"  width="35" height="35"/>
                  </Button>
                  <Overlay 
                    target={target.current} 
                    show={showOverlay} 
                    placement="left"
                    >
                    {(props) => (
                      <Tooltip id="overlay-hint" {...props}>
                        Click on the word Tips
                      </Tooltip>
                    )}
                  </Overlay>
                </Col>
              </Row>
            </Container>                         
          </Row>
        </Container>
      </div>
    </>
  );
}