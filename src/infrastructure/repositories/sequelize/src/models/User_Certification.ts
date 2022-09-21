import { Model, DataTypes } from "sequelize";
import { sequelize } from "..";

export const user_certification_table = "Users_Certifications";
export const user_certification_schema = {
  uuid: {
    primaryKey: true,
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  userUUID: {
    field: "user_uuid",
    unique: false,
    allowNull: false,
    type: DataTypes.STRING,
    references: {
      model: "Users",
      key: "uuid",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    },
  },
  certificationUUID: {
    field: "certification_uuid",
    unique: false,
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

export const Users_Certifications = sequelize.define(
  user_certification_table,
  user_certification_schema,
  {
    createdAt: false,
    updatedAt: false,
  }
);
