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
import frog from "../../assets/frog.jpg";
import cloud from "../../assets/cloud.jpg";
import clown from "../../assets/clown.jpg";
import dino from "../../assets/dino.jpg";
import food from "../../assets/food.jpg";
import facebook from "../../assets/facebook.png";
import instagram from "../../assets/instagram.png";
import tiktok from "../../assets/tiktok.png";
import email from "../../assets/gmail.png";
import "./Puzzle1Page.css";

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
          </Row>
        </Container>
      </div>
    </>
  );
}
