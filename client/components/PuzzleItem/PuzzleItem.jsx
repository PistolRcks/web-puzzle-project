import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Col, Form, Row } from 'react-bootstrap'

export function PuzzleItem({ puzzle }) {
  const [puzzleID, isCompleted] = puzzle
  
  return (
    <>
      <Row className="mb-3">
          <Form.Group as={Col} controlId={puzzleID}>
              <Link to={`/Puzzle/Details/${puzzleID}`}>
                <Button className="buttons" size="lg">Puzzle {puzzleID}</Button>
              </Link>
          </Form.Group>
      </Row>
    </>
  )
}
