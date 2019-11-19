const express = require("express");
const Room = require("./model");
const { Router } = express;

function roomFactory(stream) {
  const router = new Router();
  router.post("/rooms", async (req, res) => {
    const room = await Room.create(req.body);

    const action = {
      type: 'ROOM',
      payload: room
    }

    const string = JSON.stringify(action);
    stream.send(string);

    res.send(room)
  });
  
  return router;
}

module.exports = roomFactory;
