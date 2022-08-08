import { DatabaseService } from "../../../domain/services/DatabaseServices.ts";
import { User } from "../../../domain/entities/User";
import { Certification } from "../../../domain/entities/Certification";
import { Institution } from "../../../domain/entities/Institution";
import { addNewCertification } from "../../../domain/use_cases/certifications";
import "../../../infrastructure/repositories/mongoose";

describe("Aggregates of certificates", () => {
  const userCredentials = {
    username: "test245",
    email: "test245@email.com",
    password: "p@55w0rd",
  };
  const institutionData = {
    name: "Test Institution",
    businessName: "Test Institution SAS",
    descriptions: ["Test Institution", "Test Institution SAS"],
    urls: ["https://test.institution.com"],
  };

  let user: User;
  let institution: Institution;
  let certification: Certification;

  beforeAll(async () => {
    user = await User.create(
      new DatabaseService({ __identifier: "User" }),
      userCredentials
    );
    institution = await Institution.create(
      new DatabaseService({ __identifier: "Institution" }),
      institutionData
    );
  });

  describe("Create a new certification", () => {
    test("Use case add new certification", async () => {
      const certificateData = {
        name: "ANGULAR.JS: MANEJO PROFESIONAL DEL ESTADO",
        certificatedTo: user.username,
        emitedBy: institution.name,
        emitedDate: new Date().getTime(),
        image: "https://image_angular.url.com",
        url: "https://url_angular.com",
      };
      certification = await addNewCertification(certificateData);
      // console.log({ certification });
      expect(certification.emitedBy).toEqual(institution.uuid);
      expect(certification.certificatedTo).toEqual(user.uuid);
      expect(certification.createdAt).toBeGreaterThan(0);
      expect(certification.updatedAt).toBeGreaterThan(0);
    });
  });

  afterAll(async () => {
    await user.remove(new DatabaseService({ __identifier: "User" }));
    await institution.remove(
      new DatabaseService({ __identifier: "Institution" })
    );
    await certification.remove(
      new DatabaseService({ __identifier: "Certification" })
    );
  });
});
