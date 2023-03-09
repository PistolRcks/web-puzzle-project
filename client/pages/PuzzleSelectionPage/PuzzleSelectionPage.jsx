import React from "react";
import { Link } from "react-router-dom";
import { Button, Form, Container } from "react-bootstrap";
import { useState } from "react";

import back from "../../assets/back-arrow.png";

import { PuzzleItem } from "../../components/PuzzleItem/PuzzleItem.jsx";
import { listPuzzles } from "../../api/DataHelper";
import "./PuzzleSelectionPage.css";

export default function PuzzleSelectionPage() {
  const userIcon = "https://api.dicebear.com/5.x/adventurer/svg?seed=Gracie&scale=130&radius=20&backgroundType=solid,gradientLinear&randomizeIds=true&backgroundColor=c0aede,b6e3f4,d1d4f9,ffdfbf,ffd5dc";

  const [puzzles, setPuzzles] = useState([{puzzle_id:1, title:"title", description:"description"}]);
  const [hasResponded, setHasResponded] = useState(false);
  const [userID, setUserID] = useState(-1);
  const [userName, setUsername] = useState("");

  //If puzzles is still default, this evaluates to true
  //hasResponded makes sure that if there is 1 puzzle in the DB that we don't accidentally
  //infinitely call the api for puzzles (ran into this issue during testing)
  if(puzzles.length == 1 && !hasResponded) {
    listPuzzles()
    .then((res) => {
      setPuzzles(res.data.rows);
      setUserID(res.data.userID)
      setUsername(res.data.username)
      setHasResponded(true);
    })
    .catch((err) => {
      alert(err);
    })
  }

  return (
    <div className="puzzleSelectionPage min-vh-100 min-vw-100">
      <div className="puzzleSelectionPage__backButtonDiv">
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
