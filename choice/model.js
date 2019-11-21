const Sequelize = require("sequelize");
const db = require("../db");
const User = require("../users/model");

const Choice = db.define(
  "choice",
  {
    choice: {
      type: Sequelize.STRING
    }
  },
  {
    image_url: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false,
    tableName: "choices"
  }
);

Choice.belongsTo(User);

module.exports = Choice;
