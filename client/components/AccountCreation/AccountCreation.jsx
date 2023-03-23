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

  const [passwordLength, setPasswordLength] = useState(false);
  const [passwordUpper, setPasswordUpper] = useState(false);
  const [passwordLower, setPasswordLower] = useState(false);
  const [passwordNumber, setPasswordNumber] = useState(false);
  const [passwordSpecial, setPasswordSpecial] = useState(true);
  const [isPasswordGood, setIsPasswordGood] = useState(false);
  const [isUsernameGood, setIsUsernameGood] = useState(false);
  const [isConfirmPasswordGood, setIsConfirmPasswordGood] = useState(false);

  //formData is an object that holds username, password, confirmPassword
  const [formData, updateFormData] = React.useState(initialFormData);
  const navigate = useNavigate();

useEffect(() => {
  const reqs = checkPasswordRequirements(formData.password);
  setPasswordLength(reqs[0]);
  setPasswordNumber(reqs[1]);
  setPasswordUpper(reqs[2]);
  setPasswordLower(reqs[3]);
  setPasswordSpecial(reqs[4]);
  if(!reqs.includes(false)) {
    setIsPasswordGood(true);
  }
}, [formData.password, formData.confirmPassword]);

useEffect(() => {
  const reqs = checkUsernameRequirements(formData.username);
  
}, [formData.username])

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
      if (formData.password !== formData.confirmPassword) {
        alert("YOUR PASSWORDS DO NOT MATCH");
      } else if (
        checkPasswordRequirements(formData.password) &&
        checkUsernameRequirements(formData.username)
      ) {
        //TODO: Required for flaky test. Should be removed in the future
        console.log("Hey this code works");
        accountCreation(formData)
          .then(() => {
            navigate("/Puzzle/Selection")
          })
          .catch((err) => {
            alert(err)
          })
        props.close();
      }
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
          disabled={isPasswordGood && isConfirmPasswordGood && isUsernameGood ? false : true}
        >
          Create Account
        </Button>
      </Row>
      <Row>
        <Form.Text>
          Password Requirements:
        </Form.Text>
        <Form.Text className= {passwordSpecial ? "AccountCreation__password-req-false" : "AccountCreation__password-req-true"}>
        Only letters, numbers, and underscores are allowed
        </Form.Text>
        <Form.Text className= {passwordLength ? "AccountCreation__password-req-true" : "AccountCreation__password-req-false"}>
          At least 8 characters long
        </Form.Text>
        <Form.Text className= {passwordUpper ? "AccountCreation__password-req-true" : "AccountCreation__password-req-false"}>
          At least 1 uppercase letter
        </Form.Text>
        <Form.Text className= {passwordLower ? "AccountCreation__password-req-true" : "AccountCreation__password-req-false"}>
          At least 1 lowercase letter
        </Form.Text>
        <Form.Text className= {passwordNumber ? "AccountCreation__password-req-true" : "AccountCreation__password-req-false"}>
          At least 1 number
        </Form.Text>
      </Row>
    </Form>
  );
}

export { AccountCreation };
