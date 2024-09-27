import { RESTAPIService } from "../../../config/dependencies";
import { generateImages, availabelSettings, modifyImages } from "../";

const { controllerAdapter } = RESTAPIService;

export default RESTAPIService.addPath("", (router: any) => {
  router
    .post("/generate", controllerAdapter(generateImages))
    .get("/availablesettings", controllerAdapter(availabelSettings))
    .post("/modifyimages", controllerAdapter(modifyImages));
});
