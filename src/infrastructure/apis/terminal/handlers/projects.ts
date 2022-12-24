import { getProjects } from "../../../../application/use_cases/projects";
import inquirer from "inquirer";
import { Enumfy, execFunc } from "../../../../utils";

inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));

export const projectsHandler = async (state: any) => {
  const { username } = state;
  let running = true;
  const choices = ["Agregar", "Actualizar", "Eliminar", "Listar", "Salir"];
  const EChoices = Enumfy(choices);
  const options = {
    [EChoices.Listar]: async () =>
      console.log(await getProjects({ username })),
    [EChoices.Salir]: async () => (running = false),
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
