import DatabaseMongooseService from "./DatabaseMongooseService";
import DatabaseSequelizeService  from "./DatabaseSequelizeService";

export class DatabaseService extends DatabaseMongooseService {
  services: any;
  constructor(props: any) {
    super(props)
  }
}
