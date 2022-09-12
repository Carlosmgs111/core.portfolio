import { Model, DataTypes } from "sequelize";
import { sequelize } from "..";

export const user_certification_table = "Users_Certifications";
export const user_certification_schema = {
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
  certification_uuid: {
    unique: true,
    allowNull: false,
    type: DataTypes.STRING,
    references: {
      model: "Certifications",
      key: "uuid",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    },
  },
};

export const User = sequelize.define(user_certification_table, user_certification_schema);
