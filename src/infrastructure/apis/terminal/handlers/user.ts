import {
  getCertifications,
  updateCertification,
  getOwnCertifications,
} from "../../../../modules/certificates/application/use_cases";
import inquirer from "inquirer";
import { execFunc } from "../../../../utils";
import { RepositoryService } from "../../../../config/dependencies";

inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));

const listCertificationsHandler = async (state: any) => {
  const { token } = state;
  const [all, owns, byUser, test] = ["Todos", "Propios", "Por Usuario", "Test"];
  const choices = [all, owns, byUser, test];
  const options = {
    [all]: async () => await getCertifications({}, null),
    [owns]: async () =>
      await getOwnCertifications(RepositoryService, { token }),
    [test]: () => {},
  };
  const { option } = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      choices,
    },
  ]);
  execFunc(options[option]);
};

export const userHandler = async (state: any) => {
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
    [read]: async () => await listCertificationsHandler(state),
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
