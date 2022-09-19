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
  title: { allowNull: false, type: DataTypes.STRING, unique: true },
  image: { allowNull: false, type: DataTypes.STRING, unique: true },
  url: { allowNull: false, type: DataTypes.STRING },

  emitedAt: { type: DataTypes.DATE, allowNull: false, field: "emited_at" },
  createdAt: { type: DataTypes.DATE, allowNull: false, field: "created_at" },
  updatedAt: { type: DataTypes.DATE, allowNull: false, field: "updated_at" },
};

export class Certification extends Model {
  static associate(models: any) {
    this.belongsToMany(models.Institution, {
      through: models.Certifications_Institutions,
      foreignKey: "institution_uuid",
      otherKey: "certification_uuid",
    });
  }
}
Certification.init(certification_schema, {
  sequelize,
  modelName: certification_table,
});
