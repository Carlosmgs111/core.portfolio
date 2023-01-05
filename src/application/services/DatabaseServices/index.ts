import { setEnums } from "../../../utils";
import SequelizeAdapter from "./SequelizeAdapter";
import MongooseAdapter from "./MongooseAdapter";

export const Adapters: any = {
  SequelizeAdapter,
  MongooseAdapter,
};

console.log({Adapters})

export const DatabaseService = (
  adapter:string = Adapters.SequelizeAdapter) => {
  console.log({adapter})
  class DatabaseService extends adapter{
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