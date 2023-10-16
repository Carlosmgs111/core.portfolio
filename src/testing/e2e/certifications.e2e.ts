import request from "supertest";
import { app } from "../../infrastructure/apis/express";
import { generateOneProject } from "../fakers/project.fake";
import { generateOneUser } from "../fakers/user.fake";
import { generateOneInstitution } from "../fakers/institution.fake";
import { sequelize } from "../../services/DatabaseServices/SequelizeAdapter/infrastructure";
import { models } from "../../services/DatabaseServices/SequelizeAdapter/infrastructure/models";
import { generateOneCertification } from "../fakers/certification.fake";

const {
  User,
  Institution,
  Certification,
  Users_Certifications,
  Users_Institutions,
} = models;

describe("Creation of a new certification", () => {
  let user: any;
  let institution: any;
  let server: any;
  let userToken: string;

  beforeAll(async () => {
    server = app.listen(4080, () =>
      ("Test server running at port 4080")
    );
    await User.sync({ force: true });
    await Institution.sync({ force: true });
    await Certification.sync({ force: true });
    await Users_Certifications.sync({ force: true });
    await Users_Institutions.sync({ force: true });
    user = generateOneUser();
    await request(app).post("/api/v1/signup").send(user);
    const { token }: any = (await request(app).get("/api/v1/signin").send(user))
      .body;
    userToken = token;
    institution = (
      await request(app)
        .post("/api/v1/institutions")
        .send(generateOneInstitution())
        .set("Authorization", `Bearer ${userToken}`)
    ).body;
  });

  afterAll(async () => {
    await sequelize.close();
    await server.close();
  });

  describe("Create a new certification and related with existing entities", () => {
    test("Create a new certification", async () => {
      await ({ user });
      await ({ institution });
      const { body } = await request(app)
        .post("/api/v1/certifications/")
        .send({
          ...generateOneCertification(),
          emitedBy: institution.name,
        })
        .set("Authorization", `Bearer ${userToken}`);
      await ({ body });
    });
  });
});
