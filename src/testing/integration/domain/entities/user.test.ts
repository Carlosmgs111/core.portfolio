import "../../../mocks/DatabaseService.stub";
import { User } from "../../../../domain/entities/User";
import { DatabaseService } from "../../../../application/services/DatabaseServices";


describe("Life cycle of user", () => {
  const userCredentials = {
    username: "test123",
    email: "test@email.com",
    password: "p@55w0rd",
  };
  var user: User;

  test("Create a new user with static method `new`", async () => {
    const DBS = new DatabaseService({ __identifier: "User" });
    user = await User.create(DBS, {
      ...userCredentials,
    });
    expect(user.password).not.toBe(userCredentials.password);
  });

  describe("User behaviors", () => {
    test("Compare a given password", async () => {
      const isMatch = await user.comparePassword(userCredentials.password);
      expect(isMatch).toBe(true);
    });
  });

  afterAll(async () => {
    const DBS = new DatabaseService({ __identifier: "User" });
    const user = await User.load(DBS, {
      email: "test@email.com",
      password: "p@55w0rd",
    });
    await user.remove(DBS);
    const loadedUser = await User.find(DBS, {
      email: "test@email.com",
    });
    expect(loadedUser).toBe(null);
  });
});
