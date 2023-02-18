import { v4 as uuidv4 } from "uuid";
import { getEntityProperties, filterAttrs } from "../../utils";

export class Note {
  uuid: string = "";
  title: string = "";
  body: string = ""; // * timestamp
  tags: string[];
  createdAt: number = 0;
  updatedAt: number = 0;

  constructor({ uuid, title, body, tags }: any) {
    this.uuid = uuid;
    this.title = title;
    this.body = body;
    this.tags = tags;
    this.createdAt = new Date().getTime();
    this.updatedAt = this.createdAt;
  }
  static createOne = async (
    RepositoryService: any,
    data: any
  ): Promise<Note> => {
    const uuid = data.uuid || uuidv4();
    const { userUUID, ...attrs } = data;
    const note = await RepositoryService.createOne(
      RepositoryService.entities.Note,
      new Note({ ...attrs, uuid })
    );

    await RepositoryService.setOneRelationship2One(
      { notes: { uuid: note.uuid } },
      [
        {
          user: { uuid: userUUID },
        },
      ]
    );
    return note;
  };

  static createMany = async (RepositoryService: any, data: any) => {
    // console.log({ data });
    const notesCreated = await RepositoryService.createMany(
      RepositoryService.entities.Note,
      data.map((c: any) => new Note({ ...c, uuid: c.uuid || uuidv4() }))
    );

    for (let note in notesCreated) {
      await RepositoryService.setOneRelationship2One(
        { notes: { uuid: notesCreated[note].uuid } },
        [
          {
            user: { uuid: data[note].userUUID },
          },
        ]
      );
    }
    return notesCreated;
  };

  static load = async (RepositoryService: any, options: any) => {
    const note = await Note.find(RepositoryService, options);
    if (!note) throw new Error("Incorrect credentials!");
    const loadedNote = new Note(note);
    console.log({ loadedNote });
    return loadedNote;
  };

  static find = async (RepositoryService: any, options: any) => {
    const note: any = await RepositoryService.findOne(
      RepositoryService.entities.Note,
      options
    );
    return note;
  };

  static findAll = async (RepositoryService: any, options: any = {}) => {
    console.log({options})
    const notes: any = await RepositoryService.findAll(
      RepositoryService.entities.Note,
      options
    );
    return notes;
  };

  update = async (RepositoryService: any, data: any) => {
    this.updatedAt = new Date().getTime();

    await RepositoryService.updateOne(
      RepositoryService.entities.Note,
      {
        updatedAt: this.updatedAt,
        ...filterAttrs(data, ["uuid", "user", "token"]),
      },
      { credentials: { uuid: this.uuid } }
    );

    return this;
  };

  remove = async (RepositoryService: any, options: any = {}) => {
    await RepositoryService.unsetOneRelationship2One(
      { certifications: { uuid: this.uuid } },
      [["Institution", { as: "Institution" }]]
    );
    const removed = await RepositoryService.removeOneRelationshipN2N([
      [{ user: { uuid: options.userUUID } }, { note: { uuid: this.uuid } }],
    ]);

    if (!removed) return;
    return await RepositoryService.removeOne(RepositoryService.entities.Note, {
      credentials: filterAttrs(
        getEntityProperties(this),
        ["title", "uuid"],
        false
      ),
    });
  };
}
