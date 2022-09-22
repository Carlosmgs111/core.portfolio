import DatabaseMongooseService from "./DatabaseMongooseService";
import DatabaseSequelizeService from "./DatabaseSequelizeService"

export class DatabaseService extends DatabaseSequelizeService {
  constructor(props: any) {
    super(props);
  }

  info(){
    console.table({"Database Service": this.name})
    return {databaseInterfaceName: this.name}
  }
}
