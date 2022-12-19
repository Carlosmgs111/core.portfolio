import { authMiddleware } from "./auth.handler";
import { apiConfig, uiConfig } from "../../../../config/dependencies";

export const grantUrls = (urlsGranted: string[][][]) => {
  const urls = [
    { urls: [{ urls: [], methods: [] }], methods: [] },
    { urls: [], methods: [] },
  ];
  return (req: any, res: any, next: any) => {
    const {
      url,
      method,
      params,
      headers: { authorization },
    } = req;
    req.token = (authorization || "").replace("Bearer ", "");
    
    let toGrantUrl = url
      .replace(`/api/${apiConfig.version}/`, "")
      .replace(`/ui/${uiConfig.version}/`, "")
      .split("/")[0]
      .split("?")[0];
    let isGranted = false;
    for (var urlGranted of urlsGranted) {
      let [pathsGranted, methodsGranted = []]: any = urlGranted;
      methodsGranted = ["GET", ...methodsGranted];
      const isIncluded =
        pathsGranted.includes(toGrantUrl) && methodsGranted.includes(method);
      if (isIncluded) {
        isGranted = true;
        break;
      }
    }
    isGranted ? next() : authMiddleware(req, res, next);
  };
};
