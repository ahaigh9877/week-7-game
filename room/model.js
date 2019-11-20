const Sequelize = require("sequelize");
const db = require("../db");

const User = require("../users/model");

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

// Do all these relations in one file to prevent circular dependency l00ps.
User.belongsTo(Room);
// Include users in room. So each room has a new array property: Users.
// This doesn't change the database.
Room.hasMany(User);

module.exports = Room;
