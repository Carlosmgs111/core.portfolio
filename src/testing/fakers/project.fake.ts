import { faker } from "@faker-js/faker";
import { capitalize } from "../../utils";

export const generateOneProject = () => ({
  name: capitalize(faker.company.bsBuzz()),
  descriptions: [faker.commerce.productDescription()],
  images:[faker.image.image(1234, 2345, true)],
  uri: faker.internet.url(),
  tags: [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()],
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
