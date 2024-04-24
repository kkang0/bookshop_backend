const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const ensureAuthorization = (req, res) => {
  try {
    let receivedJwt = req.headers["authorization"];
    console.log("received jwt: ", receivedJwt);

    if (receivedJwt) {
      let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
      console.log(decodedJwt);

      return decodedJwt;
    } else {
      throw new ReferenceError("로그인 안되어 있음");
    }
  } catch (err) {
    console.log(err.name);
    console.log(err.message);

    return err;
  }
};

module.exports = ensureAuthorization;
