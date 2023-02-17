import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import x from '../../assets/x.png'
import check from '../../assets/check.png'
import './PuzzleItem.css'

export function PuzzleItem({ puzzle }) {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const { puzzleID, isCompleted } = puzzle

  const puzzleText = <><img src={isCompleted ? check : x} height='22' alt={isCompleted}/> Puzzle {puzzleID}</>

  return (
    <>
      <Row className="mb-3">
          <Form.Group as={Col} controlId={puzzleID}>
              <Button className="puzzleSelectionPage__button puzzleItem__button" onClick={handleShow} size="lg" style={{minWidth: '100'}}>
                {puzzleText}
              </Button>
              <Modal 
                show={show}
                onHide={handleClose}
                backdrop='static'
                keyboard={false}
                size='lg'
                aria-labelledby='contained-modal-title-vcenter'
                centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title id='contained-modal-title-vcenter'>{puzzleText}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>This is a modal body</Modal.Body>
                  <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>Close</Button>
                    <Link to={`/Puzzle/${puzzleID}`}>
                      <Button variant='primary' type='submit' onClick={handleClose}>Begin</Button>
                    </Link>
                  </Modal.Footer>
              </Modal>
          </Form.Group>
      </Row>
    </>
  )
}
