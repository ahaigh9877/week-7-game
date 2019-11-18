const express = require("express");
const bcryptjs = require("bcryptjs");

const { Router } = express;
const router = new Router();

const User = require("./model");

/*======================= Endpoint: NEW USER ==============================*/

router.post("/user", (req, res, next) => {
  const user = {
    username: req.body.username,
    password: bcryptjs.hashSync(req.body.password, 10)
  };
  console.log("U S E R : ", user);
  User.create(user)
    .then(user => {
      res.status(200).send({ message: "it done worked", user });
    })
    .catch(next);
});

module.exports = router;
