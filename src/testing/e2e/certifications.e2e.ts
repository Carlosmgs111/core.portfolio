import request from "supertest";
import { app } from "../../infrastructure/apis/express";
import { generateOneProject } from "../fakers/project.fake";
import { generateOneUser } from "../fakers/user.fake";
import { generateOneInstitution } from "../fakers/institution.fake";
import { connection } from "../../infrastructure/repositories/mongoose";
import { sequelize } from "../../infrastructure/repositories/sequelize/src";
import { User } from "../../infrastructure/repositories/sequelize/src/models/User";
import { Institution } from "../../infrastructure/repositories/sequelize/src/models/Institution";
import { Certification } from "../../infrastructure/repositories/sequelize/src/models/Certification";
import { Users_Certifications } from "../../infrastructure/repositories/sequelize/src/models/User_Certification";
import { DatabaseService } from "../../config/dependencies";
import { generateOneCertification } from "../fakers/certification.fake";

describe("Creation of a new certification", () => {
  let user: any;
  let institution: any;
  let server: any;
  let userToken: string;

  beforeAll(async () => {
    server = app.listen(4080, () =>
      console.log("Test server running at port 4080")
    );
    User.sync({ alter: true });
    Institution.sync({ alter: true });
    Certification.sync({ alter: true });
    Users_Certifications.sync({ alter: true });
    user = generateOneUser();
    await request(app).post("/api/v1/signup").send(user);
    const { token }: any =( await request(app)
      .get("/api/v1/signin")
      .send(user)).body;
    userToken = token
    console.log({"TOKEN!: ": token})
    institution = (await request(app)
      .post("/api/v1/institutions")
      .send(generateOneInstitution())
      .set("Authorization", `Bearer ${userToken}`)).body;
    console.log({"INSTITUTION!: ": institution})

  }, 12000);

  afterAll(async () => {
    await server.close();
    //  await sequelize.drop();
    await sequelize.close();
    // connection.db.dropDatabase();
  });

  describe("Create a new certification and related with existing entities", () => {
    test("Create a new certification", async () => {
      await console.log({ user });
      await console.log({ institution });
      const { body } = await request(app)
        .post("/api/v1/certifications/")
        .send({
          ...generateOneCertification(),
          emitedBy: institution.businessName,
        })
        .set("Authorization", `Bearer ${userToken}`);
      await console.log({ body });
    });
  });
});
