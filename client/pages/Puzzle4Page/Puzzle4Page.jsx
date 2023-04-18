import React, { useState, useEffect, useRef } from "react";
import { listPuzzles } from "../../api/DataHelper";
import { PuzzleHint } from "../../components/PuzzleHint/PuzzleHint";
import { PuzzleNavBar } from "../../components/PuzzleNavBar/PuzzleNavBar";
import { randomWord } from "../../api/DataHelper";
import "./Puzzle4Page.css";
import { Form, Row, Col, Button } from "react-bootstrap";

export default function Puzzle4Page() {
    const initialFormData = Object.freeze({
        char1: "",
        char2: "",
        char3: "",
        char4: "",
        char5: "",
        char6: "",
        char7: "",
        char8: ""
      });

    const refChar = {
        0: useRef(),
        1: useRef(),
        2: useRef(),
        3: useRef(),
        4: useRef(),
        5: useRef(),
        6: useRef(),
        7: useRef(),
        8: useRef()
    };

    //Use state for puzzle description
    const [puzzleDesc, setPuzzleDesc] = useState("");
    const [hasResponded, setHasResponded] = useState(false);
    const [wordleWord, setWordleWord] = useState("");
    const [formData, updateFormData] = useState(initialFormData);

    const handleChange = (e) => {
        const lastChar = e.target.value.trim().charAt(e.target.value.trim().length - 1);
        if(/[A-Z]|[a-z]/.test(lastChar) || lastChar.length == 0) {
            updateFormData({
                ...formData,
                [e.target.name]: lastChar.toUpperCase()
            });
            refChar[(Number(e.target.name.charAt(e.target.name.length - 1)) + 1) % 9].current.focus();
        }
        console.log(formData);
    };

    const handleSubmit = () => {
        try {
          if(Object.values(formData).toString().replace(/,/g, "").toLowerCase() == wordleWord[0]) {
            //Do what needs to be done after puzzle is complete
            console.log("Correct!")
          }
          else {
            //Do the wordle rules
            console.log("Incorrect!")
          }
        } catch (error) {
          alert(error.message);
        }
      };

    //Database call to get the puzzle description on this page
    //Realistically this could be done in a better way, but it would require something
    //that is out of scope for my project
    if(!hasResponded) {
        listPuzzles().then((res) => {
            setHasResponded(true);
            setPuzzleDesc(res.data.puzzles[3].description);
            randomWord({words: [{numWords: 1, length: 8}]}).then((res) => {
                setWordleWord(res.data[0]);
            });
        }).catch((err) => {
            alert(err);
        });
    }

    const hintObj = [{title: "Opening the Console", steps: ["Right click on the screen and select Inspect", "Once the side bar is open on the right, select Console from the top tabs in the side bar."]}];
    return (
        <>
            <PuzzleNavBar puzzleNum={4} puzzleDesc={puzzleDesc}/>
            <PuzzleHint hints={hintObj}/>
            <h1>{wordleWord}</h1>
            <Form>
              <Row ref={refChar[0]}>
                <Col lg="auto">
                  <Form.Control
                    onChange={handleChange}
                    name="char1"
                    type="text"
                    className="form-control"
                    size="lg"
                    value={formData.char1}
                    ref={refChar[1]}
                  />
                </Col>
                <Col lg="auto">
                  <Form.Control
                    onChange={handleChange}
                    name="char2"
                    type="text"
                    className="form-control"
                    size="lg"
                    value={formData.char2}
                    ref={refChar[2]}
                  />
                </Col>
                <Col lg="auto">
                  <Form.Control
                    onChange={handleChange}
                    name="char3"
                    type="text"
                    className="form-control"
                    size="lg"
                    value={formData.char3}
                    ref={refChar[3]}
                  />
                </Col>
                <Col lg="auto">
                  <Form.Control
                    onChange={handleChange}
                    name="char4"
                    type="text"
                    className="form-control"
                    size="lg"
                    value={formData.char4}
                    ref={refChar[4]}
                  />
                </Col>
                <Col lg="auto">
                  <Form.Control
                    onChange={handleChange}
                    name="char5"
                    type="text"
                    className="form-control"
                    size="lg"
                    value={formData.char5}
                    ref={refChar[5]}
                  />
                </Col>
                <Col lg="auto">
                  <Form.Control
                    onChange={handleChange}
                    name="char6"
                    type="text"
                    className="form-control"
                    size="lg"
                    value={formData.char6}
                    ref={refChar[6]}
                  />
                </Col>
                <Col lg="auto">
                  <Form.Control
                    onChange={handleChange}
                    name="char7"
                    type="text"
                    className="form-control"
                    size="lg"
                    value={formData.char7}
                    ref={refChar[7]}
                  />
                </Col>
                <Col lg="auto">
                  <Form.Control
                    onChange={handleChange}
                    name="char8"
                    type="text"
                    className="form-control"
                    size="lg"
                    value={formData.char8}
                    ref={refChar[8]}
                  />
                </Col>
                <Col lg="auto">
                    <Button
                        onClick={handleSubmit}
                        ref={refChar[0]}
                    >
                    Submit
                    </Button>
                </Col>
              </Row>
            </Form>
        </>
    )
}