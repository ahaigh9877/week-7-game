const { Router } = require("express");
const bcryptjs = require("bcryptjs");
const { toJWT, toData } = require("./jwt");

const router = new Router();

const User = require("../users/model");
const auth = require("./middleware");

// define endpoints here
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  console.log("username password ", username, password);

  if (!username || !password) {
    console.log("No username / no password");
    res.status(400).send({
      message: "give me a name and a password"
    });
  } else {
    User.findOne({
      where: {
        username: username
      }
    })
      .then(user => {
        console.log("user: ", user);
        if (!user) {
          res.status(400).send({
            message: "You do not exist."
          });
        } else if (bcryptjs.compareSync(password, user.password)) {
          console.log("bcrypt check");
          // Send JWT here too.
          res.send(user);
        } else {
          res.status(400).send({
            message: "You got your password wrong."
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
