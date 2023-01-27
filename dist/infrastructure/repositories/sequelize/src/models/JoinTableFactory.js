"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinTableFactory = void 0;
const utils_1 = require("../utils");
const sequelize_1 = require("sequelize");
const __1 = require("..");
const JoinTableFactory = (A, B) => {
    const join_table_name = `${(0, utils_1.labelCases)(A).CP}_${(0, utils_1.labelCases)(B).CP}`;
    const join_table_schema = {
        uuid: {
            primaryKey: true,
            allowNull: false,
            unique: true,
            type: sequelize_1.DataTypes.STRING,
        },
        [`${(0, utils_1.labelCases)(A).LS}UUID`]: {
            field: `${(0, utils_1.labelCases)(A).LS}_uuid`,
            unique: false,
            allowNull: false,
            type: sequelize_1.DataTypes.STRING,
            references: {
                model: "Users",
                key: "uuid",
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION",
            },
        },
        [`${(0, utils_1.labelCases)(B).LS}UUID`]: {
            field: `${(0, utils_1.labelCases)(B).LS}_uuid`,
            unique: false,
            allowNull: false,
            type: sequelize_1.DataTypes.STRING,
            references: {
                model: "Users",
                key: "uuid",
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION",
            },
        },
    };
    return {
        [join_table_name]: __1.sequelize.define(join_table_name, join_table_schema, {
            createdAt: false,
            updatedAt: false,
        }),
    };
};
exports.JoinTableFactory = JoinTableFactory;
