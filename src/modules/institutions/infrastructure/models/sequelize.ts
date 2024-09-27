import { RepositoryService } from "../../../../config/dependencies";
import { Model, DataTypes } from "sequelize";

export const institution_table = "Institutions";
export const institution_schema = {
  uuid: {
    primaryKey: true,
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  name: { allowNull: false, type: DataTypes.STRING, unique: true },
  businessName: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
    field: "business_name",
  },
  descriptions: { type: DataTypes.ARRAY(DataTypes.TEXT) },
  urls: { type: DataTypes.ARRAY(DataTypes.STRING) },
  createdAt: { type: DataTypes.DATE, allowNull: false, field: "created_at" },
  updatedAt: { type: DataTypes.DATE, allowNull: false, field: "updated_at" },
};

export class Institution extends Model {
  static associate(models: any) {
    this.belongsToMany(models.User, {
      through: models.Users_Institutions,
      foreignKey: "institutionUUID",
      otherKey: "userUUID",
    });
    this.hasMany(models.Certification, {
      as: "certifications",
      foreignKey: "institutionUUID",
    });
  }
}

RepositoryService.CommandService.addModel(
  "Institution",
  Institution,
  institution_table,
  institution_schema
);
