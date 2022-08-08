import { Model, DataTypes } from 'sequelize';
import { sequelize } from '..';

export const User = sequelize.define('User', {
  uuid: DataTypes.STRING,
  username: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  privilege: DataTypes.STRING,
  createdAt: DataTypes.DATEONLY,
  updatedAt: DataTypes.DATEONLY,
});