import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Container, Modal } from "react-bootstrap";
import { ChangePassword } from "../../components/ChangePassword/ChangePassword";
import "./UserPage.css";

export default function UserPage () {
    const userIcon =
    "https://api.dicebear.com/5.x/adventurer/svg?seed=Gracie&scale=130&radius=20&backgroundType=solid,gradientLinear&randomizeIds=true&backgroundColor=c0aede,b6e3f4,d1d4f9,ffdfbf,ffd5dc";
    
    const [showChange, setShowChange] = useState(false);

    const handleShowChange = () => setShowChange(true);
    const handleCloseChange = () => setShowChange(false);

    //Default values for form data
    const initialFormData = Object.freeze({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [formData, updateFormData] = React.useState(initialFormData);

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim()
        });
    }

    const navigate = useNavigate();

    return(
        <div className="UserPage" data-testid="userPage">
            <div>
                <p className="userPage_Title">User Profile</p>
            </div>
            <div>
                <img className="userPage__ProfilePicture" src={userIcon} data-testid="profilePic" height="75" />
            </div>
            <div>
                <p className="userPage_Username" data-testid="usename"> Username goes here! </p>
            </div>
            <div>
                <Button 
                className="userPage_Button" 
                variant="secondary"
                data-testid="changePassword"
                onClick={handleShowChange}>
                    Change Password
                </Button>
                <Modal show={showChange} onHide={handleCloseChange}>
                    <Modal.Header closeButton>
                        <Modal.Title>Change Password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ChangePassword />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseChange}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}
