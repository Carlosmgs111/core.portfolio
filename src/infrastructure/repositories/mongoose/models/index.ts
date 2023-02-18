import Project from "../../../../projects/insfrastructure/repositories/mongoose/Project";
import User from "../../../../users/infrastructure/repositories/mongoose/User";
import Certification from "../../../../certifications/infrastructure/repositories/mongoose/Certification";
import Institution from "../../../../institutions/infrastructure/repositories/mongoose/Institution";
import Post from "../../../../posts/insfrasctructure/repositories/mongoose/Post";
import Skill from "../../../../skills/infrastructure/repositories/mongoose/Skill";
import Note from "../../../../notes/insfrastructure/repositories/mongoose/Note";

const models: any = {
  Project,
  User,
  Certification,
  Institution,
  Post,
  Skill,
  Note,
};

export default models;
