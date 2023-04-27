import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Col,
  Container,
  Modal,
  OverlayTrigger,
  Row,
  Stack,
  Tooltip,
  Form,
} from "react-bootstrap";
import { PuzzleHint } from "../../components/PuzzleHint/PuzzleHint";
import PuzzleNavBar from "../../components/PuzzleNavBar/PuzzleNavBar";
import { randomWord, listPuzzles, completePuzzle } from "../../api/DataHelper";
import "./Puzzle3Page.css";
import puzzle from "../../assets/puzzle.jpg";

export default function Puzzle3Page() {
  const [showComplete, setShowComplete] = useState(false);
  const [allowSubmit, setAllowSubmit] = useState(false);
  const handleCloseComplete = () => setShowComplete(false);

  const childRef = useRef(null);
  const [stoppedTime, setStoppedTime] = useState(0);
  const milliseconds = stoppedTime % 100;
  const totalSeconds = Math.floor(stoppedTime / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

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
    if (e.target.value === random) {
      setAllowSubmit(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowComplete(true);
    if (childRef.current) {
      childRef.current.stopTimer();
    }
  }

  const handleShowCompleteModal = () => {
    completePuzzle(3, stoppedTime)
      .catch((err) => { alert(err) });
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
    }).catch(err => {
      alert(err);
    });
  }

  const hintObj = [{ title: "Reading the alt text of an image", steps: ['Right click on the image and click "inspect"', "In the inspector, find the highlighted line of HTML.", 'The hint will be in the "alt" property'] }];

  return (
    <>
      <PuzzleNavBar puzzleNum={3} puzzleDesc={puzzleDesc} onTimerStop={(time) => setStoppedTime(time)} ref={childRef} />
      <PuzzleHint hints={hintObj} />
      <div className="puzzle3 min-vw-100 min-vh-100">
        <Container className="content">
          <Row>
            <Stack direction="horizontal" gap={3}>
              <div className="page-title">
                New Puzzle Stumps Internet Browsers
              </div>
              <div className="ms-auto">
                <Form>
                  <Row>
                    <Form.Group as={Col} xs={5} className="mb-3" controlId="formSearchBox">
                      <Form.Control type="text" placeholder="Search" name="checkAnswer" onChange={handleChange} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formSearchButton">
                      <Button className="rounded-pill" variant="primary" type="submit" onClick={handleSubmit} disabled={!allowSubmit}>&#x1F50E;&#xFE0E;</Button>
                    </Form.Group>
                  </Row>
                </Form>
              </div>
            </Stack>
          </Row>
          <div className="puzzle3 text-body">
            <div className="puzzle3 author">
              By: John {fragment3}
            </div>
            <div className="puzzle3">
              <img
                src={puzzle}
                alt={fragment2}
                width="250"
                height="200"
              />
              <p className="text-article">
                In a world where we spend countless hours online,
                it's no surprise that people are always looking for new and interesting ways to pass the time.
                Recently, a new puzzle has been making the rounds on the internet, and it has stumped many internet browsers.
                The puzzle, which features a grid of
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderFragment}
                >
                  <a> squares </a>
                </OverlayTrigger>
                with numbers, has been shared on social media and puzzle forums around the world.
                The goal is to fill in the blank squares with numbers so that each row, column, and
                diagonal adds up to the same sum. While the concept seems simple enough, the puzzle
                has proven to be a real brain teaser for many. Experts are calling this puzzle one of
                the most challenging yet. Some have even compared it to the infamous Rubik's cube.
                Despite its difficulty, the puzzle has gained a large following, with many people determined to solve it.
                With so many people working together and sharing tips and strategies online,
                it's only a matter of time before this puzzle is finally cracked.
              </p>
            </div>
          </div>
          <Row>
            <Modal
              show={showComplete}
              onShow={handleShowCompleteModal}
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
                {stoppedTime > 0 && (
                  <p>You have completed Puzzle 3 in {minutes}:{seconds?.toString().padStart(2, '0') || '00'}.{milliseconds?.toString().padStart(2, '0') || '00'}!</p>
                )}
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
