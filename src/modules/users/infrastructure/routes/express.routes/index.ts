import {
  RESTAPIService,
  RepositoryService,
} from "../../../../../config/dependencies";
import bcrypt from "bcrypt";
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

const { controllerAdapter } = RESTAPIService;

export default RESTAPIService.addPath("", (router: any) => {
  router
    .get(
      "/sayhello",
      controllerAdapter((ctx: any) => (ctx: any) => sayHello(ctx))
    )
    .post(
      "/",
      controllerAdapter((ctx: any) =>
        registerUser(RepositoryService, bcrypt, ctx)
      )
    )
    .patch(
      "/",
      controllerAdapter((ctx: any) =>
        updateUser(RepositoryService, bcrypt, ctx)
      )
    )
    .delete(
      "/",
      controllerAdapter((ctx: any) =>
        removeUser(RepositoryService, bcrypt, ctx)
      )
    )
    .patch(
      "/username/change",
      controllerAdapter((ctx: any) => changeUsername(RepositoryService, ctx))
    )
    .get(
      "/username/all",
      controllerAdapter((ctx: any) => getAllUsername(RepositoryService))
    )
    .patch(
      "/avatar/update",
      controllerAdapter((ctx: any) => updateAvatar(RepositoryService, ctx))
    )
    .post(
      "/contact",
      controllerAdapter((ctx: any) => contactByEmail(RepositoryService, ctx))
    )
    .use("/password", passwordRoutes);
});
