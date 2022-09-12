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
  user_uuid: {
    unique: true,
    allowNull: false,
    type: DataTypes.STRING,
    foreignKey:true
  },
  title: { allowNull: false, type: DataTypes.STRING },
  content: { allowNull: false, type: DataTypes.TEXT },
  createdAt: { type: DataTypes.DATE, allowNull: false, as: "created_at" },
  updatedAt: { type: DataTypes.DATE, allowNull: false, as: "updated_at" },
};

export const Blog = sequelize.define(blog_table, blog_schema);