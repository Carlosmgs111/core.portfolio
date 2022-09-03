import DatabaseMongooseService from "./DatabaseMongooseService";
import DatabaseSequelizeService  from "./DatabaseSequelizeService";

export class DatabaseService extends DatabaseMongooseService {
  constructor(props: any) {
    super(props)
  }
  setup = (__identifier:string)=>{this.__identifier=__identifier;return this}
}
