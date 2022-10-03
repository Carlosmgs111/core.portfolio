import { authMiddleware } from "./auth.handler";
import { apiConfig } from "../../../../config/dependencies";

export const grantUrls = (urlsGranted: string[][][]) => {
  return (req: any, res: any, next: any) => {
    let isGranted = false;
    for (var urlGranted of urlsGranted) {
      let [pathsGranted, methodsGranted = []]: any = urlGranted;
      methodsGranted = ["GET", ...methodsGranted];
      const isIncluded =
        pathsGranted.includes(
          req.url.replace(`/api/${apiConfig.version}/`, "").replace("/", "")
        ) && methodsGranted.includes(req.method);
      if (isIncluded) {
        isGranted = true;
        break;
      }
    }
    isGranted ? next() : authMiddleware(req, res, next);
  };
};
