import request from "supertest";
import { generateOneUser } from "../fakers/user.fake";
import { app } from "../../infrastructure/apis/express";
import { generateOneProject } from "../fakers/project.fake";
import { models } from "../../services/DatabaseServices/SequelizeAdapter/infrastructure/models";
import {
  SocketService,
  TaskMessageService,
  RepositoryService,
} from "../../config/dependencies";
import "colors";

const { Project } = models;

describe("Test for get all projects endpoint", () => {
  let server: any = null;
  let userToken: string;

  beforeAll(async () => {
    server = app.listen(4040, () =>
      console.log("Test server running at port 4040")
    );
    const user = generateOneUser();
    await request(app).post("/api/v1/signup").send(user);
    const { token }: any = (await request(app).get("/api/v1/signin").send(user))
      .body;
    userToken = token;
  });

  afterAll(async () => {
    await server.close();
    // * Force cleanup of databases
    await RepositoryService.dropAllEntities();
    // * Close all services
    await SocketService.close();
    await RepositoryService.close();
    await TaskMessageService.close();
  });

  describe("test for create projects", () => {
    test("should add a new project", async () => {
      const { body } = await request(app)
        .post("/api/v1/projects")
        .send(generateOneProject())
        .set("Authorization", `Bearer ${userToken}`);
    });
  });

  describe("test for get all projects", () => {
    test("should return a list", async () => {
      const { body } = await request(app)
        .get("/api/v1/projects")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect.arrayContaining(body);
      expect(body.length).toEqual(1);
    });
  });
});
