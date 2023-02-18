import Project from "./Project";
import User from "./User";
import Certification from "../../../../certifications/infrastructure/repositories/mongoose/Certification";
import Institution from "./Institution";
import Post from "./Post";
import Skill from "./Skill";
import Note from "./Note";

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
