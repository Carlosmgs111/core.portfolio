import { faker } from "@faker-js/faker";

export const generateOneCertification = (count: number = 0) => ({
  title: `${faker.helpers
    .fake("{{commerce.productAdjective}}: {{commerce.productDescription}} ")
    .toUpperCase()} ${count}`,
  emitedAt: Number(faker.datatype.datetime({ min: 1577836800000 }).getTime()),
  emitedBy: "Platzi",
  image: `${faker.image.avatar()} ${count}`,
  url: `${faker.internet.url()} ${count}`,
});

// generate many fake users
export const generateManyCertifications = (size = 10) => {
  const fakeProjects: any = [];
  for (let idx: number = 0; idx < size; idx++) {
    fakeProjects.push(generateOneCertification(Number(idx)));
  }
  return [...fakeProjects];
};
