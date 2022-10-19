import { Router } from "express";
import { getCertifications } from "../../../../application/use_cases/certifications";
// import { validatorHandler } from "../middlewares/validator.handler";

const router = Router();

export default router.get("/hello", async (req: any, res: any, next: any) => {
  const certifications = await getCertifications(req);
  console.log({ certifications });
  res.render("hello", { message: "Hola Mundo!", list: certifications });
});
