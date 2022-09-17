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
import { DatabaseService } from "../../application/services/DatabaseServices";
import { generateOneCertification } from "../fakers/certification.fake";

describe("Creation of a new certification", () => {
  let user: any;
  let institution: any;
  let server: any;
  const DBS = new DatabaseService({});
  beforeAll(async () => {
    server = app.listen(4080, () =>
      console.log("Test server running at port 4080")
    );
    user = await User.create(DBS.setup("User"), generateOneUser());
    institution = await Institution.create(
      DBS.setup("Institution"),
      generateOneInstitution()
    );
    // sequelize.sync({alter:true})
  }, 12000);

  afterAll(async () => {
    await server.close();
    await sequelize.drop()
    connection.db.dropDatabase()
  });

  describe("Create a new certification and related with existing entities", () => {
    test("Create a new certification", async () => {
      console.log({ user });
      console.log({ institution });
      const { body } = await request(app)
        .post("/api/certifications/add")
        .send({
          ...generateOneCertification(),
          certificatedTo: user.username,
          emitedBy: institution.businessName,
        });
      console.log({ body });
    });
  });
});
