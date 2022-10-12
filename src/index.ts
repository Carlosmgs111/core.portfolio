import app from "./infrastructure/apis/express/index";
import { DatabaseService } from "./config/dependencies";
import "./infrastructure/repositories/mongoose";
DatabaseService.info();
app();
