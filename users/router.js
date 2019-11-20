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
      const action = { type: "NEW_USER", payload: newUser };
      const string = JSON.stringify(action);
      stream.send(string);
      res
        .status(200)
        .send(newUser)
        .catch(next);
    }
  });

  router.get("/users", async (req, res, next) => {
    const allUsers = await User.findAll();
    const action = { type: "ALL_USERS", payload: allUsers };
    const string = JSON.stringify(action);
    stream.send(string);
    res.send(allUsers);
  });

  return router;
}

module.exports = userFactory;
