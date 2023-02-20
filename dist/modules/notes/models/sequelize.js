"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = exports.note_schema = exports.note_table = void 0;
const sequelize_1 = require("sequelize");
const src_1 = require("../../../services/DatabaseServices/SequelizeAdapter/infrastructure/src");
exports.note_table = "Notes";
exports.note_schema = {
    uuid: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: sequelize_1.DataTypes.STRING,
    },
    userUUID: {
        field: "user_uuid",
        unique: false,
        allowNull: true,
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: "Users",
            key: "uuid",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION",
        },
    },
    title: { allowNull: false, type: sequelize_1.DataTypes.STRING, unique: false },
    body: { allowNull: false, type: sequelize_1.DataTypes.STRING, unique: false },
    tags: {
        allowNull: true,
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        default: [],
    },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, field: "created_at" },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, field: "updated_at" },
};
class Note extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.Institution, {
            as: "Institution",
            targetKey: "uuid",
            foreignKey: "userUUID",
        });
    }
}
exports.Note = Note;
Note.init(exports.note_schema, {
    sequelize: src_1.sequelize,
    modelName: exports.note_table,
});
