import { RepositoryService } from "../../../../config/dependencies";
import {
  User,
  user_schema,
  user_table,
} from "../../../../modules/users/infrastructure/models/sequelize";
import {
  Certification,
  certification_schema,
  certification_table,
} from "../../../../modules/certificates/infrastructure/models/sequelize";
import {
  Institution,
  institution_schema,
  institution_table,
} from "../../../../modules/institutions/infrastructure/models/sequelize";
import {
  Project,
  project_schema,
  project_table,
} from "../../../../modules/projects/infrastructure/models/sequelize";
RepositoryService.CommandService.addModel(
  "Certification",
  Certification,
  certification_table,
  certification_schema
);
RepositoryService.CommandService.addModel(
  "User",
  User,
  user_table,
  user_schema
);
RepositoryService.CommandService.addModel(
  "Institution",
  Institution,
  institution_table,
  institution_schema
);
RepositoryService.CommandService.addModel(
  "Project",
  Project,
  project_table,
  project_schema
);
RepositoryService.CommandService.joinTables("User", "Certification");
RepositoryService.CommandService.joinTables("User", "Institution");
RepositoryService.CommandService.joinTables("User", "Project");

const { tableSchemas, tableNames } = RepositoryService.CommandService;
const {
  users_certifications_schema,
  users_institutions_schema,
  users_projects_schema,
} = tableSchemas;
const { Users_Certifications, Users_Institutions, Users_Projects } = tableNames;
console.log({
  tableNames,
  users_certifications_schema,
  users_institutions_schema,
  users_projects_schema,
});
export = {
  async up(queryInterface: any, Sequelize: any) {
    await queryInterface.createTable(user_table, user_schema);
    await queryInterface.createTable(institution_table, institution_schema);
    await queryInterface.createTable(certification_table, certification_schema);
    await queryInterface.createTable(project_table, project_schema);
    await queryInterface.createTable(
      Users_Certifications,
      users_certifications_schema
    );
    await queryInterface.createTable(
      Users_Institutions,
      users_institutions_schema
    );
    await queryInterface.createTable(Users_Projects, users_projects_schema);
  },
  async down(queryInterface: any, Sequelize: any) {
    // await queryInterface.dropAllTables();
  },
};
