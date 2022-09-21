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
  email: { allowNull: false, unique: true, type: DataTypes.STRING },
  password: { allowNull: false, type: DataTypes.STRING },
  privilege: { type: DataTypes.ENUM, values: ["user", "admin"] },
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
    this.belongsToMany(models.Certification, {
      through: models.Users_Certifications,
      foreignKey: "certification_uuid",
      otherKey: "userUUID",
    });
    this.belongsToMany(models.Institution, {
      through: models.Users_Institutions,
      foreignKey: "institution_uuid",
      otherKey: "userUUID",
    });
    this.hasMany(models.Project, {
      as: "projects",
      foreignKey: "userUUID",
    });
    this.hasMany(models.Post, {
      as: "posts",
      foreignKey: "userUUID",
    });
  }
  sayHello(name: string) {
    console.log("Hello ", name);
    return `Hello ${name}`;
  }
}

User.init(user_schema, { sequelize, modelName: user_table });
