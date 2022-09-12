import { Model, DataTypes } from "sequelize";
import { sequelize } from "..";

export const certification_institution_table = "Certifications_Institutions";
export const certification_institution_schema = {
  id: {
    primaryKey: true,
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
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

export const User = sequelize.define(
  certification_institution_table,
  certification_institution_schema
);
