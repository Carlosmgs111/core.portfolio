import {
  getProjects,
  getOwnProjects,
} from "../../../../modules/projects/application/use_cases";
import inquirer from "inquirer";
import { execFunc } from "../../../../utils";

inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));

const listProjectsHandler = async (state: any) => {
  const { token } = state;
  const [all, owns, byUser, test] = ["Todos", "Propios", "Por Usuario", "Test"];
  const choices = [all, owns, byUser, test];
  const options = {
    [all]: async () => (await getProjects({})),
    [owns]: async () => (await getOwnProjects({ token })),
    [test]: () => {},
  };
  const { option } = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      choices,
    },
  ]);
  await execFunc(options[option]);
};

export const projectsHandler = async (state: any) => {
  const { username } = state;
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
    [read]: async () => listProjectsHandler(state),
    [exit]: async () => (running = false),
  };
  while (running) {
    const { option } = await inquirer.prompt([
      {
        name: "option",
        type: "list",
        message: "Projects".cyan,
        choices,
      },
    ]);
    await execFunc(options[option]);
  }
};