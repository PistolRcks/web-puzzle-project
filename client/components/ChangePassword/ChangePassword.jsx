import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Row } from "react-bootstrap";
import { changePassword } from "../../api/DataHelper";
import "./ChangePassword.css"
import { checkPasswordRequirements } from "../../../utilities/AccountValidators";

//Default values for form data
const initialFormData = Object.freeze({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
});


function ChangePassword(props) {
    //formData is an object that holds currentPassword, newPassword, and confirmNewPassword
    const [formData, updateFormData] = React.useState(initialFormData);
    const navigate = useNavigate();
    //Whenever username or confirmPassword input boxes change, this saves the new data to formData
    const handleChange = (e) => {
    updateFormData({
        ...formData,
        [e.target.name]: e.target.value.trim(),
      });
    };
    //See if new password meets requirements, and new password is confirmed, then close page
    const handleSubmit = (e) => {
        e.preventDefault();
        try {
        if(checkPasswordRequirements(formData.newPassword) && 
        (formData.newPassword == formData.confirmNewPassword)) {
            changePassword(formData)
            .then((res) => {
            //No need to navigate anywhere else from this point.
            //Give user the option to continue viewing user profile
            props.close();
            })
            .catch((err) => {
            alert(err)
            })
        }
      console.log("Hey this code works");
    } catch (error) {
      alert(error.message);
    }
  };
    return(
        <Form onSubmit={handleSubmit}>
            <Row className="changePassword_Label">
                <Form.Text>Enter Current Password:</Form.Text>
                <Form.Control 
                    type="password"
                    data-testid="currentPassword"
                    name="currentPassword"
                    onChange={handleChange}
                />
            </Row>
            <Row className="changePassword_Label">
                <Form.Text>Enter New Password:</Form.Text>
                <Form.Control
                    type="password"
                    data-testid="newPassword"
                    name="newPassword"
                    onChange={handleChange}
                />
            </Row>
            <Row className="changePassword_Label">
                <Form.Text>Confirm New Password:</Form.Text>
                <Form.Control
                    type="password"
                    data-testid="confirmNewPassword"
                    name="confirmNewPassword"
                    onChange={handleChange}
                />
            </Row>
            <Row>
                <Button
                    className="changePassword_Submit"
                    variant="primary"
                    type="submit"
                    data-testid="changePassword_Submit"
                    onClick={handleSubmit}
                >
                    Change Password
                </Button>
            </Row>
        </Form>
    );
}

export { ChangePassword };