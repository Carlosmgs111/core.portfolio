import { spyFindOne, spyCreate, fakeDatabase } from "../../mocks/DatabaseService.stub";
import { User } from "../../../domain/entities/User";
import { DatabaseService } from "../../../config/dependencies";
import { generateOneUser } from "../../fakers/user.fake";

describe("User entity behavior", () => {
  let fakeUser: any;
  beforeEach(async () => {
    fakeUser = generateOneUser();
    console.log({ fakeUser });
  });
  describe("User entity life cycle", () => {
    test("Creation of new entity", async () => {
      DatabaseService.setupModel("User")
      const newUser = await User.create(
        DatabaseService,
        fakeUser
      );
      console.log({ newUser });
      console.log({ fakeDatabase });
      expect(fakeUser.password).not.toEqual(newUser.password);
      expect(spyFindOne).toHaveBeenCalled();
      expect(spyCreate).toHaveBeenCalled();
      // expect(spyCreate).toHaveBeenCalledWith(fakeUser)
    });
  });
});
