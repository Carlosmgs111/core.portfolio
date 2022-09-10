import { Model, DataTypes } from 'sequelize';
import { sequelize } from '..';

export const user_table = "Users"
export const user_schema = { uuid: DataTypes.STRING,
  username: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  privilege: DataTypes.STRING,
  createdAt: DataTypes.DATEONLY,
  updatedAt: DataTypes.DATEONLY,
  role: DataTypes.STRING}

export const User = sequelize.define(user_table, user_schema);