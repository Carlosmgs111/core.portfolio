import {
  spyFindOne,
  spyCreateOne,
} from "../../../../testing/mocks/DatabaseService.stub";
import { User } from ".";
import { RepositoryService } from "../../../../config/dependencies";
import { generateOneUser } from "../../../../testing/fakers/user.fake";
import bcrypt from "bcrypt"

describe("User entity behavior", () => {
  let fakeUser: any;
  beforeEach(async () => {
    fakeUser = generateOneUser();
  });
  describe("User entity life cycle", () => {
    test("Creation of new entity", async () => {
      const newUser = await User.create(RepositoryService, fakeUser, bcrypt);
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
    user = await User.create(RepositoryService, userCredentials, bcrypt);
    expect(user.password).not.toBe(userCredentials.password);
  });

  describe("User behaviors", () => {
    test("Compare a given password", async () => {
      const isMatch = await user.comparePassword(userCredentials.password, bcrypt);
      expect(isMatch).toBe(true);
    });
  });

  afterAll(async () => {
    const user = await User.authLoad(RepositoryService, {
      indexation: {
        email: "test@email.com",
        password: "p@55w0rd",
      },
    }, bcrypt);
    await user.remove(RepositoryService);
    let loadedUser;
    try {
      loadedUser = await User.find(RepositoryService, {
        indexation: { email: "test@email.com" },
      });
    } catch (e: any) {}
    expect(loadedUser).toBe(undefined);
  });
});
