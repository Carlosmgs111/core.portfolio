import Project from "../../../../modules/projects/models/mongoose";
import User from "../../../../modules/users/models/mongoose";
import Certification from "../../../../modules/certifications/models/mongoose";
import Institution from "../../../../modules/institutions/models/mongoose";
import Post from "../../../../modules/posts/models/mongoose";
import Skill from "../../../../modules/skills/models/mongoose";
import Note from "../../../../modules/notes/models/mongoose";

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
