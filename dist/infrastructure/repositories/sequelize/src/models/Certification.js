"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Certification = exports.certification_schema = exports.certification_table = void 0;
const sequelize_1 = require("sequelize");
const __1 = require("..");
exports.certification_table = "Certifications";
exports.certification_schema = {
    uuid: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: sequelize_1.DataTypes.STRING,
    },
    institutionUUID: {
        field: "institution_uuid",
        unique: false,
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: "Institutions",
            key: "uuid",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION",
        },
    },
    title: { allowNull: false, type: sequelize_1.DataTypes.STRING, unique: true },
    image: { allowNull: false, type: sequelize_1.DataTypes.STRING, unique: true },
    url: { allowNull: false, type: sequelize_1.DataTypes.STRING },
    tags: {
        allowNull: true,
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        default: [],
    },
    emitedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, field: "emited_at" },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, field: "created_at" },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, field: "updated_at" },
};
class Certification extends sequelize_1.Model {
    static associate(models) {
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
exports.Certification = Certification;
Certification.init(exports.certification_schema, {
    sequelize: __1.sequelize,
    modelName: exports.certification_table,
});
