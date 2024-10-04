import {
  RESTAPIService,
  RepositoryService,
  ChatService,
  AuthServices,
} from "../../../../../config/dependencies";
import {
  signup,
  login,
  logout,
  checkIfIsOnline,
} from "../../application/use_cases";
import bcrypt from "bcrypt";

const { controllerAdapter } = RESTAPIService;

export default RESTAPIService.addPath("", (router: any) => {
  router
    .post(
      "/signup",
      controllerAdapter((ctx: any) =>
        signup(RepositoryService, AuthServices, bcrypt, ctx)
      )
    )
    .get(
      "/signin",
      controllerAdapter((ctx: any) =>
        login(RepositoryService, ChatService, AuthServices, bcrypt, ctx)
      )
    )
    .post(
      "/signin",
      controllerAdapter((ctx: any) =>
        login(RepositoryService, ChatService, AuthServices, bcrypt, ctx)
      )
    )
    .get(
      "/logout",
      controllerAdapter((ctx: any) => logout(ChatService, ctx))
    )
    .get(
      "/checkifisonline",
      controllerAdapter((ctx: any) => checkIfIsOnline(ChatService))
    );
});
