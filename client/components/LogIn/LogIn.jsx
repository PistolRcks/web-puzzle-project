import React, {Component} from 'react';
//import { Link } from 'react-router-dom';
import {Link, Routes, Route, useNavigate} from 'react-router-dom';
import { Button, Container, Form, Modal, Row } from 'react-bootstrap';
import PuzzleSelectionPage from '../../pages/PuzzleSelectionPage/PuzzleSelectionPage';

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
             [e.target.name]: e.target.value.trim()
         });
     }
     //Whenever the submit button is clicked, this checks to make sure the passwords match and calls another func
     const handleSubmit = (e) => {
         e.preventDefault();
         if(checkPass(formData.password) && checkUsername(formData.username)) {
             //TODO send the formData to the backend
             navigate('/Puzzle/Selection');
             console.log("Hey this code works");
             props.close();
         }
     }
 
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
             <Button variant="primary" type="submit" onClick={handleSubmit} data-testid="submitButtonLogin">Log In</Button>
             </Link>
             </Row>
         </Form>
     );
 }
 /*  Checks to make sure the password:
     has at least 8 characters
     has an uppercase letter
     has a lowercase letter
     has a digit
 
     If these requirments are not met, an alert displays what is missing
     Returns true if these conditions are met
 */
     const checkPass = (pass) => {
     let passStr = String(pass);
     
     //If the password contains anything else other than letters, numbers, and underscores, this evaluates false
     if(/^\w+$/.test(passStr)) {
         return true;
     }
     else {
         alert("The password you entered contains illegal characters")
         return false;
     }
 }
 
 const checkUsername = (user) => {
     let userStr = String(user);
     if(userStr.length < 5) {
         alert("Wrong  Username, Your Username should be atleast 5 characters long")
         return false;
     }
     if(/^\w+$/.test(userStr)) {
         return true;
     }
     else {
         alert("The username you entered contains illegal characters")
         return false;
     }
 }
 
 export {
     LogIn,
     checkPass,
     checkUsername
 }

