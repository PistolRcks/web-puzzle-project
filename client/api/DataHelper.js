import axios from "axios";

axios.defaults.withCredentials = true;

/**
 * Makes an API call to '/api/verify' to authenticate the session. If the session does not exist or is invalid, an error will be thrown.
 * @returns a Promise containing the response of the axios call
 */
export function verifySession() {
  return new Promise((resolve, reject) => {
    axios
      .get("/api/verify")
      .then((response) => {
        return resolve(response);
      })
      .catch((error) => {
        return reject(error);
      });
  });
}

//TODO accountCreation and logIn can be combined eventually and take a second parameter for the different route
//TODO since they are the same exact function minus that

//Function that calls the signup post
export function accountCreation(userData) {
  const { username, password } = userData;
  return new Promise((resolve, reject) => {
    axios
      .post("/api/signup", {
        username,
        password,
      })
      .then(function (res) {
        return resolve(res);
      })
      .catch(function (err) {
        return reject(err);
      });
  });
}

//Function that calls the login post
export function logIn(userData) {
  const { username, password } = userData;
  return new Promise((resolve, reject) => {
    axios
      .post("/api/login", {
        username,
        password,
      })
      .then(function (res) {
        return resolve(res);
      })
      .catch(function (err) {
        return reject(err);
      });
  });
}

//Function that calls the logout post
export function logOut(userData) {
  return new Promise((resolve, reject) => {
    axios
      .post("/api/logout")
      .then(function (res) {
        alert("You have been logged out.");
        return resolve(res);
      })
      .catch(function (err) {
        return reject(err);
      });
  });
}

//Function that calls the listPuzzles get
export function listPuzzles() {
  return new Promise((resolve, reject) => {
    axios
      .get("/api/listPuzzles")
      .then(function (res) {
        return resolve(res);
      })
      .catch(function (err) {
        return reject(err);
      });
  });
}

//Function that calls the googleLogin post
export async function googleLogin(googleIdToken) {
    return new Promise((resolve, reject) => {
        axios.post('/api/googleLogin', {
            googleIdToken,
        })
        .then(function(res) {
            return resolve(res);
        })
        .catch(function(err) {
            return reject(err);
        })
    });
}

/**
 * 
 * @see /api/randomWord for more info on how to structure the requirements
 * @param {Array} requirements the object with an array of requirements of the words needed
 * @returns resolve or reject
 */
export async function randomWord(requirements) {
  return new Promise((resolve, reject) => {
    axios.post('/api/word', 
      requirements
    )
    .then((res) => {
      return resolve(res);
    })
    .catch((err) => {
      return reject(err);
    })
  });
}

/**
 * Calls the /api/user/:user_id GET route to return a user's information.
 * 
 * Doesn't do anything if the userID === -1
 * @see /api/user/:user_id for more info on what is returned
 * @param {Number} userID - The userID to get info from
 * @returns {Promise} that resolves to the data or rejects with an error
 */
export function getUserInfo(userID) {
  return new Promise((resolve, reject) => {
    if (userID !== -1) {
      axios.get(`/api/user/${userID}`)
      .then((res) => {
        return resolve(res);
      })
      .catch((err) => {
        return reject(err);
      })
    } else {
      return reject("getUserInfo: Sent bad userID, passing...")
    }
  });
}
