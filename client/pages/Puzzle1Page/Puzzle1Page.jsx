import React, { useState, useRef } from "react";
import { Button, Carousel, Col, Container, Modal, Overlay, Row, Stack, Tooltip } from "react-bootstrap";
import { PuzzleHint } from "../../components/PuzzleHint/PuzzleHint";
import { PuzzleNavBar } from "../../components/PuzzleNavBar/PuzzleNavBar";
import frog from "../../assets/frog.jpg";
import cloud from "../../assets/cloud.jpg";
import clown from "../../assets/clown.jpg";
import dino from "../../assets/dino.jpg";
import food from "../../assets/food.jpg";
import "./Puzzle1Page.css";

export default function Puzzle1Page() {

  const [showOverlay, setShowOverlay] = useState(false);
  const [showTipsHint, setShowTipsHint] = useState(false);
  const [disableTipsButton, setDisableTipsButton] = useState(true);
  const handleShowOverlay = () => {
    setShowOverlay(!showOverlay);
    setDisableTipsButton(false);
  }
  const handleShowTipsHint = () => {
    setShowTipsHint(true);
    console.log("Here's your secret word: Hippo")   //add secret word here? or it can point
    //a part of the site that can show the secret word, whichever is easier
  }
  const handleCloseTipsHint = () => setShowTipsHint(false);
  const target = useRef(null);

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
                      Last Hint
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Check the console to complete the puzzle and find your secret word.
                  </Modal.Body>
                  <Modal.Footer>
                    <p>Click the ? in the bottom left for help opening the console</p>
                    <Button 
                      className="close-button"
                      variant="secondary" 
                      onClick={handleCloseTipsHint}
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
                    <Button className="button" variant="secondary">Ideas</Button>
                    <Button className="button" variant="secondary">FAQs</Button>
                    <Button className="button" variant="secondary">About</Button>
                    <Button className="button" variant="secondary">Contact Us</Button>
                    <Button className="button" variant="secondary">Help</Button>
                  </Stack>
                </Col>
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
                        <p>Check the bottom right of the screen</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                  </Carousel>
                </Col>
              </Row>
              <Row className="blank-space"></Row>
              <Row>
                <Col sm={10}></Col>
                <Col sm={2}>
                  <Button 
                    ref={target}
                    onClick={handleShowOverlay}
                    variant="secondary"
                    className="button first-hint"
                    >
                    Click me
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