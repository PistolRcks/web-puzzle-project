import React, { Component } from "react";
import { Button, Container, Form, Modal, Row } from "react-bootstrap";
import {
  checkUsernameRequirements,
  checkPasswordRequirements,
} from "../../../utilities/AccountValidators";
import './AccountCreation.css';

//Default values for form data
const initialFormData = Object.freeze({
  username: "",
  password: "",
  confirmPassword: "",
});

function AccountCreation(props) {
  //formData is an object that holds username, password, confirmPassword
  const [formData, updateFormData] = React.useState(initialFormData);

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
      if (formData.password !== formData.confirmPassword) {
        alert("YOUR PASSWORDS DO NOT MATCH");
      } else if (
        checkPasswordRequirements(formData.password) &&
        checkUsernameRequirements(formData.username)
      ) {
        //TODO send the formData to the backend
        console.log("Hey this code works"); // TODO: Required for flaky test. Should be removed in the future
        props.close();
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
          data-testid="username"
          name="username"
          onChange={handleChange}
        />
      </Row>
      <Row className="mb-3">
        <Form.Text>Enter Password:</Form.Text>
        <Form.Control
          type="password"
          data-testid="password"
          name="password"
          onChange={handleChange}
        />
      </Row>
      <Row className="mb-3">
        <Form.Text>Confirm Password:</Form.Text>
        <Form.Control
          type="password"
          data-testid="confirmPassword"
          name="confirmPassword"
          onChange={handleChange}
        />
      </Row>
      <Row>
        <Button
          variant="primary"
          type="submit"
          onClick={handleSubmit}
          data-testid="submitButton"
        >
          Create Account
        </Button>
      </Row>
    </Form>
  );
}

export { AccountCreation };
