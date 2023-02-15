import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
// import back from '../../assets/back-arrow.png';

import { PuzzleItem } from '../../components/PuzzleItem/PuzzleItem.jsx'

import "./PuzzleSelectionPage.css";

export default function PuzzleSelection() {
    return (
        <div>
            <div className="back-button">
                <Link to="/">
                    <Button className="buttons">
                        {/* <img src={back} alt="back" width="22" height="22"/> */}
                        {/* Error: No loader is configured for ".png" files: client/assets/back-arrow.png*/}
                          Back</Button>
                </Link> 
            </div>
            <div className="App">
                <h1>Puzzle Selection</h1>
                <Form>
                    {RetrievePuzzleData().map(puzzle => {
                      return (<PuzzleItem puzzle={puzzle} />)
                    })}
                </Form>
            </div>
        </div>
    );
}

// TODO: Update this function to call the API once it's ready
const RetrievePuzzleData = () => {
  return [
    {
      puzzleID: 1,
      isCompleted: true
    },
    {
      puzzleID: 2,
      isCompleted: false
    },
    {
      puzzleID: 3,
      isCompleted: false
    },
    {
      puzzleID: 4,
      isCompleted: false
    }
  ]
}
