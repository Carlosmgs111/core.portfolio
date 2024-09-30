import { Router } from "express";
import { getCertifications } from "../../application/use_cases";
// import { validatorHandler } from "../middlewares/validator.handler";

const router = Router();

export default router.get("/", async (req: any, res: any, next: any) => {
  const certifications = await getCertifications(req, null);
  res.render("hello", { message: "Hola Mundo!", list: certifications });
});
