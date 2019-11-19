const User = require("../users/model");
const { toData } = require("./jwt");

function auth(req, res, next) {
  // creates an array from the authorization string with [0] containing "Bearer" and [1] containing the JWT.
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");
  // do we have auth at all, and if so, does it include "bearer" and some string?
  if (auth && auth[0] === "Bearer" && auth[1]) {
    // send the JWT to toData which unscrambles it using the key. "data" should be the unscrambled information.
    try {
      const data = toData(auth[1]);
      User.findByPk(data.userId)
        .then(user => {
          if (!user) return next("User does not exist");
          req.user = user;
          next();
        })
        .catch(next);
    } catch (error) {
      res.status(400).send({
        message: `Error ${error.name}: ${error.message}`
      });
    }
  } else {
    res.status(401).send({
      message: "Please supply some valid credentials"
    });
  }
}

module.exports = auth;
