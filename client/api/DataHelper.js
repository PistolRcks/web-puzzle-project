const axios = require('axios')

//TODO accountCreation and logIn can be combined eventually and take a second parameter for the different route
//TODO since they are the same exact function minus that

//Function that calls the signup post
export function accountCreation(userData) {
    const{username, password} = userData;
    return new Promise((resolve, reject) => {
        axios.post('/api/signup', {
            username,
            password
            })
            .then(function(res) {
                return resolve(res);
            })
            .catch(function(err) {
                return reject(err)
            })
    });
}

//Function that calls the login post
export function logIn(userData) {
    const{username, password} = userData;
    return new Promise((resolve, reject) => {
        axios.post('/api/login', {
            username,
            password
        })
        .then(function(res) {
            return resolve(res);
        })
        .catch(function(err) {
            return reject(err);
        })
    });
}

//Function that calls the listPuzzles get
export function listPuzzles() {
    return new Promise((resolve, reject) => {
        axios.get('/api/listPuzzles')
            .then(function(res) {
                return resolve(res);
            })
            .catch(function(err) {
                return reject(err);
            })
    });
}