import { signin } from "../../../../application/use_cases/register";
import { DatabaseService } from "../../../../config/dependencies";
import inquirer from "inquirer";
import { Enumfy, execFunc } from "../../../../utils";

inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer));

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

  const { token } = await signin({
    email,
    password,
  });
  state["token"] = token;
};

export const loginHandler = async (state: any) => {
  let running = true;
  const choices = ["Signin", "Signup", "Salir"];
  const EChoices = Enumfy(choices);
  const options = {
    [EChoices.Signin]: async () => {
      await signinHandler(state);
      running = false;
    },
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
