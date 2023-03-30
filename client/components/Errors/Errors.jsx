import React from "react";
import { Link } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

import "./Errors.css";

/**
 * 
 * @returns a 401 - Unauthorized Component
 */
export const Error401 = () => {
  return (
    <div className="Error min-vh-100 min-vw-100">
      <h1>401 - Unauthorized</h1>
      <Container className="Error__text-container">
        <p>You must login before continuing.</p>
      </Container>
      <Link to="/">
        <Button className="Error__button">Back to Home</Button>
      </Link>
    </div>
  );
}

/**
 * 
 * @returns a 404 - Not Found Component
 */
export const Error404 = () => {
  return(
    <div className="Error min-vh-100 min-vw-100">
      <h1>404 - Not Found</h1>
      <Container className= "Error__text-container">
        <p>The desired page has not been found.</p>
      </Container>
      <Link to="/">
        <Button className="Error__button">Back to Home</Button>
      </Link>
    </div>
  );
}