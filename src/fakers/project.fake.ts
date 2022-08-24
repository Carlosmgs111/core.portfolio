import { faker } from "@faker-js/faker";

export const generateOneProject = () => ({
  name: faker.company.name(),
  description: faker.commerce.productDescription(),
  uri: faker.internet.url(),
  version: `${faker.datatype.number(100)}.${faker.datatype.number(
    100
  )}.${faker.datatype.number(100)}`,
});

// generate many fake users
export const generateManyProjects = (size = 10) => {
  const fakeProjects: any = [];
  for (let idx: number = 0; idx < size; idx++) {
    fakeProjects.push(generateOneProject());
  }
  return [...fakeProjects];
};
