import React, {Component} from 'react';
import "./AccountCreation.css"

const initialFormData = Object.freeze({
    username: "",
    password: "",
    confirmPassword: ""
});

export default function AccountCreation(props) {
    const [formData, updateFormData] = React.useState(initialFormData);

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim()
        });
    }
    const handleChangePassword = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim()
        });
        console.log(e.target.value.trim());
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData)
        if(formData.password !== formData.confirmPassword) {
            alert("YOUR PASSWORDS DO NOT MATCH")
        }
        
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <br/>
                    <input onChange={handleChange} name="username" />
                </label>
                <label>
                    <br/>
                    Password:
                    <br/>
                    <input onChange={handleChangePassword} name="password" />
                </label>
                <label>
                    <br/>
                    Confirm Password:
                    <br/>
                    <input onChange={handleChange} name="confirmPassword" />
                </label>
                <br/>
            </form>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}