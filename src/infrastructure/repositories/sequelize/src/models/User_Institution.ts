import { Model, DataTypes } from "sequelize";
import { sequelize } from "..";

export const user_institution_table = "Users_Institutions";
export const user_institution_schema = {
  id: {
    primaryKey: true,
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  user_uuid: {
    unique: true,
    allowNull: false,
    type: DataTypes.STRING,
    references: {
      model: "Users",
      key: "uuid",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    },
  },
  institution_uuid: {
    unique: true,
    allowNull: false,
    type: DataTypes.STRING,
    references: {
      model: "Institutions",
      key: "uuid",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    },
  },
};

export const User = sequelize.define(user_institution_table, user_institution_schema);
