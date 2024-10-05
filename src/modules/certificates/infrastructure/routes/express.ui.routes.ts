import { RESTAPIService } from "../../../../config/dependencies";
import { getCertifications } from "../../application/use_cases";
import { RepositoryService } from "../../../../config/dependencies";

const { controllerAdapter } = RESTAPIService;

export default RESTAPIService.addPath("/certifications", (router: any) =>
  router.get("/", async (req: any, res: any, next: any) => {
    const certificates = await getCertifications(RepositoryService, {});
    res.render("hello", { message: "Hola Mundo!", list: certificates });
  })
);
