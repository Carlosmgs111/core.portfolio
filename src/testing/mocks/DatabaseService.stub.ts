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

async function create(this: any, fake: any) {
  fakeDatabase[this.Entity].push(fake);
}

async function findOne(this: any, fake: any) {
  const { credentials } = fake;
  const recovered =
    fakeDatabase[this.Entity].filter((value: any) => {
      for (let attr in credentials) {
        for (let val in value) {
          if (credentials[attr] === value[val]) return value;
        }
      }
    })[0] || null;
  return recovered;
}

async function removeOne(this: any, fake: any) {
  let index = 0;
  const { credentials } = fake;
  fakeDatabase[this.Entity].forEach((value: any, idx: any) => {
    for (let attr in credentials) {
      for (let val in value) {
        if (credentials[attr] === value[val]) {
          index = idx;
          return;
        }
      }
    }
  });
  fakeDatabase[this.Entity].splice(index, 1);
  return null;
}

export const DatabaseServiceStub = {
  create,
  findOne,
  find: async function () {
    return fakeDatabase["some to add here"];
  },
  removeOne,
  update: async () => {},
  createOneRelationshipN2N: () => {},
  removeOneRelationshipN2N: () => {},
  createOneRelationship2One: () => {},
  entities: setEnums(Object.entries(fakeDatabase).flatMap((m: any) => m[0])),
};

export const spyCreate = jest.spyOn(DatabaseServiceStub, "create");
export const spyFindOne = jest.spyOn(DatabaseServiceStub, "findOne");
export const spyFind = jest.spyOn(DatabaseServiceStub, "find");

export default jest.mock("../../config/dependencies", () => {
  // jest.fn().mockImplementation(() => DatabaseServiceStub)
  return {
    __esModule: true,
    DatabaseService: DatabaseServiceStub,
  };
});
