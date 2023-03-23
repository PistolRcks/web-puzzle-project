/*  Checks to make sure the password:
    has at least 8 characters
    has an uppercase letter
    has a lowercase letter
    has a digit
*/
const checkPasswordRequirements = (pass) => {
  let reqs = [false, false, false, false, true];
  let passStr = String(pass);

  if (passStr.length > 7) {
    reqs[0] = true;
  }
  if (/\d/.test(passStr)) {
    reqs[1] = true;
  }
  if (/[A-Z]/.test(passStr)) {
    reqs[2] = true;
  }
  if (/[a-z]/.test(passStr)) {
    reqs[3] = true;
  }
  //If the password contains anything else other than letters, numbers, and underscores, this evaluates false
  if (/^\w+$/.test(passStr)) {
    reqs[4] = true;
  }
  else {
    reqs[4] = false;
  }
  return reqs;
};

const checkUsernameRequirements = (user) => {
  let userStr = String(user);
  let reqs = [false, true];
  if (userStr.length > 4) {
    reqs[0] = true;
  }
  if (/^\w+$/.test(userStr)) {
    reqs[1] = true;
  }
  else {
    reqs[1] = false;
  }
  return reqs;
};

module.exports = { checkUsernameRequirements, checkPasswordRequirements };
