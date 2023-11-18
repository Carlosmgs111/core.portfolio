import request from "supertest";
import { asyncDelay } from "./utils";
import { generateOneUser } from "../fakers/user.fake";
import { app } from "../../infrastructure/apis/express";
import { generateOneProject } from "../fakers/project.fake";
import {
  SocketService,
  TaskMessageService,
  RepositoryService,
} from "../../config/dependencies";
import "colors";

describe("Test for get all projects endpoint", () => {
  let server: any = null;
  let userToken: string;

  beforeAll(async () => {
    server = app.listen(4040, () =>
      console.log("Test server running at port 4040")
    );
    const user = generateOneUser();
    const { token } = (await request(app).post("/api/v1/signup").send(user))
      .body;
    userToken = token;
    await asyncDelay()
  }, 20000);

  afterAll(async () => {
    await server.close();
    // * Force cleanup of databases
    await RepositoryService.dropAllEntities();
    // * Close all services
    await SocketService.close();
    await TaskMessageService.close();
    await RepositoryService.close();
  }, 20000);

  describe("test for create projects", () => {
    jest.setTimeout(15000);
    test("should add a new project", async () => {
      await asyncDelay()
      const { body } = await request(app)
        .post("/api/v1/projects")
        .send(generateOneProject())
        .set("Authorization", `Bearer ${userToken}`);
    });
  });

  describe("test for get all projects", () => {
    jest.setTimeout(15000);
    test("should return a list", async () => {
      await asyncDelay()
      const { body } = await request(app)
        .get("/api/v1/projects")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);
      expect.arrayContaining(body);
      expect(body.length).toEqual(1);
    });
  });
});
