import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Form, Row } from 'react-bootstrap';
// import back from '../../assets/back-arrow.png';
import "./PuzzleSelectionPage.css";

export default function PuzzleSelection() {


    return (
        <div>
            <div className="back-button">
                <Link to="/">
                    <Button className="buttons">
                        {/*<img src={back} alt="back" width="22" height="22"/>*/}
                        {/* Error: No loader is configured for ".png" files: client/assets/back-arrow.png*/}
                          Back</Button>
                </Link> 
            </div>
            <div className="App">
                <h1>Puzzle Selection</h1>
                <Form>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="puzzle1">
                            <Button className="buttons" size="lg">Puzzle 1</Button>
                        </Form.Group>
                        
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="puzzle2">
                            <Button className="buttons" size="lg">Puzzle 2</Button>
                        </Form.Group>
                        
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="puzzle3">
                            <Button className="buttons" size="lg">Puzzle 3</Button>
                        </Form.Group>
                        
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="puzzle4">
                            <Button className="buttons" size="lg">Puzzle 4</Button>
                        </Form.Group>
                        
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="puzzle5">
                            <Button className="buttons" size="lg">Puzzle 5</Button>
                        </Form.Group>
                        
                    </Row>
                </Form>
            </div>
        </div>
    );
}