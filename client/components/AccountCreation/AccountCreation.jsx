import React, { Component } from "react";
import { Button, Container, Form, Modal, Row } from "react-bootstrap";
import {
  checkUsernameRequirements,
  checkPasswordRequirements,
} from "../../../utilities/AccountValidators";
import './AccountCreation.css';
import { accountCreation } from "../../api/DataHelper";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

//Default values for form data
const initialFormData = Object.freeze({
  username: "",
  password: "",
  confirmPassword: "",
});

function AccountCreation(props) {

  //Use states for password validation
  const [passwordValidation, setPasswordValidation] = useState([false, false, false, false, true]);

  //Use states for username validation
  const [usernameLength, setUsernameLength] = useState(false);
  const [usernameSpecial, setUsernameSpecial] = useState(false);

  //Use states for form validation
  const [isPasswordGood, setIsPasswordGood] = useState(false);
  const [isUsernameGood, setIsUsernameGood] = useState(false);
  const [isConfirmPasswordGood, setIsConfirmPasswordGood] = useState(false);

  //formData is an object that holds username, password, confirmPassword
  const [formData, updateFormData] = useState(initialFormData);
  const navigate = useNavigate();

  //useEffects hook into these, I promise
  const [passwordCounter, updatePasswordCounter] = useState(0);
  const [usernameCounter, updateUsernameCounter] = useState(0);

  const usernameDisplay = (
    <Row>
      <Form.Text>
        Username Requirments:
      </Form.Text>
      <Form.Text className = {usernameSpecial ? "AccountCreation__req-true" : "AccountCreation__req-false"}>
        Only letters, numbers, and underscores are allowed
      </Form.Text>
      <Form.Text className = {usernameLength ? "AccountCreation__req-true" : "AccountCreation__req-false"}>
        At least 5 characters long
      </Form.Text>
    </Row>
    );
  
    const passwordDisplay = (
    <Row>
      <Form.Text>
        Password Requirements:
      </Form.Text>
      <Form.Text className= {passwordValidation[4] ? "AccountCreation__req-true" : "AccountCreation__req-false"}>
      Only letters, numbers, and underscores are allowed
      </Form.Text>
      <Form.Text className= {passwordValidation[0] ? "AccountCreation__req-true" : "AccountCreation__req-false"}>
        At least 8 characters long
      </Form.Text>
      <Form.Text className= {passwordValidation[2] ? "AccountCreation__req-true" : "AccountCreation__req-false"}>
        At least 1 uppercase letter
      </Form.Text>
      <Form.Text className= {passwordValidation[3] ? "AccountCreation__req-true" : "AccountCreation__req-false"}>
        At least 1 lowercase letter
      </Form.Text>
      <Form.Text className= {passwordValidation[1] ? "AccountCreation__req-true" : "AccountCreation__req-false"}>
        At least 1 number
      </Form.Text>
      <Form.Text className= {isConfirmPasswordGood ? "AccountCreation__req-true" : "AccountCreation__req-false"}>
        Passwords match
      </Form.Text>
    </Row>
    );

    //What gets displayed
    const [requirementsDisplay, setRequirementsDisplay] = useState(usernameDisplay);

  //These useEffects change what requirements are displayed
  useEffect(() => {
    setRequirementsDisplay(usernameDisplay);
  }, [usernameCounter]);

  useEffect(() => {
    setRequirementsDisplay(passwordDisplay);
  }, [passwordCounter]);
  
  //These useEffects control the css on the requirements
  useEffect(() => {
    if(!passwordValidation.includes(false)) {
      setIsPasswordGood(true);
    }
    else {
      setIsPasswordGood(false);
    }
  }, [passwordValidation]);

  useEffect(() => {
    if(usernameLength && usernameSpecial) {
      setIsUsernameGood(true);
    }
    else {
      setIsUsernameGood(false);
    }
  }, [usernameLength, usernameSpecial])

  //Validates password
  useEffect(() => {
    setPasswordValidation(checkPasswordRequirements(formData.password));
  }, [formData.password]);

  //Validates username
  useEffect(() => {
    const reqs = checkUsernameRequirements(formData.username);
    setUsernameLength(reqs[0]);
    setUsernameSpecial(reqs[1]);
    updateUsernameCounter(usernameCounter+1);
  }, [formData.username])

  //Validates confirmPassword
  useEffect(() => {
    if(formData.password == formData.confirmPassword) {
      setIsConfirmPasswordGood(true);
    }
    else {
      setIsConfirmPasswordGood(false);
    }
    updatePasswordCounter(passwordCounter+1);
  }, [formData.confirmPassword, formData.password])

  //Whenever username or confirmPassword input boxes change, this saves the new data to formData
  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim()
    });
  };

  //Whenever the submit button is clicked, this checks to make sure the passwords match and calls another func
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      console.log("Hey this code works")
      accountCreation(formData)
        .then(() => {
          navigate("/Puzzle/Selection")
        })
        .catch((err) => {
          alert(err)
        })
      props.close();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className = "AccountCreation">
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
          className="button create-account-button"
          variant="secondary"
          type="submit"
          onClick={handleSubmit}
          data-testid="submitButton"
          disabled={isConfirmPasswordGood && isPasswordGood && isUsernameGood ? false : true}
        >
          Create Account
        </Button>
      </Row>
      {requirementsDisplay}
    </Form>
  );
}

export { AccountCreation };
