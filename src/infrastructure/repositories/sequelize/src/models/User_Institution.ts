import { Model, DataTypes } from "sequelize";
import { sequelize } from "..";

export const user_institution_table = "Users_Institutions";
export const user_institution_schema = {
  uuid: {
    primaryKey: true,
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  userUUID: {
    unique: false,
    allowNull: false,
    field:"user_uuid",
    type: DataTypes.STRING,
    references: {
      model: "Users",
      key: "uuid",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    },
  },
  institutionUUID: {
    unique: false,
    allowNull: false,
    field:"institution_uuid",
    type: DataTypes.STRING,
    references: {
      model: "Institutions",
      key: "uuid",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    },
  },
};

export const Users_Institutions = sequelize.define(user_institution_table, user_institution_schema, 
  {createdAt:false,
  updatedAt:false});
