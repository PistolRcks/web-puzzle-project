import React from 'react'
import { useState } from 'react-dom'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export default function LogIn() {
  return (
    <div>
        <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Log In
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3>Log In</h3>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
        </Modal>
    </div>
  );
}

