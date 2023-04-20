import React, { useState, useEffect, useRef } from "react";
import { listPuzzles } from "../../api/DataHelper";
import { PuzzleHint } from "../../components/PuzzleHint/PuzzleHint";
import { PuzzleNavBar } from "../../components/PuzzleNavBar/PuzzleNavBar";
import { randomWord } from "../../api/DataHelper";
import "./Puzzle4Page.css";
import { Form, Row, Col, Button } from "react-bootstrap";

export default function Puzzle4Page() {
    let cssVals = {
        1: "form-control",
        2: "form-control",
        3: "form-control",
        4: "form-control",
        5: "form-control",
        6: "form-control",
        7: "form-control",
        8: "form-control",
    }

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
    const [cssValues, updateCssValues] = useState(cssVals);

    const handleChange = (e) => {
        const lastChar = e.target.value.trim().charAt(e.target.value.trim().length - 1);
        if(/[A-Z]|[a-z]/.test(lastChar) || lastChar.length == 0) {
            updateFormData({
                ...formData,
                [e.target.name]: lastChar.toUpperCase()
            });
            refChar[(Number(e.target.name.charAt(e.target.name.length - 1)) + 1) % 9].current.focus();
        }
    };

    const handleSubmit = () => {
        try {
          if(Object.values(formData).toString().replace(/,/g, "").toLowerCase() == wordleWord[0]) {
            //Do what needs to be done after puzzle is complete
            console.log("Correct!")
          }
          else {
            //Do the wordle rules
            const input = Object.values(formData).toString().replace(/,/g, "").toLowerCase();
            let word = wordleWord[0];
            let guessFlags = [false, false, false, false, false, false, false, false];
            let answerFlags = [false, false, false, false, false, false, false, false];

            //Check correct
            for(let i = 0; i < 8; i++) {
                if(word[i] == input[i]) {
                    cssVals[i+1] = "correct";
                    guessFlags[i] = true;
                    answerFlags[i] = true;
                }
            }

            //Check half correct
            for(let i = 0; i < 8; i++) {
              if(!guessFlags[i]) {
                for(let j = 0; j < 8; j++) {
                  if(!answerFlags[j] && input[i] == word[j] && !guessFlags[i]) {
                    guessFlags[i] = true;
                    answerFlags[j] = true;
                    cssVals[i+1] = "halfCorrect";
                    console.log('We are comparing ' + input[i] + ' to ' + word[j] + ' and they match!');
                  }
                }
              }
            }

            //Check incorrect
            for (let i = 0; i < 8; i++) {
              if(!answerFlags[i]) {
                cssVals[i+1] = "incorrect";
              }
            }
            updateCssValues(cssVals);
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
              <Row>
                <Col lg="auto">
                  <Form.Control
                    onChange={handleChange}
                    name="char1"
                    type="text"
                    className={cssValues[1]}
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
                    className={cssValues[2]}
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
                    className={cssValues[3]}
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
                    className={cssValues[4]}
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
                    className={cssValues[5]}
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
                    className={cssValues[6]}
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
                    className={cssValues[7]}
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
                    className={cssValues[8]}
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