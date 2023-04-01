import React, { Component, useState, useEffect } from "react";
//import { Link } from 'react-router-dom';
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { Button, Container, Form, Modal, Row } from "react-bootstrap";
import PuzzleSelectionPage from "../../pages/PuzzleSelectionPage/PuzzleSelectionPage";
import { logIn } from "../../api/DataHelper";
import {
  checkUsernameRequirements,
  checkPasswordRequirements,
} from "../../../utilities/AccountValidators";
import "./LogIn.css";

//Default values for form data
const initialFormData = Object.freeze({
  username: "",
  password: "",
});
function LogIn(props) {
  //formData is an object that holds username, password, confirmPassword
  const [formData, updateFormData] = useState(initialFormData);
  const navigate = useNavigate();

  // use state that holds a boolean to display an error message if the user submits an invalid username or password
  const [errors, setErrors] = useState(false);

  //Whenever username or confirmPassword input boxes change, this saves the new data to formData
  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };
  //Whenever the submit button is clicked, this checks to make sure the passwords match and calls another func
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (
        checkUsernameRequirements(formData.username) &&
        checkPasswordRequirements(formData.password)
      ) {
        logIn(formData) // if formData contains valid credentials, log in and send the user to puzzle selection
          .then(() => {
            //TODO: The api will have to send me back something here so I have have a userID on the front end
            navigate("/Puzzle/Selection");
          }) // if formData doesn't contain valid credentials, set errors to true
          .catch(() => {
            setErrors(true);
          });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Text>Enter Username:</Form.Text>
        <Form.Control
          type="text"
          data-testid="usernameLogin"
          name="username"
          onChange={handleChange}
        />
      </Row>
      <Row className="mb-3">
        <Form.Text>Enter Password:</Form.Text>
        <Form.Control
          type="password"
          data-testid="passwordLogin"
          name="password"
          onChange={handleChange}
        />
      </Row>
      <Row>
        <Button
          className="button login-button"
          variant="primary"
          type="submit"
          onClick={handleSubmit}
          data-testid="submitButtonLogin"
        >
          Log In
        </Button>
      </Row>
      <Row>
        <Form.Text className={errors ? "error-true" : "error-false"}>
          Incorrect username or password
        </Form.Text>
      </Row>
    </Form>
  );
}

export { LogIn };
