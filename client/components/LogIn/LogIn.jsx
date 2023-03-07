import React, { Component } from "react";
//import { Link } from 'react-router-dom';
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { Button, Container, Form, Modal, Row } from "react-bootstrap";
import PuzzleSelectionPage from "../../pages/PuzzleSelectionPage/PuzzleSelectionPage";
import {
  checkUsernameRequirements,
  checkPasswordRequirements,
} from "../../../utilities/AccountValidators";

//Default values for form data
const initialFormData = Object.freeze({
  username: "",
  password: "",
});
function LogIn(props) {
  //formData is an object that holds username, password, confirmPassword
  const [formData, updateFormData] = React.useState(initialFormData);
  const navigate = useNavigate();
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
      // check username and password here
      checkUsernameRequirements(formData.username);
      checkPasswordRequirements(formData.password);
      navigate("/Puzzle/Selection");
      console.log("Hey this code works");
      props.close();
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
        <Link to="/Puzzle/Selection">
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmit}
            data-testid="submitButtonLogin"
          >
            Log In
          </Button>
        </Link>
      </Row>
    </Form>
  );
}

export { LogIn };
