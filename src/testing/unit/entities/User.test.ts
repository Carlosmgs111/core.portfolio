import { spyFindOne, spyCreate, fakeCollection } from "../../mocks/DatabaseService.stub";
import { User } from "../../../domain/entities/User";
import { DatabaseService } from "../../../application/services/DatabaseServices";
import { generateOneUser } from "../../fakers/user.fake";

describe("User entity behavior", () => {
  let fakeUser: any;
  beforeEach(async () => {
    fakeUser = generateOneUser();
    console.log({ fakeUser });
  });
  describe("User entity life cycle", () => {
    test("Creation of new entity", async () => {
      const newUser = await User.create(
        new DatabaseService({ __identifier: "User" }),
        fakeUser
      );
      console.log({ newUser });
      console.log({ fakeCollection });
      expect(fakeUser.password).not.toEqual(newUser.password);
      expect(spyFindOne).toHaveBeenCalled();
      expect(spyCreate).toHaveBeenCalled();
      // expect(spyCreate).toHaveBeenCalledWith(fakeUser)
    });
  });
});
