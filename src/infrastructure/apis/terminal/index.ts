import inquirer from "inquirer";
import colors from "colors";
import { loginHandler } from "./handlers/login";
import { certificationsHandler } from "./handlers/certifications";
import { projectsHandler } from "./handlers/projects";
import { Enumfy, execFunc } from "../../../utils";
import { token } from "morgan";

inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));
colors;

export default async () => {
  const tokens = {
    re: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNWMwMDJkNWEtODUwMC00MDE1LThjMWQtYmIyZjNiMjYxOWVmIiwidXNlcm5hbWUiOiJyZWFwZXJuNyIsImVtYWlsIjoicmVhcGVyMzQzbjdAZ21haWwuY29tIiwiaWF0IjoxNjcxNTYwNzM1LCJleHAiOjE2NzQxNTI3MzV9.LF6kH1g-7R3GDlQMAtQgzdQZb0XgZfK-_IGdJNP-vv4",
    cm: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiZDU3NDI3YjQtNmU5MC00OTI3LWI3OWYtODc4MzBmN2UxODMwIiwidXNlcm5hbWUiOiJjbWdzMTExIiwiZW1haWwiOiJjYXJsb3NtZ3MxMTFAb3V0bG9vay5jb20iLCJpYXQiOjE2NzE1NTg3NTEsImV4cCI6MTY3NDE1MDc1MX0.bXXYbEEu0nbr7nYUHDZXnOIiZcFz0x9lDbW6lkAWeg8",
    no: null,
  };
  const state: any = {
    token: tokens.cm,
  };
  const choices = ["Login", "Certifications", "Institutions", "Projects"];
  const EChoices = Enumfy(choices);
  const options = {
    [EChoices.Login]: () => loginHandler(state),
    ["Logout"]: () => (state.token = undefined),
    [EChoices.Certifications]: () => certificationsHandler(state),
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
