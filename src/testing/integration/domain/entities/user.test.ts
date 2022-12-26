import { fakeDatabase } from "../../../mocks/DatabaseService.stub";
import { User } from "../../../../domain/entities/User";
import { DatabaseService } from "../../../../config/dependencies";

// console.log({ DatabaseService });

describe("Life cycle of user", () => {
  const userCredentials = {
    username: "test123",
    email: "test@email.com",
    password: "p@55w0rd",
  };
  var user: User;
  // const DatabaseService = new DatabaseService({});

  test("Create a new user with static method `new`", async () => {
    DatabaseService.setupEntity("User");
    user = await User.create(DatabaseService, userCredentials);
    expect(user.password).not.toBe(userCredentials.password);
  });

  describe("User behaviors", () => {
    test("Compare a given password", async () => {
      const isMatch = await user.comparePassword(userCredentials.password);
      expect(isMatch).toBe(true);
    });
  });

  afterAll(async () => {
    DatabaseService.setupEntity("User");
    const user = await User.load(DatabaseService, {
      credentials: {
        email: "test@email.com",
        password: "p@55w0rd",
      },
    });
    await user.remove(DatabaseService);
    let loadedUser;
    try {
      loadedUser = await User.find(DatabaseService, {
        credentials: { email: "test@email.com" },
      });
    } catch (e: any) {}
    expect(loadedUser).toBe(undefined);
  });
});
