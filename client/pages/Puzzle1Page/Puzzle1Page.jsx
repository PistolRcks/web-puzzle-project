import React, { useState } from 'react';
import { Button, Card, Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import { PuzzleHint } from '../../components/PuzzleHint/PuzzleHint';
import { PuzzleNavBar } from '../../components/PuzzleNavBar/PuzzleNavBar';
import './Puzzle1Page.css';

// const resizeWindow = () => {
//     const [width, setWidth] = useState(window.innerWidth);

//     useEffect(() => {
//         const handleWindowResize = () => setWidth(window.innerWidth);
//         window.addEventListener("resize", handleWindowResize);
//         return () => window.removeEventListener("resize", handleWindowResize);
//     }, []);

//     return { width };
// }

export default function Puzzle1Page() {
    // const { width } = resizeWindow();
    // const breakpoint = 620;

    // return width < breakpoint ? <MobilePuzzle1Page /> : <DesktopPuzzle1Page />;
    return(
        <>
            <PuzzleNavBar />
            <PuzzleHint />
            <div className="puzzle1 min-vw-100 min-vh-100">
                {/* <Navbar expand="lg">
                    <Container>
                        <Navbar.Brand >something</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="">Hello</Nav.Link>
                                <Nav.Item>Other stuff</Nav.Item>
                                <Nav.Item className="button">
                                    Unicorn
                                </Nav.Item>
                                {/* </Col> */}
                                {/* <Col sm={1} className="top-right-buttons"> */}
                                    {/* <Nav.Item className="button">
                                        Oogly
                                    </Nav.Item>
                                {/* </Col> */}
                                {/* <Col sm={1} className="top-right-buttons"> */}
                                {/* <Button className="button">
                                    Boogly
                                </Button>
                            </Nav>
                        </Navbar.Collapse>

                    </Container>    
            </Navbar> */} 
                <Container className="justify-content-center content">
                    <Row>
                        <Col sm={7} className="page-title">                  
                            This looks so bad 
                        </Col>
                        <Col sm={1} className="top-right-buttons">
                            <Button className="button">
                                Unicorn
                            </Button>
                        </Col>
                        <Col sm={1} className="top-right-buttons">
                            <Button className="button">
                                Oogly
                            </Button>
                        </Col>
                        <Col sm={1} className="top-right-buttons">
                            <Button className="button">
                                Boogly
                            </Button>
                        </Col>
                    </Row> 
                    <Row>
                        <Col sm={2}>
                            <Navbar variant="light" expand="lg">
                                <Container>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto flex-column side-nav">
                                            <Nav.Link>One</Nav.Link>
                                            <Nav.Link>Two</Nav.Link>
                                            <Nav.Link>Apple</Nav.Link>
                                            <Nav.Link>Frog</Nav.Link>
                                            <Nav.Link>Bread</Nav.Link>
                                        </Nav>
                                    </Navbar.Collapse>

                                </Container>    
                            </Navbar> 
                        </Col>
                    {/* <Row> */}
                        {/* <Col sm={2}>
                            <Nav expand="lg">
                                <ul className="side-nav">
                                    <li>One</li>
                                    <li>Two</li>
                                    <li>Apple</li>
                                    <li>Frog</li>
                                    <li>Bread</li>
                                </ul>
                            </Nav>
                        </Col> */}

                        <Col sm={10} expand="lg">
                            <Card className="main-block">God this looks horrendous</Card>
                        </Col>
                        
                    </Row>

                    <div>Look at the bottom right of the screen</div>
                    <Button className="button">
                        Click me
                    </Button>
                    <div >
                        Click on the word unicorn
                    </div>

                </Container>
            </div>
        </>
    );
}