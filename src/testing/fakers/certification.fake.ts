import { faker } from "@faker-js/faker";

export const generateOneCertification = (count: number = 0) => ({
  title: `${faker.helpers
    .fake("{{commerce.productAdjective}}: {{commerce.productDescription}} ")
    .toUpperCase()} ${Number(
    String(Math.random()).replace("0.", "")
  )} ${count}`,
  emitedAt: Number(faker.datatype.datetime({ min: 1577836800000 }).getTime()),
  emitedBy: "Platzi",
  image: `${faker.image.avatar()} ${Number(
    String(Math.random()).replace("0.", "")
  )} ${count}`,
  url: `${faker.internet.url()} ${Number(
    String(Math.random()).replace("0.", "")
  )} ${count}`,
});

// generate many fake users
export const generateManyCertifications = (size = 10) => {
  const fakeProjects: any = [];
  for (let idx: number = 0; idx < size; idx++) {
    fakeProjects.push(generateOneCertification(Number(idx)));
  }
  return [...fakeProjects];
};
