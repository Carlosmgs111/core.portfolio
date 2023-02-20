// import { spyFind } from "../__mocks__/DatabaseServiceStub";
import request from "supertest";
import { generateOneUser } from "../fakers/user.fake";
import { app } from "../../infrastructure/apis/express";
import { generateOneProject } from "../fakers/project.fake";
import { sequelize } from "../../services/DatabaseServices/SequelizeAdapter/infrastructure/src";
import { models } from "../../services/DatabaseServices/SequelizeAdapter/infrastructure/models";

const { Project } = models;

describe("Test for get all projects endpoint", () => {
  let server: any = null;
  let userToken: string;

  beforeAll(async () => {
    server = app.listen(4040, () =>
      console.log("Test server running at port 4040")
    );
    await Project.sync({ force: true });
    const user = generateOneUser();
    await request(app).post("/api/v1/signup").send(user);
    const { token }: any = (await request(app).get("/api/v1/signin").send(user))
      .body;
    userToken = token;
  });
  afterAll(async () => {
    await sequelize.close();
    await server.close();
  });

  describe("test for create projects", () => {
    test("should add a new project", async () => {
      const { body } = await request(app)
        .post("/api/v1/projects")
        .send(generateOneProject())
        .set("Authorization", `Bearer ${userToken}`);
      await console.log({ body });
    });
  });

  describe("test for get all projects", () => {
    test("should return a list", async () => {
      const { body } = await request(app)
        .get("/api/v1/projects")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      await console.log({ body });
      expect.arrayContaining(body);
      expect(body.length).toEqual(1);
    });
  });
});
