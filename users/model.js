const Sequelize = require("sequelize");
const db = require("../db");

const User = db.define(
  "user",
  {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    score: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    choiceId: {
      type: Sequelize.INTEGER,
      defaultValue: null
    },  
    previousChoice : {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  },
  {
    timestamps: false,
    tableName: "users"
  }
);

module.exports = User;
