import {
  getAllInstitutions,
  addNewInstitution,
  linkToIntitution,
} from "../../../../modules/institutions/application/use_cases";
import inquirer from "inquirer";
import { execFunc } from "../../../../utils";
import { RepositoryService } from "../../../../config/dependencies";

inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));

export const institutionsHandler = async (state: any) => {
  let running = true;
  const [add, update, removeOne, read, exit] = [
    "Agregar",
    "Actualizar",
    "Eliminar",
    "Listar",
    "Salir",
  ];
  const choices = [add, update, removeOne, read, exit];
  const options = {
    [read]: async () => await getAllInstitutions(RepositoryService, {}),
    [exit]: async () => (running = false),
  };
  while (running) {
    const { option } = await inquirer.prompt([
      {
        name: "option",
        type: "list",
        message: "Certification".cyan,
        choices,
      },
    ]);
    await execFunc(options[option]);
  }
};
