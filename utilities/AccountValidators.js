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

const checkPasswordServer = (pass) => {
  let passStr = String(pass);
  let length = "X";
  let uppercase = "X";
  let lowercase = "X";
  let number = "X";
  let count = 0;

  if (passStr.length > 7) {
    length = "✓";
    count++;
  }
  if (/\d/.test(passStr)) {
    number = "✓";
    count++;
  }
  if (/[A-Z]/.test(passStr)) {
    uppercase = "✓";
    count++;
  }
  if (/[a-z]/.test(passStr)) {
    lowercase = "✓";
    count++;
  }
  if (count < 4) {
    throw Error(
      "Your password does not meet requirements: \nLength: " +
        length +
        "\nUppercase: " +
        uppercase +
        "\nLowercase: " +
        lowercase +
        "\nDigit: " +
        number
    );
  }
  //If the password contains anything else other than letters, numbers, and underscores, this evaluates false
  if (/^\w+$/.test(passStr)) {
    return true;
  } else {
    throw Error(
      "Your password contains illegal characters, please make sure it contains letters, numbers, and underscores only"
    );
  }
};

const checkUsernameServer = (user) => {
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

module.exports = { checkUsernameRequirements, checkPasswordRequirements, checkPasswordServer, checkUsernameServer };
