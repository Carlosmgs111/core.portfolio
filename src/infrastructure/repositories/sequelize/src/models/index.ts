import { labelCases } from "../utils";
import { DataTypes } from "sequelize";
import { sequelize } from "..";
import { User } from "./User";
import { Project } from "./Project";
import { Institution } from "./Institution";
import { Certification } from "./Certification";
import { Post } from "./Post";
import { Skill } from "./Skill";

const JoinTableFactory = (A: string, B: string) => {
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
        model: labelCases(A).CP,
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
        model: labelCases(B).CP,
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

const models: any = {
  User,
  Project,
  Institution,
  Certification,
  Post,
  Skill,
  ...JoinTableFactory("User", "Institution"),
  ...JoinTableFactory("User", "Certification"),
  ...JoinTableFactory("User", "Skill"),
};

export default models;
