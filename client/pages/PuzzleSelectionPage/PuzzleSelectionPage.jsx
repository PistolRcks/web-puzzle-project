import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'

import back from '../../assets/back-arrow.png';

import { PuzzleItem } from '../../components/PuzzleItem/PuzzleItem.jsx'
import './PuzzleSelectionPage.css';

export default function PuzzleSelection() {
  const { userID, userIcon, puzzles } = RetrievePuzzleData()

  return (
      <div className="app min-vh-100 min-vw-100">
          <div className="back-button">
              <Link to="/">
                <Button className="button">
                  <img src={back} alt="back" width="22" height="22"/> Back
                </Button>
              </Link> 
              {
                // TODO: This link will likely not work until we know how we are handling 
                // TODO: user authentication and managing the userID after logging in
              }
              <Link to={`/UserProfile/${userID}`} className='puzzle_selection_page__profile-link'>
                <img src={userIcon} alt='User profile picture' height='75'/>
              </Link>
          </div>
          <Container className="selection-header min-vw-100">
            <p className="selection-title">Puzzle Selection</p>
          </Container>
          <div>
            <Form>
              {puzzles.map(puzzle => {
                return (<PuzzleItem puzzle={puzzle} />)
              })}
            </Form>
          </div>
      </div>
  );
}

// TODO: Update this function to call the API once it's ready
const RetrievePuzzleData = () => {
  return {
    userID: 1,
    userIcon: 'https://api.dicebear.com/5.x/adventurer/svg?seed=Gracie&scale=130&radius=20&backgroundType=solid,gradientLinear&randomizeIds=true&backgroundColor=c0aede,b6e3f4,d1d4f9,ffdfbf,ffd5dc',
    puzzles: [
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
        isCompleted: true
      }
    ]
  }
}
