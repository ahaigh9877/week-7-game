const Sequelize = require("sequelize");
const db = require("../db");

const User = require('../users/model')

const Room = db.define(
  "rooms",
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    timestamps: false,
    tableName: "rooms"
  }
);

User.belongsTo(Room)

module.exports = Room;
