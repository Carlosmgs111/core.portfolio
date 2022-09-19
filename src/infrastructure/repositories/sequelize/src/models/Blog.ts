import { Model, DataTypes } from "sequelize";
import { sequelize } from "..";

export const blog_table = "Blogs";
export const blog_schema = {
  uuid: {
    primaryKey: true,
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  userUUID: {
    field:"user_uuid",
    unique: true,
    allowNull: false,
    type: DataTypes.STRING,
    foreignKey:true
  },
  title: { allowNull: false, type: DataTypes.STRING },
  content: { allowNull: false, type: DataTypes.TEXT },
  createdAt: { type: DataTypes.DATE, allowNull: false, field: "created_at" },
  updatedAt: { type: DataTypes.DATE, allowNull: false, field: "updated_at" },
};

export class Blog extends Model{
  static associate(models: any){}
}

Blog.init(blog_schema, {sequelize, tableName:blog_table})