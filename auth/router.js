const { Router } = require("express");
const bcryptjs = require("bcryptjs");
const { toJWT, toData } = require("./jwt");

const router = new Router();

const User = require("../users/model");
const auth = require("./middleware");

// define endpoints here
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send({
      message: "Give me a name and a password"
    });
  } else {
    User.findOne({
      where: {
        username: username
      }
    })
      .then(user => {
        if (!user) {
          res.status(400).send({
            message: "You do not exist."
          });

        } else if (bcryptjs.compareSync(password, user.password)) {          
          res.send({
            jwt: toJWT({ userId: user.id }),
            user
          });
        } else {
          res.status(400).send({
            message: "You got your password wrong."
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Something went fucky-uppy"
        });
      });
  }
});

module.exports = router;
