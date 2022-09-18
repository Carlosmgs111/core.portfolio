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
        .send(generateOneProject()).set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjU0MDhkM2MtMjAzOS00N2U2LTg2ZjUtZGVhNGY0NWJiMTc2IiwiZW1haWwiOiJjYXJsb3NtZ3MxMTFAb3V0bG9vay5jb20iLCJpYXQiOjE2NjM1MTc0NTAsImV4cCI6MTY2NjEwOTQ1MH0.zNtKPgtU2rSZbdvqAx6Y-5iW6CBxIXr7ZRUV43tJrK4"
        );;
      await console.log({ body });
    });
  });

  describe("test for get all projects", () => {
    test("should return a list", async () => {
      const { body } = await request(app)
        .get("/api/projects/projects") .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjU0MDhkM2MtMjAzOS00N2U2LTg2ZjUtZGVhNGY0NWJiMTc2IiwiZW1haWwiOiJjYXJsb3NtZ3MxMTFAb3V0bG9vay5jb20iLCJpYXQiOjE2NjM1MTc0NTAsImV4cCI6MTY2NjEwOTQ1MH0.zNtKPgtU2rSZbdvqAx6Y-5iW6CBxIXr7ZRUV43tJrK4"
        )
        .expect(200);

      await console.log({ body });
      expect.arrayContaining(body);
      expect(body.length).toEqual(1);
    });
  });
});
