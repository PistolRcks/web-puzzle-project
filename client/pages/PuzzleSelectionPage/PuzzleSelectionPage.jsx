import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'

import back from '../../assets/back-arrow.png';

import { PuzzleItem } from '../../components/PuzzleItem/PuzzleItem.jsx'
import './PuzzleSelectionPage.css';

export default function PuzzleSelection() {
  const { userID, userIcon, puzzles } = RetrievePuzzleData()

  return (
      <div>
          <div className='back-button'>
              <Link to='/'>
                  <Button className='buttons'>
                      <img src={back} alt='back' width='22' height='22'/>
                        Back</Button>
              </Link> 
              {
                // TODO: This link will likely not work until we know how we are handling 
                // TODO: user authentication and managing the userID after logging in
              }
              <Link to={`/UserProfile/${userID}`} className='puzzle_selection_page__profile-link'>
                <img src={userIcon} alt='User profile picture' height='75'/>
              </Link>
          </div>
          <div className='App'>
              <h1>Puzzle Selection</h1>
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
