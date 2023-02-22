import {
  login,
  signup,
  unsubscribe,
} from "../../../../modules/shared/auth/use_cases";
import inquirer from "inquirer";
import { Enumfy, execFunc } from "../../../../utils";
import { decodeJwt } from "jose";

inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));

const signupHandler = async (state: any) => {
  const { email, password, rePassword, username } = await inquirer.prompt([
    { name: "email", message: "Email: " },
    { name: "username", message: "Username: " },
    {
      name: "password",
      message: "Password: ",
      type: "password",
      mask: "*".magenta,
    },
    {
      name: "rePassword",
      message: "Retype Password: ",
      type: "password",
      mask: "*".magenta,
    },
  ]);

  if (rePassword !== password) throw new Error("Password doesn't match");

  console.log(
    await signup({
      email,
      password,
      username,
    })
  );
};

const signinHandler = async (state: any) => {
  const { email, password } = await inquirer.prompt([
    { name: "email", message: "Email: " },
    {
      name: "password",
      message: "Password: ",
      type: "password",
      mask: "*".magenta,
    },
  ]);

  const { token } = await login({
    email,
    password,
  });

  const { exp, username }: any = decodeJwt(token);

  state.token = token;
  state.exp = exp;
  state.username = username;
};

const unsubscribeHandler = async () => {
  const { email, password, confirm } = await inquirer.prompt([
    { name: "email", message: "Email: " },
    {
      name: "password",
      message: "Password: ",
      type: "password",
      mask: "*".magenta,
    },
    {
      type: "confirm",
      name: "confirm",
      message: "Are you sure you want to signout?",
    },
  ]);
  if (confirm) await unsubscribe({ email, password });
};

export const loginHandler = async (state: any) => {
  let running = true;
  const choices = ["Signin", "Signup", "Signout", "Salir"];
  const EChoices = Enumfy(choices);
  const options = {
    [EChoices.Signin]: async () => {
      await signinHandler(state);
      running = false;
    },
    [EChoices.Signup]: async () => signupHandler(state),
    [EChoices.Signout]: async () => unsubscribeHandler(),
    [EChoices.Salir]: async () => (running = false),
  };
  while (running) {
    const { option } = await inquirer.prompt([
      {
        name: "option",
        type: "list",
        message: "Login".cyan,
        choices,
      },
    ]);
    await execFunc(options[option]);
  }
};
