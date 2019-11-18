const { Router } = require("express");
const bcryptjs = require("bcryptjs");
const { toJWT, toData } = require("./jwt");

const router = new Router();

const User = require("../users/model");
const auth = require("./middleware");

// define endpoints here
router.post("/login", (req, res, next) => {
  console.log("reqest body", req.body);
  const { username, password } = req.body;
  console.log("username password ", username, password);

  if (!username || !password) {
    console.log("?????");
    res.status(400).send({
      message: "give me a name and a password"
    });
  } else {
    // 1. find user based on username

    User.findOne({
      where: {
        username: username
      }
    })
      .then(user => {
        if (!user) {
          res.status(400).send({
            message: "You do not exist. Please disappear."
          });
          // 2. use bcryptjs.compareSync to check the password against the stored hash
        } else if (bcryptjs.compareSync(password, user.password)) {
          // 3. if the password is correct, return a JWT with the userId of the user (user.id)
          res.send(user);
        } else {
          res.status(400).send({
            message: "You got your password wrong you moron"
          });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({
          message: "Something went fucky-uppy"
        });
      });
  }
});

module.exports = router;
