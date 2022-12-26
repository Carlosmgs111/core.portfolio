import "../../../mocks/DatabaseService.stub";
import { DatabaseService } from "../../../../config/dependencies";
import { User } from "../../../../domain/entities/User";
import { Certification } from "../../../../domain/entities/Certification";
import { Institution } from "../../../../domain/entities/Institution";
import { addNewCertification } from "../../../../application/use_cases/certifications";

describe("Aggregates of certificates", () => {
  const userCredentials = {
    uuid: "123",
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

  // const DBS = new DatabaseService({});

  beforeAll(async () => {
    // spyFindOne.mockResolvedValue(userCredentials);
    DatabaseService.setupEntity("User");
    user = await User.create(DatabaseService, userCredentials);
    DatabaseService.setupEntity("Institution");
    institution = await Institution.create(DatabaseService, institutionData);
    // jest.clearAllMocks() / ? for clear all mocks
  });

  describe("Create a new certification", () => {
    test("Use case add new certification", async () => {
      // spyFindOne.mockResolvedValue(institution);
      const certificationData = {
        title: "ANGULAR.JS: MANEJO PROFESIONAL DEL ESTADO",
        emitedBy: institution.businessName,
        emitedDate: new Date().getTime(),
        image: "https://image_angular.url.com",
        url: "https://url_angular.com",
        user,
      };
      // console.log({ fakeCollection });
      // console.log({DatabaseService})
      certification = await addNewCertification(certificationData);
      expect(certification.institutionUUID).toEqual(institution.uuid);
      expect(certification.createdAt).toBeGreaterThan(0);
      expect(certification.updatedAt).toBeGreaterThan(0);
    });
  });

  afterAll(async () => {
    DatabaseService.setupEntity("User");
    await user.remove(DatabaseService);
    DatabaseService.setupEntity("Institution");
    await institution.remove(DatabaseService);
    DatabaseService.setupEntity("Certification");
    await certification.remove(DatabaseService);
  });
});
