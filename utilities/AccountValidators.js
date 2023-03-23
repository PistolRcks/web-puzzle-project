/*  Checks to make sure the password:
    has at least 8 characters
    has an uppercase letter
    has a lowercase letter
    has a digit

    If these requirements are not met, throws an error displaying what is missing
    Returns true if these conditions are met
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
  if ((/^\w+$/.test(passStr))) {
    reqs[4] = false;
  }
  return reqs;
};

const checkUsernameRequirements = (user) => {
  let userStr = String(user);
  if (userStr.length < 5) {
    throw Error("Your username needs to be at least 5 characters");
  }
  if (/^\w+$/.test(userStr)) {
    return true;
  } else {
    throw Error(
      "Your username contains illegal characters, please make sure it contains letters, numbers, and underscores only"
    );
  }
};

module.exports = { checkUsernameRequirements, checkPasswordRequirements };
