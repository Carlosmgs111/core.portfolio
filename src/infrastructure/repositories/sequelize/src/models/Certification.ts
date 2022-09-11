import { Model, DataTypes } from "sequelize";
import { sequelize } from "..";

export const certification_table = "Certifications";
export const certification_schema = {
  uuid: {
    primaryKey: true,
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  title: { allowNull: false, type: DataTypes.STRING },
  image: { allowNull: false, type: DataTypes.STRING },
  url: { allowNull: false, type: DataTypes.STRING },
  emitedAt: { type: DataTypes.DATE, allowNull: false, as: "emited_at" },
  createdAt: { type: DataTypes.DATE, allowNull: false, as: "created_at" },
  updatedAt: { type: DataTypes.DATE, allowNull: false, as: "updated_at" },
};

export const Certification = sequelize.define(certification_table, certification_schema);