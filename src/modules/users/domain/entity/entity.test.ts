import {
  spyFindOne,
  spyCreateOne,
} from "../../../testing/mocks/DatabaseService.stub";
import { User } from "../../../modules/users/entity";
import { RepositoryService } from "../../../config/dependencies";
import { generateOneUser } from "../../../testing/fakers/user.fake";

describe("User entity behavior", () => {
  let fakeUser: any;
  beforeEach(async () => {
    fakeUser = generateOneUser();
  });
  describe("User entity life cycle", () => {
    test("Creation of new entity", async () => {
      const newUser = await User.create(RepositoryService, fakeUser);
      expect(fakeUser.password).not.toEqual(newUser.password);
      expect(spyFindOne).toHaveBeenCalled();
      expect(spyCreateOne).toHaveBeenCalled();
    });
  });
});

describe("Life cycle of user", () => {
  const userCredentials = {
    username: "test123",
    email: "test@email.com",
    password: "p@55w0rd",
  };
  var user: User;

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
