const { Model, DataTypes } = require('sequelize');
const  sequelize  = require('..');

 const user_table = "Users"
 const user_schema = {
  uuid: DataTypes.STRING,
  username: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  privilege: DataTypes.STRING,
  createdAt: DataTypes.DATEONLY,
  updatedAt: DataTypes.DATEONLY,
  role: DataTypes.STRING
 }

 const User = sequelize.define(user_table, user_schema);

 module.exports = {user_table, user_schema, User}