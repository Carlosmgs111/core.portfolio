import "../../../../testing/mocks/DatabaseService.stub";
import { RepositoryService } from "../../../../config/dependencies";
import { User } from "../../../users/domain/entity";
import { Certification } from "../../domain/entity";
import { Institution } from "../../../institutions/domain/entity";
import { addNewCertification } from ".";
import bcrypt from "bcrypt";

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

  // const DBS = new RepositoryService({});

  beforeAll(async () => {
    // spyFindOne.mockResolvedValue(userCredentials);
    user = await User.create(RepositoryService, userCredentials, bcrypt);
    console.log("USER", user);
    institution = await Institution.create(RepositoryService, {
      ...institutionData,
      user,
    });
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
      // ({ fakeCollection });
      // ({RepositoryService})
      certification = await addNewCertification(
        RepositoryService,
        certificationData
      );
      ({ certification });
      // expect(certification.Institution).toEqual(institution.uuid);
      expect(certification.createdAt).toBeGreaterThan(0);
      expect(certification.updatedAt).toBeGreaterThan(0);
    });
  });

  afterAll(async () => {
    await user.remove(RepositoryService);
    await institution.remove(RepositoryService);
    await certification.remove(RepositoryService);
  });
});
