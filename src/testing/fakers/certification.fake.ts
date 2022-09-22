import { faker } from "@faker-js/faker";

export const generateOneCertification = () => ({
  title: faker.helpers
    .fake("{{commerce.productAdjective}}: {{commerce.productDescription}} ")
    .toUpperCase(),
  emitedAt: Number(faker.datatype.datetime({min:1577836800000}).getTime()),
  image: faker.image.avatar(),
  url: faker.internet.url(),
});

// generate many fake users
export const generateManyCertifications = (size = 10) => {
  const fakeProjects: any = [];
  for (let idx: number = 0; idx < size; idx++) {
    fakeProjects.push(generateOneCertification());
  }
  return [...fakeProjects];
};
