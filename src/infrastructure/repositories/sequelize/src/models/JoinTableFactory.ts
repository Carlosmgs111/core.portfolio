import { labelCases } from "../utils";
import { DataTypes } from "sequelize";
import { sequelize } from "..";

export const JoinTableFactory = (A: string, B: string) => {
  const join_table_name = `${labelCases(A).CP}_${labelCases(B).CP}`;

  const join_table_schema = {
    uuid: {
      primaryKey: true,
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    [`${labelCases(A).LS}UUID`]: {
      field: `${labelCases(A).LS}_uuid`,
      unique: false,
      allowNull: false,
      type: DataTypes.STRING,
      references: {
        model: "Users",
        key: "uuid",
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      },
    },
    [`${labelCases(B).LS}UUID`]: {
      field: `${labelCases(B).LS}_uuid`,
      unique: false,
      allowNull: false,
      type: DataTypes.STRING,
      references: {
        model: "Users",
        key: "uuid",
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      },
    },
  };

  return {
    [join_table_name]: sequelize.define(join_table_name, join_table_schema, {
      createdAt: false,
      updatedAt: false,
    }),
  };
};
