import React, {Component} from 'react';

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
        console.log(formData.username);
    }
    //Whenever the submit button is clicked, this checks to make sure the passwords match and calls another func
    const handleSubmit = (e) => {
        e.preventDefault();
        if(formData.password !== formData.confirmPassword) {
            alert("YOUR PASSWORDS DO NOT MATCH");
        }
        else if(checkPasswordRequirements(formData.password) && checkUsernameRequirements(formData.username)) {
            //TODO send the formData to the backend
            console.log("Hey this code works");
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <br/>
                    <input onChange={handleChange} data-testid="username" name="username"/>
                </label>
                <label>
                    <br/>
                    Password:
                    <br/>
                    <input onChange={handleChange} data-testid="password" type="password" name="password"/>
                </label>
                <label>
                    <br/>
                    Confirm Password:
                    <br/>
                    <input onChange={handleChange} data-testid="confirmPassword" type="password" name="confirmPassword"/>
                </label>
                <br/>
            </form>
            <button onClick={handleSubmit} data-testid="submitButton">Submit</button>
        </div>
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
        alert("Your password does not meet requirements: \nLength: "
        + length + "\nUppercase: " + uppercase + "\nLowercase: "
        + lowercase + "\nDigit: " + number);
        return false;
    }
    //If the password contains anything else other than letters, numbers, and underscores, this evaluates false
    if(/^\w+$/.test(passStr)) {
        return true;
    }
    else {
        alert("Your password contains illegal characters, please make sure it contains letters, numbers, and underscores only")
        return false;
    }
}

const checkUsernameRequirements = (user) => {
    let userStr = String(user);
    console.log(userStr);
    if(userStr.length < 5) {
        alert("Your username needs to be at least 5 characters")
        return false;
    }
    if(/^\w+$/.test(userStr)) {
        return true;
    }
    else {
        alert("Your username contains illegal characters, please make sure it contains letters, numbers, and underscores only")
        return false;
    }
}

export {
    AccountCreation,
    checkPasswordRequirements,
    checkUsernameRequirements
}