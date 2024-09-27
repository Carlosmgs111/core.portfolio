import { RESTAPIService } from "../../../../../config/dependencies";
import passwordRoutes from "./password.routes";
import {
  registerUser,
  removeUser,
  updateUser,
  sayHello,
  changeUsername,
  updateAvatar,
  getAllUsername,
  contactByEmail,
} from "../../../application/use_cases";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from "../../../../../infrastructure/schemas/user.schema";
// import { validatorHandler } from "../../../../infrastructure/apis/express/middlewares/validator.handler";

const { controllerAdapter } = RESTAPIService;

export default RESTAPIService.addPath("", (router: any) => {
  router
    .get("/sayhello", controllerAdapter(sayHello))
    .post(
      "/",
      // validatorHandler(createUserSchema, "body"),
      controllerAdapter(registerUser)
    )
    .patch(
      "/",
      // validatorHandler(updateUserSchema, "body"),
      controllerAdapter(updateUser)
    )
    .delete(
      "/",
      // validatorHandler(getUserSchema, "body"),
      controllerAdapter(removeUser)
    )
    .patch("/username/change", controllerAdapter(changeUsername))
    .get("/username/all", controllerAdapter(getAllUsername))
    .patch("/avatar/update", controllerAdapter(updateAvatar))
    .post("/contact", controllerAdapter(contactByEmail))
    .use("/password", passwordRoutes);
});
