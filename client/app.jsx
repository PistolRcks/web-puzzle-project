import React from 'react'
import { createRoot } from 'react-dom/client'
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

import EntryPoint from './EntryPoint.jsx'

// Start point for the entire front end of the web app
createRoot(
  document.getElementById('root')
).render(
  <EntryPoint />
)
