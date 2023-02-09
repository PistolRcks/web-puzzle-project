import React, {Component} from 'react';
import './AccountCreation.css'

function handleSubmit(event) {
    console.log('hi')
}

export default class AccountCreation extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    handleSubmit(event) {
        alert("THIS IS YOUR PASSWORD: " + this.state.value);
        event.preventDefault();
    }
    render() {
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <br/>
                        <input type="text" name="username" />
                    </label>
                    <label>
                        <br/>
                        Password:
                        <br/>
                        <input type="text" name="password" value={this.state.value} onChange={this.handleChange}/>
                    </label>
                    <label>
                        <br/>
                        Confirm Password:
                        <br/>
                        <input type="text" name="confirmPassword" />
                    </label>
                    <br/>
                    <button type="submit">Create</button>
                </form>
            </div>
        );
    }
}