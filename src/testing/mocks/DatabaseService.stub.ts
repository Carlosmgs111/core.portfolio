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

async function remove(this: any, fake: any) {
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
  Entity: "",
  create,
  findOne,
  find: async function () {
    return fakeDatabase[this.Entity];
  },
  remove,
  update: async () => {},
  setupEntity: function (entityLabel: string) {
    this.Entity = entityLabel;
    return this;
  },
  relate: () => {},
  unrelate: () => {},
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
