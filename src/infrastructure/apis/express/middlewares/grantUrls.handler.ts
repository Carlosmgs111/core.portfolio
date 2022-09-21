import { authMiddleware } from "./auth.handler";
import { apiConfig } from "../../../../config/dependencies";

export const grantUrls = (
  urlsGranted: string[] = [],
  methodsGranted: string[] = []
) => {
  methodsGranted = ["GET", ...methodsGranted];
  return (req: any, res: any, next: any) => {
    if (
      urlsGranted.includes(
        req.url.replace(`/api/${apiConfig.version}/`, "").replace("/", "")
      ) &&
      methodsGranted.includes(req.method)
    ) {
      next();
    } else {
      authMiddleware(req, res, next);
    }
  };
};
