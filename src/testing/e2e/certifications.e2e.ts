import request from "supertest";
import { asyncDelay } from "./utils";
import { app } from "../../infrastructure/apis/express";
import { generateOneUser } from "../fakers/user.fake";
import { generateOneInstitution } from "../fakers/institution.fake";
import { generateOneCertification } from "../fakers/certification.fake";
import {
  SocketService,
  TaskMessageService,
  RepositoryService,
} from "../../config/dependencies";
import "colors";

describe("Creation of a new certification", () => {
  let user: any;
  let institution: any;
  let server: any;
  let userToken: string;

  beforeAll(async () => {
    server = app.listen(4080, () => "Test server running at port 4080");
    user = generateOneUser();
    const { token }: any = (
      await request(app).post("/api/v1/signup").send(user)
    ).body;
    userToken = token;
    await asyncDelay()
    institution = (
      await request(app)
        .post("/api/v1/institutions")
        .send(generateOneInstitution())
        .set("Authorization", `Bearer ${userToken}`)
    ).body;
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

  describe("Create a new certification and related with existing entities", () => {
    jest.setTimeout(15000);
    test("Create a new certification", async () => {
      await asyncDelay()
      const { body } = await request(app)
        .post("/api/v1/certifications/")
        .send({
          ...generateOneCertification(),
          emitedBy: institution.name,
        })
        .set("Authorization", `Bearer ${userToken}`);
    });
  });
});
