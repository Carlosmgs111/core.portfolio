import inquirer from "inquirer";
import colors from "colors";
import { certificationsHandler } from "./handlers/certifications";
import { projectsHandler } from "./handlers/projects";
import { Enumfy, execFunc } from "../../../utils";

inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));
colors;

export default async () => {
  const choices = ["Certifications", "Institutions", "Projects"];
  const EChoices = Enumfy(choices);
  const options = {
    [EChoices.Certifications]: certificationsHandler,
    [EChoices.Projects]: projectsHandler,
  };
  while (true) {
    const { option } = await inquirer.prompt([
      {
        name: "option",
        type: "list",
        message: "Core Blogfolio".cyan,
        choices,
      },
    ]);
    await execFunc(options[option])
  }
};
