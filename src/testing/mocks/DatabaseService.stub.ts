export const fakeDatabase: any = {
  User: [],
  Project: [],
  Certification: [],
  Post: [],
  Institution: [],
  Users_Certifications: [],
  Users_Institutions: [],
};

async function create(this: any, fake: any) {
  console.log({ fake });
  fakeDatabase[this.Model].push(fake);
}

async function findOne(this: any, fake: any) {
  const { credentials } = fake;
  console.log({ CREDENTIALS: credentials });
  return (
    fakeDatabase[this.Model].filter((value: any) => {
      for (let attr in credentials) {
        for (let val in value) {
          if (credentials[attr] === value[val]) return value;
        }
      }
    })[0] || null
  );
}

async function remove(this: any, fake: any) {
  let index = 0;
  fakeDatabase[this.Model].forEach((value: any, idx: any) => {
    for (let attr in fake) {
      for (let val in value) {
        if (fake[attr] === value[val]) index = idx;
      }
    }
  });
  await delete fakeDatabase[this.Model][index];
  return null;
}

export const DatabaseServiceStub = {
  Model: "",
  create,
  findOne,
  find: async function () {
    return fakeDatabase[this.Model];
  },
  remove,
  update: async () => {},
  setupModel: async function (model: string) {
    this.Model = model;
  },
};

export const spyCreate = jest.spyOn(DatabaseServiceStub, "create");
export const spyFindOne = jest.spyOn(DatabaseServiceStub, "findOne");
export const spyFind = jest.spyOn(DatabaseServiceStub, "find");

console.log({ fakeDatabase });

export default jest.mock("../../config/dependencies", () => {
  // jest.fn().mockImplementation(() => DatabaseServiceStub)
  return {
    __esModule: true,
    DatabaseService: DatabaseServiceStub,
  };
});
