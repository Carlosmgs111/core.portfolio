export const fakeCollection: any = [];

const create = async (fake: any) => {
  fakeCollection.push(fake);
};

const findOne = async (fake: any) => {
  console.log("FINDONE")
  return (
    fakeCollection.filter((value: any) => {
      for (let attr in fake) {
        for (let val in value) {
          if (fake[attr] === value[val]) return value;
        }
      }
    })[0] || null
  );
};

const remove = async (fake: any) => {
  let index = 0;
  fakeCollection.forEach((value: any, idx: any) => {
    for (let attr in fake) {
      for (let val in value) {
        if (fake[attr] === value[val]) index = idx;
      }
    }
  });
  await delete fakeCollection[index];
  return null;
};

export const DatabaseServiceStub = {
  create,
  findOne,
  find: async () => fakeCollection,
  remove,
  update: async () => {},
  setupModel: async ()=>{}
};

export const spyCreate = jest.spyOn(DatabaseServiceStub, "create");
export const spyFindOne = jest.spyOn(DatabaseServiceStub, "findOne");
export const spyFind = jest.spyOn(DatabaseServiceStub, "find");

export default jest.mock(
  "../../application/services/DatabaseServices/DatabaseSequelizeService",
  () => jest.fn().mockImplementation(() => DatabaseServiceStub)
);
