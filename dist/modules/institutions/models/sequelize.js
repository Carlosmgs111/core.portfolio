"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Institution = exports.institution_schema = exports.institution_table = void 0;
const sequelize_1 = require("sequelize");
const infrastructure_1 = require("../../../services/DatabaseServices/SequelizeAdapter/infrastructure");
exports.institution_table = "Institutions";
exports.institution_schema = {
    uuid: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: sequelize_1.DataTypes.STRING,
    },
    name: { allowNull: false, type: sequelize_1.DataTypes.STRING, unique: true },
    businessName: {
        allowNull: false,
        unique: true,
        type: sequelize_1.DataTypes.STRING,
        field: "business_name",
    },
    descriptions: { type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT) },
    urls: { type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING) },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, field: "created_at" },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, field: "updated_at" },
};
class Institution extends sequelize_1.Model {
    static associate(models) {
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
exports.Institution = Institution;
Institution.init(exports.institution_schema, {
    sequelize: infrastructure_1.sequelize,
    modelName: exports.institution_table,
});
