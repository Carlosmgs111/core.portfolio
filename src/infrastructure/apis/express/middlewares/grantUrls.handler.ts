import { authMiddleware } from "./auth.handler";
import { apiConfig } from "../../../../config/dependencies";

export const grantUrls = (
  urlsGranted: any
) => {
  return (req: any, res: any, next: any) => {
    let granted=false;
    for (var urlGranted of urlsGranted) {
      let [pathsGranted, methodsGranted=[]]: any = urlGranted;
      methodsGranted = ["GET", ...methodsGranted];
      console.log({ pathsGranted, methodsGranted });
      if (
        pathsGranted.includes(
          req.url.replace(`/api/${apiConfig.version}/`, "").replace("/", "")
        ) &&
        methodsGranted.includes(req.method)
      ) {
        granted=true
        break
      } else {
        granted=false
      }
    }
    granted?next():authMiddleware(req, res, next);
  };
};
