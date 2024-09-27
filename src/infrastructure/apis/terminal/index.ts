import inquirer from "inquirer";
import colors from "colors";
import { loginHandler } from "./handlers/login";
import { certificationsHandler } from "./handlers/certifications";
import { projectsHandler } from "./handlers/projects";
import { institutionsHandler } from "./handlers/institutions";
import { testsHandler } from "./handlers/tests";
import { execFunc } from "../../../utils";
import { generateManyCertifications } from "../../../testing/fakers/certification.fake";
import fs from "fs";
import randomWords from "random-words";

inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));
colors;

export default async () => {
  const tokens = {
    re: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE2NzU2MzI1Nzc1MDksInV1aWQiOiIzOTVhZTE5OS1mOGU2LTRjNmEtODQ1ZS0zODdiNmE3MDQ3NTgiLCJ1c2VybmFtZSI6InJlYXBlcjM0MyIsImVtYWlsIjoicmVhcGVyMzQzbjdAZ21haWwuY29tIiwicHJpdmlsZWdlIjoiYWRtaW4iLCJhdmF0YXIiOiJodHRwczovL2ltYWdlczIuYWxwaGFjb2RlcnMuY29tLzExOS90aHVtYi0xOTIwLTExOTg0Mi5qcGciLCJpYXQiOjE2NzcwOTM3MjcsImV4cCI6MTY3OTY4NTcyN30.7cQJQbfZ55Le10Pe495YA6T5EbkiLaBjPOJ-QJrPwVo",
    cm: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE2Nzc0MzEwMzgzNDQsInV1aWQiOiI0MzU5NzA2ZS1lZjZjLTRjMmYtYWI0ZS1mNWVjOTVlODc1MDEiLCJ1c2VybmFtZSI6ImNtZ3MxMTEiLCJlbWFpbCI6IjQzNTk3MDZlLWVmNmMtNGMyZi1hYjRlLWY1ZWM5NWU4NzUwMUBjbWdzMTExLmVtYWlsIiwicHJpdmlsZWdlIjoiYWRtaW4iLCJhdmF0YXIiOiJodHRwczovL2ltYWdlczguYWxwaGFjb2RlcnMuY29tLzM4MC8zODA3MTQuanBnIiwiaWF0IjoxNjg0MjgxMzA0LCJleHAiOjE2ODY4NzMzMDR9.SjS-S9B96TGDFx0jljjIwYf3NLOKGnkppxCh3Dr_pzg",
    no: null,
  };
  const usernames = { re: "reapern7", cm: "cmgs111" };
  const state: any = {
    token: tokens.cm,
    username: usernames.cm,
    exp: 0,
  };
  const [
    login,
    logout,
    user,
    certifications,
    institutions,
    projects,
    tests,
    datasets,
  ] = [
    "Login".bgGreen,
    "Logout".bgRed,
    "User",
    "Certifications",
    "Institutions",
    "Projects",
    "Tests".yellow,
    "Datasets".blue,
  ];
  const choices = [
    user,
    certifications,
    institutions,
    projects,
    tests,
    datasets,
  ];
  const options = {
    [login]: () => loginHandler(state),
    [logout]: () => (state.token = undefined),
    [certifications]: () => certificationsHandler(state),
    [institutions]: () => institutionsHandler(state),
    [projects]: () => projectsHandler(state),
    [tests]: () => testsHandler(state),
    [datasets]: () => {
      const qt = 100;
      fs.writeFileSync(
        `datasets/certifications/${new Date()
          .toISOString()
          .replace(/T/, "_")
          .replace(/\..+/, "")
          .replaceAll(":", ".")}_qt.${qt}_${randomWords(1)[0]}-${
          randomWords(1)[0]
        }.json`,
        JSON.stringify({
          certifications: generateManyCertifications(qt),
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