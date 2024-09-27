import { RESTAPIService } from "../../../../config/dependencies";
import {
  addNewInstitution,
  getAllInstitutions,
  updateInstitution,
  deleteInstitution,
} from "../../application/use_cases";

const { controllerAdapter } = RESTAPIService;

export default RESTAPIService.addPath("/institutions", (router: any) => {
  router
    .post("/", controllerAdapter(addNewInstitution))
    .get("/", controllerAdapter(getAllInstitutions))
    .patch("/", controllerAdapter(updateInstitution))
    .delete("/", controllerAdapter(deleteInstitution));
});
