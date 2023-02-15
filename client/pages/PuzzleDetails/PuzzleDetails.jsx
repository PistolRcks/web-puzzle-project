import React from 'react'
import { useParams } from 'react-router-dom'

export default function PuzzleDetails() {
  const { puzzleID } = useParams() // example of how to get the `puzzleID` param from the URL
  return (
    <div style={{color: 'white'}}>
      Puzzle Details: 
      ID: {puzzleID}
    </div>
  )
}
