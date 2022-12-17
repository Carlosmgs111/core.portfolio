import { Model, DataTypes } from "sequelize";
import { sequelize } from "..";

export const post_table = "Posts";
export const post_schema = {
  uuid: {
    primaryKey: true,
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  userUUID: {
    field: "user_uuid",
    unique: true,
    allowNull: false,
    type: DataTypes.STRING,
    foreignKey: true,
  },
  title: { allowNull: false, type: DataTypes.STRING },
  content: { allowNull: false, type: DataTypes.TEXT },
  createdAt: { type: DataTypes.DATE, allowNull: false, field: "created_at" },
  updatedAt: { type: DataTypes.DATE, allowNull: false, field: "updated_at" },
};

export class Post extends Model {
  static associate(models: any) {}
}

Post.init(post_schema, { sequelize, tableName: post_table });
