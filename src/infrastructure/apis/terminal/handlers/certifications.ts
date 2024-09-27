import {
  getCertifications,
  updateCertification,
  getOwnCertifications,
} from "../../../../modules/certifications/application/use_cases";
import { getAllUsername } from "../../../../modules/users/application/use_cases";
import inquirer from "inquirer";
import { execFunc } from "../../../../utils";

inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));

const listByUsernameHandler = async (state: any) => {
  let running = true;
  const usernames = await getAllUsername();
  const exit = "Salir";
  const choices = [...usernames, exit];
  while (running) {
    const { option } = await inquirer.prompt([
      {
        name: "option",
        type: "list",
        message: "Certification".cyan,
        choices,
      },
    ]);
    await getCertifications({ username: option });
    if (option === exit) running = false;
  }
};

const listCertificationsHandler = async (state: any) => {
  const { token } = state;
  const [all, owns, byUser, test] = ["Todos", "Propios", "Por Usuario", "Test"];
  const choices = [all, owns, byUser, test];
  const options = {
    [all]: async () => console.log(await getCertifications({})),
    [owns]: async () => await getOwnCertifications({ token }),
    [byUser]: async () => await listByUsernameHandler(state),
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

export const certificationsHandler = async (state: any) => {
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