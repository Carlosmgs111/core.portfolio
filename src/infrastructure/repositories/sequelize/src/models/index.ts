import { labelCases } from "../utils";
import { DataTypes } from "sequelize";
import { sequelize } from "..";
// * Models import
import {
  User,
  user_schema,
  user_table,
} from "../../../../../users/infrastructure/repositories/sequelize/User";
import {
  Project,
  project_schema,
  project_table,
} from "../../../../../projects/insfrastructure/repositories/sequelize/Project";
import {
  Institution,
  institution_schema,
  institution_table,
} from "../../../../../institutions/infrastructure/repositories/sequelize/Institution";
import {
  Certification,
  certification_schema,
  certification_table,
} from "../../../../../certifications/infrastructure/repositories/sequelize/Certification";
import {
  Post,
  post_schema,
  post_table,
} from "../../../../../posts/insfrasctructure/repositories/sequelize/Post";
import {
  Skill,
  skill_schema,
  skill_table,
} from "../../../../../skills/infrastructure/repositories/sequelize/Skill";
import {
  Note,
  note_schema,
  note_table,
} from "../../../../../notes/insfrastructure/repositories/sequelize/Note";

const joinTableNames: any = {};
const joinTableSchema: any = {};

const createJoinTable = (A: any, B: any) => {
  A = A.tableName || A;
  B = B.tableName || B;

  const join_table_name = `${labelCases(A).CP}_${labelCases(B).CP}`;
  joinTableNames[`${labelCases(join_table_name).LP}_table`] = join_table_name;

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
  joinTableSchema[`${labelCases(join_table_name).LP}_schema`] =
    join_table_schema;

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
  Note,
  ...createJoinTable(User, Institution),
  ...createJoinTable(User, Certification),
  ...createJoinTable(User, Skill),
  ...createJoinTable(User, Project),
};

export const tableNames = {
  institution_table,
  user_table,
  certification_table,
  skill_table,
  project_table,
  post_table,
  note_table,
  ...joinTableNames,
};

export const tableSchemas = {
  institution_schema,
  certification_schema,
  user_schema,
  skill_schema,
  project_schema,
  post_schema,
  note_schema,
  ...joinTableSchema,
};

export default models;
