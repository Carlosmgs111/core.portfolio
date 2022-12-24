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
    DatabaseService.setupModel("User");
    user = await User.create(DatabaseService, userCredentials);
    console.log({ user });
    expect(user.password).not.toBe(userCredentials.password);
  });

  describe("User behaviors", () => {
    test("Compare a given password", async () => {
      const isMatch = await user.comparePassword(userCredentials.password);
      expect(isMatch).toBe(true);
    });
  });

  afterAll(async () => {
    DatabaseService.setupModel("User");
    console.log({ fakeDatabaseUser: fakeDatabase.User });
    const user = await User.load(DatabaseService, {
      credentials: {
        email: "test@email.com",
        password: "p@55w0rd",
      },
    });
    await user.remove(DatabaseService);
    const loadedUser = await User.find(DatabaseService, {
      credentiasl: { email: "test@email.com" },
    });
    expect(loadedUser).toBe(null);
  });
});
