import React from "react";
import { Link } from "react-router-dom";
import { Button, Form, Container } from "react-bootstrap";
import { useState } from "react";

import { PuzzleItem } from "../../components/PuzzleItem/PuzzleItem.jsx";
import { listPuzzles, logOut } from "../../api/DataHelper";
import "./PuzzleSelectionPage.css";

export default function PuzzleSelectionPage() {
  const [puzzles, setPuzzles] = useState([
    { puzzle_id: 1, title: "title", description: "description" },
  ]);
  const [hasResponded, setHasResponded] = useState(false);
  const [userID, setUserID] = useState(-1);
  const [, setUsername] = useState("");
  const [userPuzzleCompletion, setUserPuzzleCompletion] = useState([]);
  const [pfpSeed, setPFPSeed] = useState(0);
  const[pfpBackgroundColor, setPFPBackgroundColor] = useState("000000");

  const userIcon = `https://api.dicebear.com/5.x/adventurer/svg?seed=${pfpSeed}&backgroundColor=${pfpBackgroundColor}&radius=20`;

  //If puzzles is still default, this evaluates to true
  //hasResponded makes sure that if there is 1 puzzle in the DB that we don't accidentally
  //infinitely call the api for puzzles (ran into this issue during testing)
  if (puzzles.length === 1 && !hasResponded) {
    listPuzzles()
      .then((res) => {
        const { userID, username, pfpSeed, pfpBackgroundColor, 
                puzzles, userPuzzleCompletion } = res.data;

          console.log(res);

        setPFPBackgroundColor(pfpBackgroundColor);
        setPFPSeed(pfpSeed);
        setPuzzles(puzzles);
        setUserID(userID);
        setUsername(username);
        setUserPuzzleCompletion(userPuzzleCompletion);
        setHasResponded(true);
      })
      .catch((err) => {
        alert(err);
      });
  }

  return (
    <div data-testid="PuzzleSelectionPage" className="puzzleSelectionPage min-vh-100 min-vw-100">
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

      <div data-testid="PuzzleSelectionPage__pfp" className="puzzle_selection_page__profile-link">
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
