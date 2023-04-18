import React, { useState, useRef } from "react";
import { render } from "react-dom";
import {
  Button,
  Carousel,
  Col,
  Container,
  Modal,
  Overlay,
  OverlayTrigger,
  Row,
  Stack,
  Tooltip,
} from "react-bootstrap";
import { PuzzleHint } from "../../components/PuzzleHint/PuzzleHint";
import { PuzzleNavBar } from "../../components/PuzzleNavBar/PuzzleNavBar";
import { randomWord } from "../../api/DataHelper";
import "./Puzzle3Page.css";
import puzzle from "../../assets/puzzle.jpg"; 

export default function Puzzle3Page() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showTipsHint, setShowTipsHint] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [disableTipsButton, setDisableTipsButton] = useState(true);
  const [disableContactButton, setDisableContactButton] = useState(true);
  const [showFragment, setShowFragment] = useState(false);
  const handleCloseComplete = () => setShowComplete(false);
  const handleShowComplete = () => setShowComplete(true);
  const target = useRef(null);

  const handleShowOverlay = () => {
    setShowOverlay(!showOverlay);
    setDisableTipsButton(false);
  };
  const handleShowTipsHint = () => {
    setShowTipsHint(true);
    console.log("Click on Contact Us");
  };
  const handleCloseTipsHint = () => {
    setShowTipsHint(false);
    setDisableContactButton(false);
  }; 

  const renderFragment = (props) => (
    <Tooltip id="hover-tooltip" {...props}>
      {fragment1}
    </Tooltip>
  );

  const requirements ={
    "words" : [
      {
        numWords: 1,
        length: 9,
      },
    ]
  };
  const [fragment1, setFrag1] = useState("");
  const [fragment2, setFrag2] = useState("");
  const [fragment3, setFrag3] = useState("");
  const [random, setRand] = useState("");
  if (random === ""){
    const promise = randomWord(requirements);
      promise.then(result => {
        const rand = (Object.values(result)[0][0][0]);
        //console.log(rand);
        setRand(rand);
        setFrag1(rand.substring(0,3));
        setFrag2(rand.substring(3,6));
        setFrag3(rand.substring(6));
      }).catch(error => {
        console.log("Error getting random word!");
      }
    );
  }

  return (
    <>
      <PuzzleNavBar />
      {/* <PuzzleHint /> */}
      <div className="puzzle3 min-vw-100 min-vh-100">
        <Container className="content">
          <div className="text-body">
            <img
              src={puzzle}
              alt={fragment2}
              width="200"
              height="150"
            />
            <div>
              Lorem {fragment3} ipsum dolor sit amet, consectetur adipiscing elit. Nam porta
              erat in dolor sollicitudin cursus. iaculis facilisis elit
              malesuada bibendum. Sed sed mollis libero. Nulla eleifend felis
              nulla. Suspendisse nec dapibus nulla, porta fermentum risus.
              Mauris in fermentum odio. Nunc ultricies dignissim metus non
              gravida. In sed vehicula eros, ut volutpat neque.
              <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={renderFragment}
              >
                <a> Hover me! </a>
              </OverlayTrigger>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam porta
              erat in dolor sollicitudin cursus. iaculis facilisis elit
              malesuada bibendum. Sed sed mollis libero. Nulla eleifend felis
              nulla. Suspendisse nec dapibus nulla, porta fermentum risus.
              Mauris in fermentum odio. Nunc ultricies dignissim metus non
              gravida. In sed vehicula eros, ut volutpat neque.
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
