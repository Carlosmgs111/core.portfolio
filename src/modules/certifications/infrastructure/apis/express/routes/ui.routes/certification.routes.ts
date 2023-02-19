import { Router } from "express";
import { getCertifications } from "../../../../../application/certifications";
// import { validatorHandler } from "../middlewares/validator.handler";

const router = Router();

export default router.get("/", async (req: any, res: any, next: any) => {
  const certifications = await getCertifications(req);
  res.render("hello", { message: "Hola Mundo!", list: certifications });
});
