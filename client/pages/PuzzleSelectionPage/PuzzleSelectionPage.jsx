import React from "react";
import { Link } from "react-router-dom";
import { Button, Form, Container } from "react-bootstrap";
import { useState } from "react";

import back from "../../assets/back-arrow.png";

import { PuzzleItem } from "../../components/PuzzleItem/PuzzleItem.jsx";
import { listPuzzles, logOut } from "../../api/DataHelper";
import "./PuzzleSelectionPage.css";

export default function PuzzleSelectionPage() {
  const userIcon =
    "https://api.dicebear.com/5.x/adventurer/svg?seed=Gracie&scale=130&radius=20&backgroundType=solid,gradientLinear&randomizeIds=true&backgroundColor=c0aede,b6e3f4,d1d4f9,ffdfbf,ffd5dc";

  const [puzzles, setPuzzles] = useState([
    { puzzle_id: 1, title: "title", description: "description" },
  ]);
  const [hasResponded, setHasResponded] = useState(false);
  const [userID, setUserID] = useState(-1);
  const [, setUsername] = useState("");
  const [userPuzzleCompletion, setUserPuzzleCompletion] = useState([]);

  //If puzzles is still default, this evaluates to true
  //hasResponded makes sure that if there is 1 puzzle in the DB that we don't accidentally
  //infinitely call the api for puzzles (ran into this issue during testing)
  if (puzzles.length === 1 && !hasResponded) {
    listPuzzles()
      .then((res) => {
        setPuzzles(res.data.puzzles);
        setUserID(res.data.userID);
        setUsername(res.data.username);
        setUserPuzzleCompletion(res.data.userPuzzleCompletion);
        setHasResponded(true);
      })
      .catch((err) => {
        alert(err);
      });
  }

  return (
    <div className="puzzleSelectionPage min-vh-100 min-vw-100">
      <div className="logOut">
        <Link to="/" onClick={logOut}>
          <Button className="puzzleSelectionPage__button" width="150">
            Log Out
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
            return (
              <PuzzleItem
                puzzle={puzzle}
                puzzleCompletion={userPuzzleCompletion.find(
                  (upc) => upc.puzzle_id === puzzle.puzzle_id
                )}
              />
            );
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
