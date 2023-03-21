import { Note } from "./entity";
import { User } from "../users/entity";
import { RepositoryService } from "../../config/dependencies";

export const getMyNotes = async (data: any) => {
  const { user } = data;
  ({ user });
  const myNotes = (
    await User.find(RepositoryService, {
      credentials: { uuid: user.uuid },
      related: [["Note"]],
    })
  ).Notes;
  return myNotes;
};

export const createNewNote = async (data: any) => {
  const { user, ...attrs } = data;
  const note = await Note.createOne(RepositoryService, {
    ...attrs,
    userUUID: user.uuid,
  });
  return note;
};
