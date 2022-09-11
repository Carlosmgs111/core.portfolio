import { Model, DataTypes } from "sequelize";
import { sequelize } from "..";

export const user_table = "Users";
export const user_schema = {
  uuid: {
    primaryKey: true,
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  username: {
    unique: true,
    allowNull: false,
    type: DataTypes.STRING,
  },
  email: { allowNull: false, unique: true, type: DataTypes.STRING },
  password: { allowNull: false, type: DataTypes.STRING },
  privilege: DataTypes.STRING,
  createdAt: { type: DataTypes.DATE, allowNull: false, as: "created_at" },
  updatedAt: { type: DataTypes.DATE, allowNull: false, as: "updated_at" },
};

export const User = sequelize.define(user_table, user_schema);
