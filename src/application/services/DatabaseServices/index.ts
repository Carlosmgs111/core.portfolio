import DatabaseMongooseService from "./DatabaseMongooseService";
import DatabaseSequelizeService from "./DatabaseSequelizeService";

export class DatabaseService extends DatabaseMongooseService {
  constructor(props: any) {
    super(props);
  }
}
