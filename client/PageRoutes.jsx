import React from 'react'

import { Route, Routes } from 'react-router-dom'
import { AccountCreation } from './components/AccountCreation/AccountCreation';
import LandingPage from './pages/LandingPage/LandingPage.jsx'
import Puzzle1Page from './pages/Puzzle1Page/Puzzle1Page';
import PuzzleSelectionPage from './pages/PuzzleSelectionPage/PuzzleSelectionPage.jsx';
import Verify from './components/Verify/Verify.jsx';

export default function PageRoutes() {
  /**
   * ! When creating a new page:
   * TODO: Add a Route component to the under the Route with the Verify element
   *    TODO: The element should be the react element for your page. Make sure to import it!
   * TODO: Head to server/index.js
   *    TODO: Add your route to the array on line 19 with the form '/YOUR_PAGE'
   * 
   * Sweet! Now, run `npm run build` and `npm start`
   * Then head over to localhost:YOUR_PORT/YOUR_ROUTE to see your changes!
   */
  return (
    <>
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="/Puzzle/Selection" element={<Verify><PuzzleSelectionPage /></Verify>} />
      <Route path="/Puzzle/1" element={<Verify><Puzzle1Page /></Verify>} />
    </Routes>
    </>
  );
}
