import React, { useState, useEffect } from "react";
import { listPuzzles } from "../../api/DataHelper";
import { PuzzleHint } from "../../components/PuzzleHint/PuzzleHint";
import { PuzzleNavBar } from "../../components/PuzzleNavBar/PuzzleNavBar";
import { randomWord } from "../../api/DataHelper";
import "./Puzzle4Page.css";
import { Form, Row, Col } from "react-bootstrap";

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

    //Use state for puzzle description
    const [puzzleDesc, setPuzzleDesc] = useState("");
    const [hasResponded, setHasResponded] = useState(false);
    const [wordleWord, setWordleWord] = useState("");
    const [formData, updateFormData] = useState(initialFormData);

    const handleChange = (e) => {
        updateFormData({
          ...formData,
          [e.target.name]: e.target.value.trim()
        });
        console.log(formData);
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
            {wordleWord}
            <Form>
              <Row>
                <Col>
                  <Form.Control
                    onChange={handleChange}
                    name="char1"
                    type="text"
                  />
                </Col>
                <Col>
                  <Form.Control
                    onChange={handleChange}
                    name="char2"
                    type="text"
                  />
                </Col>
                <Col>
                  <Form.Control
                    onChange={handleChange}
                    name="char3"
                    type="text"
                  />
                </Col>
                <Col>
                  <Form.Control
                    onChange={handleChange}
                    name="char4"
                    type="text"
                  />
                </Col>
                <Col>
                  <Form.Control
                    onChange={handleChange}
                    name="char5"
                    type="text"
                  />
                </Col>
                <Col>
                  <Form.Control
                    onChange={handleChange}
                    name="char6"
                    type="text"
                  />
                </Col>
                <Col>
                  <Form.Control
                    onChange={handleChange}
                    name="char7"
                    type="text"
                  />
                </Col>
                <Col>
                  <Form.Control
                    onChange={handleChange}
                    name="char8"
                    type="text"
                  />
                </Col>
              </Row>
            </Form>
        </>
    )
}