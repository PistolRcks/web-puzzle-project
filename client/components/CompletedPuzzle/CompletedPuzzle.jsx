import React, { useState } from 'react';
import Link from 'react-dom';
import { Button, Modal } from 'react-bootstrap';

export function CompletedPuzzle() {
    const [showCompleted, setShowCompleted] = useState(false);
    const handleCloseCompleted = () => setShowCompleted(false);
    const handleShowCompleted = () => setShowCompleted(true);

    return (
        <>
        {/* Need trigger for modal for when the puzzle is completed, either here or on the puzzle page */}
        <Button onClick={handleShowCompleted}></Button>
        <Modal
            show={showCompleted}
            onHide={handleCloseCompleted}
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
                You have completed the puzzle!
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseCompleted}>Close</Button>
                {/* dynamically send to next puzzle instead of hard coding */}
                <Link to={`/Puzzle/1`}> 
                    <Button variant="primary" onClick={handleCloseCompleted}>Restart Puzzle</Button>
                </Link>
                {/* dynamically send to next puzzle instead of hard coding */}
                <Link to={`/Puzzle/2`}>
                    <Button variant="primary" onClick={handleCloseCompleted}>Next Puzzle</Button>
                </Link>

            </Modal.Footer>

        </Modal>
        </>
    );
}