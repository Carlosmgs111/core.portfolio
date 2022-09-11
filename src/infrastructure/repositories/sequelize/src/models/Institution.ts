import { Model, DataTypes } from "sequelize";
import { sequelize } from "..";

export const institution_table = "Institutions";
export const institution_schema = {
  uuid: {
    primaryKey: true,
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  name: { allowNull: false, type: DataTypes.STRING },
  businessName: { allowNull: false, type: DataTypes.STRING, as:"business_name"  },
  descriptions: {  type: DataTypes.ARRAY(DataTypes.TEXT) },
  urls: {  type: DataTypes.ARRAY(DataTypes.STRING) },
  createdAt: { type: DataTypes.DATE, allowNull: false, as: "created_at" },
  updatedAt: { type: DataTypes.DATE, allowNull: false, as: "updated_at" },
};

export const Institution = sequelize.define(institution_table, institution_schema);