import { Model, DataTypes } from "sequelize";
import { sequelize } from "..";

export const user_table = "Users";
export const user_schema = {
  uuid: {
    primaryKey: true,
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  username: {
    unique: true,
    allowNull: false,
    type: DataTypes.STRING,
  },
  email: { allowNull: true, unique: true, type: DataTypes.STRING },
  password: { allowNull: false, type: DataTypes.STRING },
  privilege: { type: DataTypes.ENUM, values: ["user", "admin"] },
  avatar: { type: DataTypes.STRING, allowNull: true },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "created_at",
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "updated_at",
  },
};
// export const User = sequelize.define(user_table, user_schema);
export class User extends Model {
  static associate(models: any) {
    // ? N2N relationships
    this.belongsToMany(models.Certification, {
      through: models.Users_Certifications,
      foreignKey: "userUUID",
      otherKey: "certificationUUID",
    });
    this.belongsToMany(models.Institution, {
      through: models.Users_Institutions,
      foreignKey: "userUUID",
      otherKey: "institutionUUID",
    });
    this.belongsToMany(models.Skill, {
      through: models.Users_Skills,
      foreignKey: "userUUID",
      otherKey: "skillUUID",
    });
    this.belongsToMany(models.Project, {
      through: models.Users_Projects,
      foreignKey: "userUUID",
      otherKey: "projectUUID",
    });
    // ? One2N relationships
    this.hasMany(models.Post, {
      as: "Posts",
      foreignKey: "userUUID",
    });
  }
}

User.init(user_schema, { sequelize, modelName: user_table });
