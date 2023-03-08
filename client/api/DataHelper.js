import axios from 'axios';

/**
 * Makes an API call to '/api/verify' to authenticate the session. If the session does not exist or is invalid, an error will be thrown.
 * @returns a Promise containing the response of the axios call
 */
export function verifySession() {
  return new Promise((resolve, reject) => {
    axios.get('/api/verify')
      .then((response) => { 
        return resolve(response) })
      .catch((error) => { return reject(error) })
  });
}

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
