// import { spyFind } from "../__mocks__/DatabaseServiceStub";
import request from "supertest";
import { app } from "../../infrastructure/apis/express";
import { generateOneProject } from "../fakers/project.fake";
import { connection } from "../../infrastructure/repositories/mongoose";
import { sequelize } from "../../infrastructure/repositories/sequelize/src";

describe("Test for get all projects endpoint", () => {
  let server: any = null;
  beforeAll(() => {
    server = app.listen(4040, () =>
      console.log("Test server running at port 4040")
    );
    // sequelize.sync({alter:true})
  });
  afterAll(async () => {
    await server.close();
    await sequelize.drop()
    connection.db.dropDatabase();
  });

  describe("test for create projects", () => {
    test("should add a new project", async () => {
      const { body } = await request(app)
        .post("/api/projects/add")
        .send(generateOneProject());
      await console.log({ body });
    });
  });

  describe("test for get all projects", () => {
    test("should return a list", async () => {
      const { body } = await request(app)
        .get("/api/projects/projects")
        .expect(200);

      await console.log({ body });
      expect.arrayContaining(body);
      expect(body.length).toEqual(1);
    });
  });
});
