import { JoinTableFactory } from "./JoinTableFactory";
import { User } from "./User";
import { Project } from "./Project";
import { Institution } from "./Institution";
import { Certification } from "./Certification";
import { Post } from "./Post";
import { Skill } from "./Skill";

const models: any = {
  User,
  Project,
  Institution,
  Certification,
  Post,
  Skill,
  ...JoinTableFactory("User", "Institution"),
  ...JoinTableFactory("User", "Certification"),
  ...JoinTableFactory("User", "Skill"),
};

console.log({ models });

export default models;
