import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Button, Form, Container, Modal } from "react-bootstrap";
//import { ChangePassword } from "../../api/DataHelper";
import "./UserPage.css";

export default function UserPage () {
    const userIcon =
    "https://api.dicebear.com/5.x/adventurer/svg?seed=Gracie&scale=130&radius=20&backgroundType=solid,gradientLinear&randomizeIds=true&backgroundColor=c0aede,b6e3f4,d1d4f9,ffdfbf,ffd5dc";
    
    const [showChange, setShowChange] = useState(false);
    const handleShowChange = () => setShowChange(true);
    const handleCloseChange = () => setShowChange(false);

    return(
        <div className="UserPage">
            <div>
                <p className="userPage_Title">User Profile</p>
            </div>
            <div>
                <img className = "userPage__ProfilePicture" src = {userIcon} height="75" />
            </div>
            <div>
                <p className="userPage_Username"> Username goes here! </p>
            </div>
            <div>
                <Button 
                className="userPage_Button" 
                variant="secondary"
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
