import { setEnums } from "../../../utils";
import DatabaseMongooseService from "./DatabaseMongooseService";
import DatabaseSequelizeService from "./DatabaseSequelizeService";

export const ServicesInterface: any = {
  DatabaseMongooseService,
  DatabaseSequelizeService,
};

export const ServicesInterfaceEnums: any = setEnums([
  DatabaseSequelizeService.name,
  DatabaseMongooseService.name,
]);

export const DatabaseService = (
  service:string = ServicesInterfaceEnums.DatabaseSequelizeService) => {
  console.log({service})
  class DatabaseService extends  ServicesInterface[service]{
    constructor(props: any) {
      super(props);
    }

    info() {
      console.table({ "Database Service": this.serviceDescription });
      return { databaseInterfaceName: this.serviceDescription };
    }
  }
  return new DatabaseService({})
};
