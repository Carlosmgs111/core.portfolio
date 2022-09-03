import { fakeCollection } from "../../../mocks/DatabaseService.stub";
import { DatabaseService } from "../../../../application/services/DatabaseServices";
import { User } from "../../../../domain/entities/User";
import { Certification } from "../../../../domain/entities/Certification";
import { Institution } from "../../../../domain/entities/Institution";
import { addNewCertification } from "../../../../application/use_cases/certifications";

describe("Aggregates of certificates", () => {
  const userCredentials = {
    uuid:"123",
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

  const DBS = new DatabaseService({})

  beforeAll(async () => {/* 
    spyFindOne.mockResolvedValue(userCredentials); */
    user = await User.create(
      DBS.setup("User"),
      userCredentials
    );
    institution = await Institution.create(
      DBS.setup("Institution"),
      institutionData
    );
    // jest.clearAllMocks() / ? for clear all mocks
  });

  describe("Create a new certification", () => {
    test("Use case add new certification", async () => {
      // spyFindOne.mockResolvedValue(institution);
      const certificationData = {
        title: "ANGULAR.JS: MANEJO PROFESIONAL DEL ESTADO",
        certificatedTo: user.email,
        emitedBy: institution.businessName,
        emitedDate: new Date().getTime(),
        image: "https://image_angular.url.com",
        url: "https://url_angular.com",
      };
      console.log({fakeCollection})
      certification = await addNewCertification(certificationData);
      expect(certification.emitedBy).toEqual(institution.uuid);
      expect(certification.certificatedTo).toEqual(user.uuid);
      expect(certification.createdAt).toBeGreaterThan(0);
      expect(certification.updatedAt).toBeGreaterThan(0);
    });
  });

  afterAll(async () => {
    await user.remove(new DatabaseService({ __identifier: "User" }));
    await institution.remove(
      DBS.setup("Institution")
    );
    await certification.remove(
      DBS.setup("Certification")
    );
  });
});
