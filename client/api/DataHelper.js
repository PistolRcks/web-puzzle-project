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

export function changePassword(userData) {
  const { newPassword } = userData;
  return new Promise((resolve, reject) => {
    axios
      .post("api/userInfo", {
        newPassword,
      })
      .then(function (res) {
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
