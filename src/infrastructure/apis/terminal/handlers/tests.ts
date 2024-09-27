import { RepositoryService } from "../../../../config/dependencies";
import inquirer from "inquirer";
import { execFunc } from "../../../../utils";

inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));

export const testsHandler = async (state: any) => {
  const sequelizeAdapter = RepositoryService.CommandService;
  const mongooseAdapter = RepositoryService.QueryService;
  const { username } = state;
  let running = true;
  const [checkN2N, removeN2N, exit] = [
    "Check Relationship N2N",
    "Remove Relationship N2N",
    "Salir",
  ];
  const choices = [checkN2N, removeN2N, exit];
  const options = {
    [checkN2N]: async () => {
      (
        await sequelizeAdapter.checkOneRelationshipN2N(
          { certification: { title: "0" } },
          { user: { username } }
        )
      );
    },
    [removeN2N]: async () => {
      (
        await mongooseAdapter.unsetOneRelationshipManyToMany([
          [{ institution: { name: "EDTeam" } }, { user: { username } }],
        ])
      );
    },
    [exit]: async () => (running = false),
  };
  while (running) {
    const { option } = await inquirer.prompt([
      {
        name: "option",
        type: "list",
        message: "Tests".bgYellow,
        choices,
      },
    ]);
    await execFunc(options[option]);
  }
};