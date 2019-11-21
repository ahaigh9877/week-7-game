const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Sse = require('json-sse')
const loginRouter = require("./auth/router");
const userFactory = require("./users/router");
const roomFactory = require('./room/router')
const Room = require('./room/model')
const User = require('./users/model')
// const Choice = require('./choice/model')
const app = express();
const port = process.env.PORT || 4000;
const corsMiddleware = cors();
const parserMiddleware = bodyParser.json();
app.use(corsMiddleware, parserMiddleware);

const stream = new Sse();

app.get("/stream", async (req, res) => {
  // put the User model inside an array so the users are included.
  const rooms = await Room.findAll({ include: [User] });

  const action = {
    type: "ROOMS",
    payload: rooms
  };

  const string = JSON.stringify(action);
  stream.updateInit(string);

  stream.init(req, res);
});

const roomRouter = roomFactory(stream);
app.use(roomRouter);
const userRouter = userFactory(stream);
app.use(userRouter);

app.use(loginRouter);

app.listen(port, () => console.log(`App listening to port ${port}`));
