import "../../../mocks/DatabaseService.stub";
import { DatabaseService } from "../../../../application/services/DatabaseServices";
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

  const DBS = new DatabaseService({});

  beforeAll(async () => {
    /* 
    spyFindOne.mockResolvedValue(userCredentials); */ 
    DBS.setup("User")
    user = await User.create(DBS, userCredentials);
    console.log({user})
    DBS.setup("Institution")
    institution = await Institution.create(DBS, institutionData);
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
      // console.log({ fakeCollection });
      console.log({DBS})
      certification = await addNewCertification(certificationData);
      expect(certification.emitedBy).toEqual(institution.uuid);
      expect(certification.certificatedTo).toEqual(user.uuid);
      expect(certification.createdAt).toBeGreaterThan(0);
      expect(certification.updatedAt).toBeGreaterThan(0);
    });
  });

  afterAll(async () => {
    DBS.setup("User")
    await user.remove(DBS);
    DBS.setup("Institution")
    await institution.remove(DBS);
    DBS.setup("Certification")
    await certification.remove(DBS);
  });
});
