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
  name: { allowNull: false, type: DataTypes.STRING, unique:true },
  businessName: { allowNull: false, unique:true, type: DataTypes.STRING, as:"business_name"  },
  descriptions: {  type: DataTypes.ARRAY(DataTypes.TEXT) },
  urls: {  type: DataTypes.ARRAY(DataTypes.STRING) },
  createdAt: { type: DataTypes.DATE, allowNull: false, as: "created_at", underscored:true },
  updatedAt: { type: DataTypes.DATE, allowNull: false, as: "updated_at", underscored:true },
};

export class Institution extends Model{
  static associate(models:any){}
}

Institution.init(institution_schema, {sequelize, modelName: institution_table})