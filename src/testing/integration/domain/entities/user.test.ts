import { fakeDatabase } from "../../../mocks/DatabaseService.stub";
import { User } from "../../../../domain/entities/User";
import { RepositoryService } from "../../../../config/dependencies";

// console.log({ RepositoryService });

describe("Life cycle of user", () => {
  const userCredentials = {
    username: "test123",
    email: "test@email.com",
    password: "p@55w0rd",
  };
  var user: User;
  // const RepositoryService = new RepositoryService({});

  test("Create a new user with static method `new`", async () => {
    user = await User.create(RepositoryService, userCredentials);
    expect(user.password).not.toBe(userCredentials.password);
  });

  describe("User behaviors", () => {
    test("Compare a given password", async () => {
      const isMatch = await user.comparePassword(userCredentials.password);
      expect(isMatch).toBe(true);
    });
  });

  afterAll(async () => {
    const user = await User.authLoad(RepositoryService, {
      credentials: {
        email: "test@email.com",
        password: "p@55w0rd",
      },
    });
    await user.remove(RepositoryService);
    let loadedUser;
    try {
      loadedUser = await User.find(RepositoryService, {
        credentials: { email: "test@email.com" },
      });
    } catch (e: any) {}
    expect(loadedUser).toBe(undefined);
  });
});
