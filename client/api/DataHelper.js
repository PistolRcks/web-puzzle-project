const axios = require('axios')

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