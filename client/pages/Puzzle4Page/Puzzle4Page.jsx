import React from "react";
import { PuzzleHint } from "../../components/PuzzleHint/PuzzleHint";
import { PuzzleNavBar } from "../../components/PuzzleNavBar/PuzzleNavBar";

export default function Puzzle4Page() {
    return (
        <>
            <PuzzleNavBar puzzleNum={4}/>
            <PuzzleHint/>
        </>
    )
}