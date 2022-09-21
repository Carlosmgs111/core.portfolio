// import { spyFind } from "../__mocks__/DatabaseServiceStub";
import request from "supertest";
import { app } from "../../infrastructure/apis/express";
import { generateOneProject } from "../fakers/project.fake";
import { generateOneUser } from "../fakers/user.fake";
import { generateOneInstitution } from "../fakers/institution.fake";
import { connection } from "../../infrastructure/repositories/mongoose";
import { sequelize } from "../../infrastructure/repositories/sequelize/src";
import { User } from "../../domain/entities/User";
import { Institution } from "../../domain/entities/Institution";
import { DatabaseService } from "../../config/dependencies";
import { generateOneCertification } from "../fakers/certification.fake";

describe("Creation of a new certification", () => {
  let user: any;
  let institution: any;
  let server: any;
  // const DatabaseService = new DatabaseService({});
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjhhMmJlNmYtMzVjNy00ZTFjLWExZjktYjc5ODQxOTk2OGY1IiwiZW1haWwiOiJjYXJsb3NtZ3MxMTFAb3V0bG9vay5jb20iLCJpYXQiOjE2NjM3Njg1NDcsImV4cCI6MTY2NjM2MDU0N30.hZlZTQwxEH75a-HI4JsVqR6tejb8feQHI_2DYR8rAbI"
  beforeAll(async () => {
    server = app.listen(4080, () =>
      console.log("Test server running at port 4080")
    );
    user = await User.create(DatabaseService.setupModel("User"), generateOneUser());
    institution = await Institution.create(
      DatabaseService.setupModel("Institution"),
      generateOneInstitution()
    );
    sequelize.sync({alter:true})
  }, 12000);

  afterAll(async () => {
    await server.close();
    // await sequelize.drop();
    connection.db.dropDatabase();
  });

  describe("Create a new certification and related with existing entities", () => {
    test("Create a new certification", async () => {
      await console.log({ user });
      await console.log({ institution });
      const { body } = await request(app)
        .post("/api/v1/certifications/")
        .send({
          ...generateOneCertification(),
          certificatedTo: user.username,
          emitedBy: institution.businessName,
        })
        .set(
          "Authorization",
          `Bearer ${token}`
        );
      await console.log({ body });
    });
  });
});
