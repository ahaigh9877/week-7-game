const express = require("express");
const bcryptjs = require("bcryptjs");

const { Router } = express;

const User = require("./model");

/*======================= Endpoint: NEW USER ==============================*/

function userFactory(stream) {
  const router = new Router();

  router.post("/user", async (req, res, next) => {
    const user = {
      username: req.body.username,
      password: bcryptjs.hashSync(req.body.password, 10)
    };

    if (user.username !== "" && user.password !== "") {
      const newUser = await User.create(user);

      const action = {
        type: "NEW_USER",
        payload: newUser
      };

      const string = JSON.stringify(action);
      stream.send(string);
      res.send(newUser);
    }
  });

  router.get("/users", async (req, res, next) => {
    const users = await User.findAll();

    const action = {
      type: "ALL_USERS",
      payload: users
    };

    const string = JSON.stringify(action);
    stream.send(string);
    res.send(users);
  });

  return router;
}
module.exports = userFactory;
