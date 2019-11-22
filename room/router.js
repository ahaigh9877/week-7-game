const express = require("express");
const Room = require("./model");
const User = require("../users/model");
const { Router } = express;
const auth = require("../auth/middleware");

function roomFactory(stream) {
  const router = new Router();

  router.post("/rooms", async (req, res) => {
    const room = await Room.create(req.body);
    console.log({ room });
    const action = {
      type: "ROOM",
      //payload: room
      payload: { ...room.dataValues, users: [] }
    };

    const string = JSON.stringify(action);
    stream.send(string);

    res.send(room);
  });

  router.put("/join/:name", auth, async (req, res) => {
    const { user } = req;

    const { name } = req.params;

    const room = await Room.findOne({ where: { name } });

    const updatedUser = await user.update({
      roomId: room.id,
      score: 0,
      choiceId: null,
      previousChoice: 0
    });

    const rooms = await Room.findAll({ include: [User] });
    const action = {
      type: "ROOMS",
      payload: rooms
    };

    const string = JSON.stringify(action);
    stream.send(string);
    res.send(updatedUser);
  });

  router.put("/leave/:name", auth, async (req, res) => {
    console.log("LEAVE ROOM req", req.body);
    const { user } = req;
    const updatedUser = await user.update({
      roomId: null,
      choiceId: null,
      score: 0,
      previousChoice: 0
    });
    const rooms = await Room.findAll({ include: [User] });
    const action = {
      type: "ROOMS",
      payload: rooms
    };

    const string = JSON.stringify(action);
    stream.send(string);
    res.send(updatedUser);
  });

  router.put("/game/:username/:choice", async (req, res, next) => {
    const { username, choice } = req.params;
    const user = await User.findOne({ where: { username: username } });

    const updatedUser = await user.update({ choiceId: choice });

    const users = await User.findAll({ where: { roomId: user.roomId } });
    //console.log("USERS: ", users);

    // for each outcome copy current score to previous score.
    if (users[0].choiceId === 1 && users[1].choiceId === 1) {
      await users[0].update({ choiceId: null, previousChoice: 1 });
      await users[1].update({ choiceId: null, previousChoice: 1 });
    } else if (users[0].choiceId === 2 && users[1].choiceId === 2) {
      await users[0].update({ choiceId: null, previousChoice: 2 });
      await users[1].update({ choiceId: null, previousChoice: 2 });
    } else if (users[0].choiceId === 2 && users[1].choiceId === 1) {
      await users[0].update({ choiceId: null, previousChoice: 3 });
      await users[1].update({ choiceId: null, previousChoice: 3 });
    } else if (users[0].choiceId === 1 && users[1].choiceId === 2) {
      await users[0].update({
        score: users[0].score + 1,
        choiceId: null,
        previousChoice: 1
      });
      await users[1].update({ choiceId: null, previousChoice: 2 });
    } else if (users[0].choiceId === 1 && users[1].choiceId === 3) {
      await users[0].update({ choiceId: null, previousChoice: 1 });
      await users[1].update({
        score: users[1].score + 1,
        choiceId: null,
        previousChoice: 3
      });
    } else if (users[0].choiceId === 2 && users[1].choiceId === 3) {
      await users[0].update({
        score: users[0].score + 1,
        choiceId: null,
        previousChoice: 2
      });
      await users[1].update({ choiceId: null, previousChoice: 3 });
    } else if (users[0].choiceId === 2 && users[1].choiceId === 1) {
      await users[0].update({ choiceId: null, previousChoice: 2 });
      await users[1].update({
        score: users[1].score + 1,
        choiceId: null,
        previousChoice: 1
      });
    } else if (users[0].choiceId === 3 && users[1].choiceId === 1) {
      await users[0].update({
        score: users[0].score + 1,
        choiceId: null,
        previousChoice: 3
      });
      await users[1].update({ choiceId: null, previousChoice: 1 });
    } else if (users[0].choiceId === 3 && users[1].choiceId === 2) {
      await users[0].update({ choiceId: null, previousChoice: 3 });
      await users[1].update({
        score: users[1].score + 1,
        choiceId: null,
        previousChoice: 2
      });
    }

    const rooms = await Room.findAll({ include: [User] });

    const action = {
      type: "ROOMS",
      payload: rooms
    };

    const string = JSON.stringify(action);

    stream.send(string);

    res.send(users);
  });

  return router;
}

module.exports = roomFactory;
