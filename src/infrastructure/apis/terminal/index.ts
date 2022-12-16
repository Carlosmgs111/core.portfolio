import inquirer from "inquirer";
import colors from "colors";
import { loginHandler } from "./handlers/login";
import { certificationsHandler } from "./handlers/certifications";
import { projectsHandler } from "./handlers/projects";
import { Enumfy, execFunc } from "../../../utils";

inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));
colors;

export default async () => {
  const state = { token: undefined };
  const choices = ["Login", "Certifications", "Institutions", "Projects"];
  const EChoices = Enumfy(choices);
  const options = {
    [EChoices.Login]: () => loginHandler(state),
    ["Logout"]: () => (state.token = undefined),
    [EChoices.Certifications]: certificationsHandler,
    [EChoices.Projects]: projectsHandler,
  };
  while (true) {
    const { token } = state;
    if (token) {
      choices.shift();
      choices.unshift("Logout");
    }
    if (!token) {
      choices.shift();
      choices.unshift("Login");
    }
    const { option } = await inquirer.prompt([
      {
        name: "option",
        type: "list",
        message: `
Core Blogfolio
${token ? "Logged".green : "Unlogged".red}
        `.cyan,
        choices,
      },
    ]);
    await execFunc(options[option]);
  }
};
