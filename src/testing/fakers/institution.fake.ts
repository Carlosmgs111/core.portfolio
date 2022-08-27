import { faker } from "@faker-js/faker";
import { capitalize } from "../../utils";

export const generateOneInstitution = () => ({
  name: capitalize(faker.company.bsBuzz()),
  businessName: faker.company.name(),
  descriptions: [
    faker.commerce.productDescription(),
    faker.commerce.productDescription(),
    faker.commerce.productDescription(),
  ],
  urls: [faker.internet.url(), faker.internet.url()],
});

// generate many fake users
export const generateManyinstitutions = (size = 10) => {
  const fakeProjects: any = [];
  for (let idx: number = 0; idx < size; idx++) {
    fakeProjects.push(generateOneInstitution());
  }
  return [...fakeProjects];
};
