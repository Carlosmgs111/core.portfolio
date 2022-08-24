import  DatabaseMongooseService  from "./DatabaseMongooseService";
import { DatabaseSequelizeService } from "./DatabaseSequelizeService";

export class DatabaseService {
  MongooseService: any;
  SequelizeService: any;
  constructor(props: any) {
    const { __identifier } = props;
    this.MongooseService = new DatabaseMongooseService({ __identifier });
    this.SequelizeService = new DatabaseSequelizeService({ __identifier });
  }
  create = async (Entity: any) => {
    return await this.MongooseService.create(Entity);
  };
  findAll = async () => {
    return await this.MongooseService.find();
  };
  findOne = async (Entity: any) => {
    return await this.MongooseService.findOne(Entity);
  };
  remove = async (Entity: any) => {
    return await this.MongooseService.remove(Entity);
  };
  update = async (Entity: any) => {
    return await this.MongooseService.update(Entity);
  };
}
