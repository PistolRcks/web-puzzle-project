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
