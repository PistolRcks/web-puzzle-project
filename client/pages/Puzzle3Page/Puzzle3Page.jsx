import React, { useState, useRef } from "react";
import { render, Link } from "react-router-dom";
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
  Form,
} from "react-bootstrap";
import { PuzzleHint } from "../../components/PuzzleHint/PuzzleHint";
import { PuzzleNavBar } from "../../components/PuzzleNavBar/PuzzleNavBar";
import { randomWord, listPuzzles } from "../../api/DataHelper";
import "./Puzzle3Page.css";
import puzzle from "../../assets/puzzle.jpg";

export default function Puzzle3Page() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showTipsHint, setShowTipsHint] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [disableTipsButton, setDisableTipsButton] = useState(true);
  const [disableContactButton, setDisableContactButton] = useState(true);

  const [allowSubmit, setAllowSubmit] = useState(false);
  const handleCloseComplete = () => setShowComplete(false);
  const handleShowComplete = () => setShowComplete(true);
  const target = useRef(null);

  //Use state for puzzle description
  const [puzzleDesc, setPuzzleDesc] = useState("");
  const [hasResponded, setHasResponded] = useState(false);

  //Database call to get the puzzle description on this page
  //Realistically this could be done in a better way, but it would require something
  //that is out of scope for my project
  if (!hasResponded) {
    listPuzzles().then((res) => {
      setHasResponded(true);
      setPuzzleDesc(res.data.puzzles[2].description);
    }).catch((err) => {
      alert(err);
    });
  }

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
  const handleRestartPuzzle = () => {
    setShowComplete(false);
    window.location.reload(true);
  }

  const initialFormData = Object.freeze({
    checkAnswer: "",
  });
  const [formData, updateFormData] = useState(initialFormData);
  // if the entered word matches the solution, allow submit
  const handleChange = (e) => {

    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
    console.log(e.target.value, random);
    if (e.target.value === random) {
      setAllowSubmit(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowComplete(true);
  }

  // Tooltip that contains the first hint
  const renderFragment = (props) => (
    <Tooltip id="hover-tooltip" {...props}>
      {fragment1}
    </Tooltip>
  );

  // Requirements for randomWord API call
  const requirements = {
    "words": [
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

  if (random === "") {
    // If the random word is empty, call randomWord and generate fragments
    randomWord(requirements).then(result => {
      const rand = (Object.values(result)[0][0][0]);
      setRand(rand);
      setFrag1(rand.substring(0, 3));
      setFrag2(rand.substring(3, 6));
      setFrag3(rand.substring(6));
    }).catch(error => {
      console.log("Error getting random word!");
    }
    );
  }

  const hintObj = [{ title: "Opening the Console", steps: ["Right click on the screen and select Inspect", "Once the side bar is open on the right, select Console from the top tabs in the side bar."] }];

  return (
    <>
      <PuzzleNavBar puzzleNum={3} puzzleDesc={puzzleDesc} />
      <PuzzleHint hints={hintObj} />
      <div className="puzzle3 min-vw-100 min-vh-100">
        <Container className="content">
          <Row>
            <Stack direction="horizontal" gap={3}>
              <div className="page-title">
                New Puzzle Stumps Internet Browsers
              </div>
              <div className="ms-auto">
                <Row>
                  <Form>
                    <Form.Group className="mb-3" controlId="formSearchSubmit">
                      <Form.Control type="text" placeholder="Search" name="checkAnswer" onChange={handleChange} />
                      <Button className="rounded-pill" variant="primary" type="submit" onClick={handleSubmit} disabled={!allowSubmit}>Search</Button>
                    </Form.Group>
                  </Form>
                </Row>
              </div>
            </Stack>
          </Row>
          <div className="puzzle3 text-body">
            <div className="puzzle3 author">
              John {fragment3}
            </div>
            <div className="puzzle3">
              <img
                src={puzzle}
                alt={fragment2}
                width="200"
                height="150"
              />
              In a world where we spend countless hours online,
              it's no surprise that people are always looking for new and interesting ways to pass the time.
              Recently, a new puzzle has been making the rounds on the internet, and it has stumped many internet browsers.
              The puzzle, which features a grid of squares
              <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={renderFragment}
              >
                <a> Hover me! </a>
              </OverlayTrigger>
              with numbers, has been shared on social media and puzzle forums around the world.
              The goal is to fill in the blank squares with numbers so that each row, column, and
              diagonal adds up to the same sum. While the concept seems simple enough, the puzzle
              has proven to be a real brain teaser for many. Experts are calling this puzzle one of
              the most challenging yet. Some have even compared it to the infamous Rubik's cube.
              Despite its difficulty, the puzzle has gained a large following, with many people determined to solve it.
              With so many people working together and sharing tips and strategies online,
              it's only a matter of time before this puzzle is finally cracked.
            </div>
          </div>
          <Row>
            <Modal
              show={showComplete}
              onHide={handleCloseComplete}
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
                You have completed Puzzle 3!
              </Modal.Body>
              <Modal.Footer>
                <Button
                  className="button"
                  variant="secondary"
                  onClick={handleCloseComplete}
                >
                  Close
                </Button>
                <Link to="/Puzzle/Selection">
                  <Button
                    className="button"
                    variant="secondary"
                  >
                    Puzzle Selection Page
                  </Button>
                </Link>
                <Button
                  className="button"
                  variant="secondary"
                  data-testid="restart-puzzle"
                  onClick={handleRestartPuzzle}
                >
                  Restart Puzzle
                </Button>
                <Link to="/Puzzle/4">
                  <Button
                    className="button"
                    variant="secondary"
                  >
                    Next Puzzle
                  </Button>
                </Link>
              </Modal.Footer>
            </Modal>
          </Row>
        </Container>
      </div>
    </>
  );
}
