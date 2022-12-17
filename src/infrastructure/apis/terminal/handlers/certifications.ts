import {
  getCertifications,
  updateCertification,
  getCertificationsByUsername,
} from "../../../../application/use_cases/certifications";
import { DatabaseService } from "../../../../config/dependencies";
import inquirer from "inquirer";
import { Enumfy, execFunc } from "../../../../utils";

inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));

const getCertificationsHandler = async () => {
  const choices = ["Todos", "Propios", "Por Usuario"];
  const EChoices = Enumfy(choices);
  const options = {
    [EChoices.Todos]: async () =>
      console.log(await getCertifications(DatabaseService)),
    [EChoices.Propios]: async () => {},
  };
  const { option } = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      choices: ["Todos", "Propios", "Por Usuario"],
    },
  ]);
  execFunc(options[option]);
};

export const certificationsHandler = async () => {
  let running = true;
  const choices = ["Agregar", "Actualizar", "Eliminar", "Listar", "Salir"];
  const EChoices = Enumfy(choices);
  const options = {
    [EChoices.Listar]: async () => await getCertificationsHandler(),
    [EChoices.Salir]: async () => (running = false),
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
