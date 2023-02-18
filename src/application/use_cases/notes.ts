import { Note } from "../../domain/entities/Note";
import { User } from "../../users/domain/User";
import { RepositoryService } from "../../config/dependencies";

export const getMyNotes = async (data: any) => {
  const { user } = data;
  console.log({ user });
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
