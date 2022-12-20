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
  institutionUUID: {
    field: "institution_uuid",
    unique: false,
    allowNull: false,
    type: DataTypes.STRING,
    references: {
      model: "Institutions",
      key: "uuid",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    },
  },
  title: { allowNull: false, type: DataTypes.STRING, unique: true },
  image: { allowNull: false, type: DataTypes.STRING, unique: true },
  url: { allowNull: false, type: DataTypes.STRING },
  tags: { allowNull: true, type: DataTypes.ARRAY(DataTypes.STRING) },
  emitedAt: { type: DataTypes.DATE, allowNull: false, field: "emited_at" },
  createdAt: { type: DataTypes.DATE, allowNull: false, field: "created_at" },
  updatedAt: { type: DataTypes.DATE, allowNull: false, field: "updated_at" },
};

export class Certification extends Model {
  static associate(models: any) {
    this.belongsToMany(models.User, {
      through: models.Users_Certifications,
      foreignKey: "certificationUUID",
      otherKey: "userUUID",
    });
    this.belongsTo(models.Institution, {
      as: "Institution",
      targetKey: "uuid",
      foreignKey: "institutionUUID",
    });
  }
}

Certification.init(certification_schema, {
  sequelize,
  modelName: certification_table,
});
