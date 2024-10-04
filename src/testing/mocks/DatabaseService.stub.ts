import { Query } from "mongoose";
import { setEnums } from "../../utils";

export const fakeDatabase: any = {
  User: [],
  Project: [],
  Certification: [],
  Post: [],
  Institution: [],
  Users_Certifications: [],
  Users_Institutions: [],
  Users_Skills: [],
};

async function createOne(this: any, entity: any, fake: any) {
  fakeDatabase[entity].push(fake);
  return fake;
}

async function findOne(this: any, entity: any, fake: any) {
  const { credentials } = fake;
  const recovered =
    fakeDatabase[entity].filter((value: any) => {
      for (let attr in credentials) {
        for (let val in value) {
          if (credentials[attr] === value[val]) return value;
        }
      }
    })[0] || null;
  return recovered;
}

async function removeOne(this: any, entity: any, fake: any) {
  let index = 0;
  const { credentials } = fake;
  fakeDatabase[entity].forEach((value: any, idx: any) => {
    for (let attr in credentials) {
      for (let val in value) {
        if (credentials[attr] === value[val]) {
          index = idx;
          return;
        }
      }
    }
  });
  fakeDatabase[entity].splice(index, 1);
  return null;
}
const entities = setEnums(
  Object.entries(fakeDatabase).flatMap((m: any) => m[0])
);
export const DatabaseServiceStub = {
  createOne,
  findOne,
  find: async function () {
    return fakeDatabase["some to add here"];
  },
  removeOne,
  update: async () => {},
  setOneRelationshipManyToMany: () => {},
  unsetOneRelationshipManyToMany: () => {},
  setOneRelationship2One: () => {},
  unsetOneRelationship2One: () => {},
  entities,
  QueryService: {
    entities: entities,
  },
};

export const spyCreateOne = jest.spyOn(DatabaseServiceStub, "createOne");
export const spyFindOne = jest.spyOn(DatabaseServiceStub, "findOne");
export const spyFind = jest.spyOn(DatabaseServiceStub, "find");

// * This modules always must be imported for correct replacement of real DatabaseService with its stub!

export default jest.mock("../../config/dependencies", () => {
  // jest.fn().mockImplementation(() => DatabaseServiceStub)
  return {
    __esModule: true,
    RepositoryService: DatabaseServiceStub,
  };
});
