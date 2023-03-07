import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import './PuzzleHint.css';

export function PuzzleHint(){
    const [showHint, setShowHint] = useState(false);
    const handleCloseHint = () => setShowHint(false);
    const handleShowHint = () => setShowHint(true); 

    return(
        <>
        <Button className="button hint rounded-circle" variant="secondary" onClick={handleShowHint}>?</Button>
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
        </>
    );
}