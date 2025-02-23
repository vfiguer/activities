//import CryptoJS from "crypto-js";

const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

function passwordEncrypt(password) {
  var salt = generateSalt();
  const saltedPassword = password + salt;
  const hash = CryptoJS.SHA256(saltedPassword).toString();
  // saveToFile(hash, salt);
  return [hash, salt];
}

function checkPassword(inputPassword, storedHash, salt) {
  const saltedInputPassword = inputPassword + salt;
  const hash = CryptoJS.SHA256(saltedInputPassword).toString();

  return hash == storedHash;
}

function generateSalt() {
  let generateSalt = (rounds) => {
    if (rounds >= 15) {
      throw new Error(`${rounds} is greater than 15,Must be less that 15`);
    }
    if (typeof rounds !== "number") {
      throw new Error("rounds param must be a number");
    }
    if (rounds == null) {
      rounds = 12;
    }
    return crypto
      .randomBytes(Math.ceil(rounds / 2))
      .toString("hex")
      .slice(0, rounds);
  };
}




function validateEmail(email) {
  return regexEmail.test(email);
}

function validatePassword(password) {
  return regexPassword.test(password);
}

export {
  checkPassword, passwordEncrypt,
  validateEmail,
  validatePassword
};

