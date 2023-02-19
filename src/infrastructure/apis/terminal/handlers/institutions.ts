import {
  getAllInstitutions,
  addNewInstitution,
  linkToIntitution,
} from "../../../../modules/institutions/application/institutions";
import inquirer from "inquirer";
import { execFunc } from "../../../../utils";

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
    [read]: async () => console.log(await getAllInstitutions({})),
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
