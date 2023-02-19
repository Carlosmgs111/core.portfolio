import Project from "../../../../../modules/projects/insfrastructure/repositories/mongoose/Project";
import User from "../../../../../modules/users/infrastructure/repositories/mongoose/User";
import Certification from "../../../../../modules/certifications/infrastructure/repositories/mongoose/Certification";
import Institution from "../../../../../modules/institutions/infrastructure/repositories/mongoose/Institution";
import Post from "../../../../../modules/posts/insfrasctructure/repositories/mongoose/Post";
import Skill from "../../../../../modules/skills/infrastructure/repositories/mongoose/Skill";
import Note from "../../../../../modules/notes/insfrastructure/repositories/mongoose/Note";

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
