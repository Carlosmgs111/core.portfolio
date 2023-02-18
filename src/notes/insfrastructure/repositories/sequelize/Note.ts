import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../../../infrastructure/repositories/sequelize/src";

export const note_table = "Notes";
export const note_schema = {
  uuid: {
    primaryKey: true,
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  userUUID: {
    field: "user_uuid",
    unique: false,
    allowNull: true,
    type: DataTypes.STRING,
    references: {
      model: "Users",
      key: "uuid",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    },
  },
  title: { allowNull: false, type: DataTypes.STRING, unique: false },
  body: { allowNull: false, type: DataTypes.STRING, unique: false },
  tags: {
    allowNull: true,
    type: DataTypes.ARRAY(DataTypes.STRING),
    default: [],
  },
  createdAt: { type: DataTypes.DATE, allowNull: false, field: "created_at" },
  updatedAt: { type: DataTypes.DATE, allowNull: false, field: "updated_at" },
};

export class Note extends Model {
  static associate(models: any) {
    this.belongsTo(models.Institution, {
      as: "Institution",
      targetKey: "uuid",
      foreignKey: "userUUID",
    });
  }
}

Note.init(note_schema, {
  sequelize,
  modelName: note_table,
});
