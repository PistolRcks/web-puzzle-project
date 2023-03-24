import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import x from "../../assets/x.png";
import check from "../../assets/check.png";
import "./PuzzleItem.css";

export function PuzzleItem({ puzzle, puzzleCompletion }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { puzzle_id: puzzleID, title: puzzleTitle, description: puzzleDescription } = puzzle;

  const puzzleText = (
    <>
      <img className="PuzzleItem__img" src={puzzleCompletion?.progress ? check : x} height="22" alt={puzzleCompletion?.progress ? 'true' : 'false'} />
      {`Puzzle ${puzzleID} - ${puzzleTitle}`}
    </>
  );

  return (
    <>
      <Row className="mb-3">
        <Form.Group as={Col} controlId={puzzleID}>
          <Button
            className="puzzleSelectionPage__button puzzleItem__button button"
            variant="secondary"
            onClick={handleShow}
            size="lg"
            style={{ minWidth: "100" }}
          >
            {puzzleText}
          </Button>
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
                {puzzleText}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>{puzzleDescription}</Modal.Body>
            <Modal.Footer>
              <Button className="close-button" variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Link to={`/Puzzle/${puzzleID}`}>
                <Button className="button" variant="secondary" type="submit" onClick={handleClose}>
                  Begin
                </Button>
              </Link>
            </Modal.Footer>
          </Modal>
        </Form.Group>
      </Row>
    </>
  );
}
