import inquirer from "inquirer";
import colors from "colors";
import { loginHandler } from "./handlers/login";
import { certificationsHandler } from "./handlers/certifications";
import { projectsHandler } from "./handlers/projects";
import { institutionsHandler } from "./handlers/institutions";
import { execFunc } from "../../../utils";
import { generateManyCertifications } from "../../../testing/fakers/certification.fake";
import fs from "fs";

inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));
colors;

export default async () => {
  const tokens = {
    re: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNWMwMDJkNWEtODUwMC00MDE1LThjMWQtYmIyZjNiMjYxOWVmIiwidXNlcm5hbWUiOiJyZWFwZXJuNyIsImVtYWlsIjoicmVhcGVyMzQzbjdAZ21haWwuY29tIiwiaWF0IjoxNjcxNTYwNzM1LCJleHAiOjE2NzQxNTI3MzV9.LF6kH1g-7R3GDlQMAtQgzdQZb0XgZfK-_IGdJNP-vv4",
    cm: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiZDU3NDI3YjQtNmU5MC00OTI3LWI3OWYtODc4MzBmN2UxODMwIiwidXNlcm5hbWUiOiJjbWdzMTExIiwiZW1haWwiOiJjYXJsb3NtZ3MxMTFAb3V0bG9vay5jb20iLCJpYXQiOjE2NzE1NTg3NTEsImV4cCI6MTY3NDE1MDc1MX0.bXXYbEEu0nbr7nYUHDZXnOIiZcFz0x9lDbW6lkAWeg8",
    no: null,
  };
  const usernames = { re: "reapern7", cm: "cmgs111" };
  const state: any = {
    token: tokens.cm,
    username: usernames.cm,
    exp: 0,
  };
  const [login, logout, user, certifications, institutions, projects, test] = [
    "Login".bgGreen,
    "Logout".bgRed,
    "User",
    "Certifications",
    "Institutions",
    "Projects",
    "Test".bgYellow,
  ];
  const choices = [user, certifications, institutions, projects, test];
  const options = {
    [login]: () => loginHandler(state),
    [logout]: () => (state.token = undefined),
    [certifications]: () => certificationsHandler(state),
    [institutions]: () => institutionsHandler(state),
    [projects]: () => projectsHandler(state),
    [test]: () => {
      fs.writeFileSync(
        "datasets/certifications3.json",
        JSON.stringify({
          certifications: generateManyCertifications(100),
        })
      );
    },
  };
  while (true) {
    const { token } = state;
    if (token && choices[choices.length - 1] !== logout) {
      choices.length > 4 && choices.shift();
      choices.push(logout);
    }
    if (!token && choices[0] !== login) {
      choices.length > 4 && choices.pop();
      choices.unshift(login);
    }
    const { option } = await inquirer.prompt([
      {
        name: "option",
        type: "list",
        message: `
        
  Blogfolio

  ${token ? `🔓 Logged: ${state.username} 🤖`.green : "🔒 Unlogged ".red}
        `.cyan,
        choices,
      },
    ]);
    await execFunc(options[option]);
  }
};
