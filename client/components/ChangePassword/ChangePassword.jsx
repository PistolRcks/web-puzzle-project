import React, { Component } from "react";
import { Button, Container, Form, Modal, Row } from "react-bootstrap";
import "./ChangePassword.css"

function ChangePassword(props) {
  return (
    <div className="changePassword">
            <form>
                <div className="form-group">
                    <label htmlFor="currentPassword">Current Password:</label>
                    <input type="password" className="form-control" id="currentPassword" />
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">New Password:</label>
                    <input type="password" className="form-control" id="newPassword" />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmNewPassword">Confirm New Password:</label>
                    <input type="password" className="form-control" id="confirmNewPassword" />
                </div>
                <button type="submit" className="changePassword_Submit">Change Password</button>
            </form>
        </div>
  );
}

export { ChangePassword };

