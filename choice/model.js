const Sequelize = require("sequelize");
const db = require("../db");
const User = require("../users/model");

const Choice = db.define(
  "choice",
  {
    choice: {
      type: Sequelize.STRING
    },
    image_url: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false,
    tableName: "choices"
  }
);

const choices = [
  { choice: "paper", image_url: "url1" },
  { choice: "rock", image_url: "url2" },
  { choice: "scissors", image_url: "url3" }
];

User.belongsTo(Choice);

const initialDb = Choice.findAll().then(() => {
  if (initialDb.length === 0) {
    Choice.bulkCreate(choices);
  }
});

module.exports = Choice;
