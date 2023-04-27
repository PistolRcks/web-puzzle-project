import React, { useState, useRef } from "react";
import {
  Button,
  Carousel,
  Col,
  Container,
  Modal,
  Overlay,
  Row,
  Stack,
  Tooltip,
} from "react-bootstrap";
import { PuzzleHint } from "../../components/PuzzleHint/PuzzleHint";
import { PuzzleNavBar } from "../../components/PuzzleNavBar/PuzzleNavBar";
import "./Puzzle2.css";

export default function Puzzle2Page() {
  const [disableButton, setDisableButton] = useState(true);
  const [showComplete, setShowComplete] = useState(false);
  const handleCloseComplete = () => setShowComplete(false);
  const handleShowComplete = () => setShowComplete(true);
  const [message, setMessage] = useState("");

  const [updated, setUpdated] = useState(message);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleClick = () => {
    // 👇 "message" stores input field value
    setUpdated(message);
  };

  return (
    <>
      <PuzzleNavBar />
      <PuzzleHint />
      <div className="puzzle1 min-vw-100 min-vh-100">
        <Container className="justify-content-center content">
          <Row>
            <Stack direction="horizontal" gap={3}>
              <div className="page-title">
                Information World: Forum Of Everything
              </div>
            </Stack>
            <h4 className="version-one">Passcode</h4>

            <div className="search"></div>
            <div className="input-container">
              <input
                type="text"
                id="message"
                name="message"
                onChange={handleChange}
                value={message}
              />

              <Button
                className="button"
                variant="secondary"
                onClick={handleClick}
              >
                Search
              </Button>
              
              <Button
                className="Comment-button"
                disabled={disableButton}
                variant="secondary"
                onClick={handleShowComplete}
                data-testid="contact-us"
              >
                Comment
              </Button>
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
}
