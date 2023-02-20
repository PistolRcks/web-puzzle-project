import React, {Component} from 'react';
import { Button, Container, Form, Modal, Row } from 'react-bootstrap';

//Default values for form data
const initialFormData = Object.freeze({
    username: "",
    password: "",
    confirmPassword: ""
});

function AccountCreation(props) {
    //formData is an object that holds username, password, confirmPassword
    const [formData, updateFormData] = React.useState(initialFormData);

    //Whenever username or confirmPassword input boxes change, this saves the new data to formData
    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim()
        });
    }
    //Whenever the submit button is clicked, this checks to make sure the passwords match and calls another func
    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            if(formData.password !== formData.confirmPassword) {
                alert("YOUR PASSWORDS DO NOT MATCH");
            }
            else if(checkPasswordRequirements(formData.password) && checkUsernameRequirements(formData.username)) {
                //TODO send the formData to the backend
                console.log("Hey this code works");
                props.close();
            }
        } catch (error) {
           alert(error.message); 
        }
    }

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
            <Button variant="primary" type="submit" onClick={handleSubmit} data-testid="submitButton">Create Account</Button>
            </Row>
        </Form>
    );
}
/*  Checks to make sure the password:
    has at least 8 characters
    has an uppercase letter
    has a lowercase letter
    has a digit

    If these requirements are not met, throws an error displaying what is missing
    Returns true if these conditions are met
*/
    const checkPasswordRequirements = (pass) => {
    let passStr = String(pass);
    let length = "X";
    let uppercase = "X";
    let lowercase = "X";
    let number = "X";
    let count = 0;

    if(passStr.length > 7) {
        length = "✓";
        count++;
    }
    if(/\d/.test(passStr)) {
        number = "✓";
        count++;
    }
    if(/[A-Z]/.test(passStr)) {
        uppercase = "✓";
        count++;
    }
    if(/[a-z]/.test(passStr)) {
        lowercase = "✓";
        count++;
    }
    if(count < 4) {
        throw Error("Your password does not meet requirements: \nLength: "
        + length + "\nUppercase: " + uppercase + "\nLowercase: "
        + lowercase + "\nDigit: " + number);
    }
    //If the password contains anything else other than letters, numbers, and underscores, this evaluates false
    if(/^\w+$/.test(passStr)) {
        return true;
    }
    else {
        throw Error("Your password contains illegal characters, please make sure it contains letters, numbers, and underscores only")
    }
}

const checkUsernameRequirements = (user) => {
    let userStr = String(user);
    if(userStr.length < 5) {
        throw Error("Your username needs to be at least 5 characters")
    }
    if(/^\w+$/.test(userStr)) {
        return true;
    }
    else {
        throw Error("Your username contains illegal characters, please make sure it contains letters, numbers, and underscores only")
    }
}

export {
    AccountCreation,
    checkPasswordRequirements,
    checkUsernameRequirements
}