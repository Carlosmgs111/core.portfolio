// import { spyFind } from "../__mocks__/DatabaseServiceStub";
import request from "supertest";
import { app } from "../../infrastructure/apis/express";
import { generateOneProject } from "../fakers/project.fake";
import { connection } from "../../infrastructure/repositories/mongoose";
import { sequelize } from "../../infrastructure/repositories/sequelize/src";

describe("Test for get all projects endpoint", () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjhhMmJlNmYtMzVjNy00ZTFjLWExZjktYjc5ODQxOTk2OGY1IiwiZW1haWwiOiJjYXJsb3NtZ3MxMTFAb3V0bG9vay5jb20iLCJpYXQiOjE2NjM3Njg1NDcsImV4cCI6MTY2NjM2MDU0N30.hZlZTQwxEH75a-HI4JsVqR6tejb8feQHI_2DYR8rAbI";
  let server: any = null;
  beforeAll(() => {
    server = app.listen(4040, () =>
      console.log("Test server running at port 4040")
    );
    sequelize.sync({ alter: true });
  });
  afterAll(async () => {
    await server.close();
    // await sequelize.drop()
    connection.db.dropDatabase();
  });

  describe("test for create projects", () => {
    test("should add a new project", async () => {
      const { body } = await request(app)
        .post("/api/v1/projects")
        .send(generateOneProject())
        .set("Authorization", `Bearer ${token}`);
      await console.log({ body });
    });
  });

  describe("test for get all projects", () => {
    test("should return a list", async () => {
      const { body } = await request(app)
        .get("/api/v1/projects")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      await console.log({ body });
      expect.arrayContaining(body);
      expect(body.length).toEqual(1);
    });
  });
});
