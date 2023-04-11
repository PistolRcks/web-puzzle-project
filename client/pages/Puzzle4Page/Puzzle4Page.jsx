import React, { useState, useEffect } from "react";
import { listPuzzles } from "../../api/DataHelper";
import { PuzzleHint } from "../../components/PuzzleHint/PuzzleHint";
import { PuzzleNavBar } from "../../components/PuzzleNavBar/PuzzleNavBar";

export default function Puzzle4Page() {
    //Use state for puzzle description
    const [puzzleDesc, setPuzzleDesc] = useState("");
    const [hasResponded, setHasResponded] = useState(false);


    //Database call to get the puzzle description on this page
    //Realistically this could be done in a better way, but it would require something
    //that is out of scope for my project
    if(!hasResponded) {
        listPuzzles().then((res) => {
            setHasResponded(true);
            setPuzzleDesc(res.data.puzzles[3].description);
        }).catch((err) => {
            alert(err);
        });
    }

    return (
        <>
            <PuzzleNavBar puzzleNum={4} puzzleDesc={puzzleDesc}/>
            <PuzzleHint/>
        </>
    )
}