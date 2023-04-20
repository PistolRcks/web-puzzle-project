import React, { useState, useRef } from "react";
import {
  Button,
  Carousel,
  Col,
  Container,
  Modal,
  Overlay,
  Row,
  Stack,
  Tooltip,
} from "react-bootstrap";
import { PuzzleHint } from "../../components/PuzzleHint/PuzzleHint";
import { PuzzleNavBar } from "../../components/PuzzleNavBar/PuzzleNavBar";
import "./Puzzle2.css";


export default function Puzzle2Page() {
  
  return (
    <>
      <PuzzleNavBar />
      <PuzzleHint />
      <div className="puzzle1 min-vw-100 min-vh-100">
        <Container className="justify-content-center content">
          <Row>
            <Stack direction="horizontal" gap={3}>
              <div className="page-title">
                Information World: Forum Of Everything
              </div>
            </Stack>
            <h4 className="version-one">Passcode</h4>
           
            <div className="search">
              <Button className="button" variant="secondary">
                Search
              </Button>
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
}
