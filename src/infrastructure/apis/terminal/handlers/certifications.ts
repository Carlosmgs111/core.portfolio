import { getCertifications, updateCertification } from "../../../../application/use_cases/certifications";
import { DatabaseService } from "../../../../config/dependencies";
import inquirer from "inquirer";
import { Enumfy, execFunc } from "../../../../utils";

inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));

export const certificationsHandler = async () => {
  let running = true;
  const choices = ["Agregar", "Actualizar", "Eliminar", "Listar", "Salir"];
  const EChoices = Enumfy(choices);
  const options = {
    [EChoices.Listar]: async () =>
      console.log(await getCertifications(DatabaseService)),
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
