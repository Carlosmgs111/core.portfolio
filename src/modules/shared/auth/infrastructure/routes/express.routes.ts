import { RESTAPIService } from "../../../../../config/dependencies";
import { signup, login, logout, checkIfIsOnline } from "../../application/use_cases";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from "../../../../../infrastructure/schemas/user.schema";
// import { validatorHandler } from "../../../../infrastructure/apis/express/middlewares/validator.handler";

const { controllerAdapter } = RESTAPIService;

export default RESTAPIService.addPath("", (router: any) => {
  router
    .post(
      "/signup",
      // validatorHandler(createUserSchema, "body"),
      controllerAdapter(signup)
    )
    .get(
      "/signin",
      // validatorHandler(getUserSchema, "body"),
      controllerAdapter(login)
    )
    .post(
      "/signin",
      // validatorHandler(getUserSchema, "body"),
      controllerAdapter(login)
    )
    .get("/logout", controllerAdapter(logout))
    .get("/checkifisonline", controllerAdapter(checkIfIsOnline));
});
