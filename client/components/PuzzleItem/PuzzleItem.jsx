import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Col, Form, Row } from 'react-bootstrap'
import x from '../../assets/x.png'
import check from '../../assets/check.png'

export function PuzzleItem({ puzzle }) {
  const { puzzleID, isCompleted } = puzzle
  return (
    <>
      <Row className="mb-3">
          <Form.Group as={Col} controlId={puzzleID}>
              <Link to={`/Puzzle/Details/${puzzleID}`}>
                <Button className="buttons" size="lg" style={{minWidth: '100'}}>
                  <img src={isCompleted ? check : x} height='22' alt={isCompleted}/> Puzzle {puzzleID}
                </Button>
              </Link>
          </Form.Group>
      </Row>
    </>
  )
}
