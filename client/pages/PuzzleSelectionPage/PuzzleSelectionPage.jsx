import React from "react";
import { Link } from "react-router-dom";
import { Button, Form, Container, Row, Col } from "react-bootstrap";

import back from "../../assets/back-arrow.png";

import { PuzzleItem } from "../../components/PuzzleItem/PuzzleItem.jsx";
import "./PuzzleSelectionPage.css";

export default function PuzzleSelectionPage() {
  const { userID, userIcon, puzzles } = RetrievePuzzleData();

  return (
    <div className="puzzleSelectionPage min-vh-100 min-vw-100">
      <div className="puzzleSelectionPage__backButton">
        <Link to="/">
          <Button className="puzzleSelectionPage__button button" variant="secondary" width="150">
            <img src={back} alt="back" width="22" height="22" /> Home
          </Button>
        </Link>
      </div>
      <Container fluid className="puzzleSelectionPage__selection-header">
        <p className="puzzleSelectionPage__selection-title">Puzzle Selection</p>
      </Container>
      {
        // TODO: This link will likely not work until we know how we are handling
        // TODO: user authentication and managing the userID after logging in
      }
      <div className="puzzle_selection_page__profile-link">
        <Link to={`/UserProfile/${userID}`}>
          <img src={userIcon} alt="User profile" height="75" />
        </Link>
      </div>
      <div>
        <Form>
          {puzzles.map((puzzle) => {
            return <PuzzleItem puzzle={puzzle} />;
          })}
        </Form>
      </div>
    </div>
  );
}

// TODO: Update this function to call the API once it's ready + unit test
// TODO: userID will likely be passed around on the front end to reduce database queries
export const RetrievePuzzleData = () => {
  return {
    userID: 1,
    userIcon:
      "https://api.dicebear.com/5.x/adventurer/svg?seed=Gracie&scale=130&radius=20&backgroundType=solid,gradientLinear&randomizeIds=true&backgroundColor=c0aede,b6e3f4,d1d4f9,ffdfbf,ffd5dc",
    puzzles: [
      {
        puzzleID: 1,
        isCompleted: true,
      },
      {
        puzzleID: 2,
        isCompleted: false,
      },
      {
        puzzleID: 3,
        isCompleted: false,
      },
      {
        puzzleID: 4,
        isCompleted: true,
      },
    ],
  };
};