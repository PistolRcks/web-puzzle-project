import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "./PuzzleHint.css";

export function PuzzleHint({hints}){
  const [showHint, setShowHint] = useState(false);
  const handleCloseHint = () => setShowHint(false);
  const handleShowHint = () => setShowHint(true);
  
  //!! The hints prop needs to be an array of hints, each hint is an object that contains:
  //!! title: "title of hint"
  //!! steps: ["step1", "step2", "step3"]
  //!! see puzzle1page for an example

  return(
    <>
    <Button 
      className="button hint rounded-circle" 
      variant="secondary" 
      onClick={handleShowHint}
      >
      ?
    </Button>
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
      {hints.map((hint) => {
            return (
              <>
              <h5>{hint.title}</h5>
              <ol>
                {hint.steps.map((step) => {
                  return (
                    <>
                    <li>{step}</li>
                    </>
                  );
                })}
              </ol>
              </>
            );
          })}
      </Modal.Body>
      <Modal.Footer className="hint-modal">
        <Button className="close-button" variant="secondary" onClick={handleCloseHint}>Close</Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}