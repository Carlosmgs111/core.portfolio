import { Router } from "express";
import { sync } from "../../../../../application/use_cases/CQRS";
import { expressHandlerAdapter } from "../../../../../adapters/apis/express";

const router = Router();

export default router.get("/sync", expressHandlerAdapter(sync));
