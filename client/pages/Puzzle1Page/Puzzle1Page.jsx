import React, { useState } from 'react';
import { PuzzleHint } from '../../components/PuzzleHint/PuzzleHint';
import { PuzzleNavBar } from '../../components/PuzzleNavBar/PuzzleNavBar';
import './Puzzle1Page.css';

export default function Puzzle1Page() {

    return(
        <>
            <PuzzleNavBar />
            <PuzzleHint />
            <div className="puzzle1">
                <h1> Hello </h1>
            </div>
            

        </>
    );
}