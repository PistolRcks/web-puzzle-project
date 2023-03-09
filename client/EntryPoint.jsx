import React from 'react'

import { BrowserRouter } from 'react-router-dom'

import PageRoutes from './PageRoutes.jsx'



// The entry point of the entire react app
// Exists to give a location for managing state effectively without overfilling app.jsx
export default function EntryPoint (props) {
  return (
    <BrowserRouter>
      <PageRoutes />
    </BrowserRouter>
  )
}
