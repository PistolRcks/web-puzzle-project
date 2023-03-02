const axios = require('axios')

export function accountCreation(userData) {
    const{username, password} = userData;
    axios.post('/api/signup', {
        username,
        password
        })
        .then(function(res) {
            console.log(res);
        })
        .catch(function(err) {
            console.log(err);
        })
        .finally(function() {
            console.log("done");
        })
}