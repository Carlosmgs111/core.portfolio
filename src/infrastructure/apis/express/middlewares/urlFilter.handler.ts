import { authMiddleware } from "./auth.handler";

export const urlFilter = (
  urlsGranted: string[] = [],
  methodsGranted: string[] = []
) => {
  methodsGranted = ["GET", ...methodsGranted];
  return (req: any, res: any, next: any) => {
    if (
      urlsGranted.includes(req.url.replace("/api/", "").replace("/", "")) &&
      methodsGranted.includes(req.method)
    ) {
      console.log("GRANTED");
      next();
    } else {
      authMiddleware(req, res, next);
    }
  };
};
