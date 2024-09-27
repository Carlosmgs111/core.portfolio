import { RESTAPIService } from "../../../../../config/dependencies";
import { resetPassword } from "../../../application/use_cases";

const { controllerAdapter } = RESTAPIService;

export default RESTAPIService.addPath("", (router: any) => {
  router.patch("/reset", controllerAdapter(resetPassword));
});
