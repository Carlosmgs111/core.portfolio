type ProjectProps = {
  uuid: string;
  name: string;
  descriptions: string[];
  images: string[];
  tags: string[];
  stack: [string];
  state: string;
  kind: [string];
  uri: string;
  version: string;
};

export class Project {
  uuid: string;
  name: string;
  descriptions: string[];
  images: string[];
  tags: string[];
  stack: [string];
  state: string;
  kind: [string];
  uri: string;
  version: string;
  createdAt: number = 0;
  updatedAt: number = 0;

  constructor({
    uuid,
    name,
    descriptions,
    images,
    tags,
    stack,
    state,
    kind,
    uri,
    version,
  }: ProjectProps) {
    this.uuid = uuid;
    this.name = name;
    this.descriptions = descriptions;
    this.images = images;
    this.tags = tags;
    this.stack = stack;
    this.state = state;
    this.kind = kind;
    this.uri = uri;
    this.version = version;
    this.createdAt = new Date().getTime();
    this.updatedAt = new Date().getTime();
  }
  static new = async (RepositoryService: any, data: any): Promise<string> => {
    const newProject = new Project(data);
    const response = await RepositoryService.createOne(
      RepositoryService.entities.Project,
      newProject
    );
    await RepositoryService.setOneRelationship2One(
      { project: { uuid: data.uuid } },
      [{ user: { uuid: data.user.uuid } }]
    );
    return response;
  };

  static createMany = async (RepositoryService: any, data: any) => {
    const newProjects = data.map(
      (projectData: any) => new Project(projectData)
    );
    const projectsCreated = await RepositoryService.createMany(
      RepositoryService.entities.Project,
      newProjects
    );
    console.log({ newProjects });
    for (let newProject of newProjects) {
      await RepositoryService.setOneRelationshipManyToMany([
        {
          project: {
            uuid: newProject.uuid,
          },
        },
        { user: { uuid: data[0].user.uuid } },
      ]);
    }
    return projectsCreated.map((p: any, i: any) => ({
      ...p,
      Users: [{ username: data[i].user.username }],
    }));
  };

  static load = async (RepositoryService: any, options: any) => {
    const loadedProject = await Project.find(RepositoryService, options);
    if (!loadedProject) throw new Error("Incorrect indexation!");
    const project = new Project(loadedProject);
    return project;
  };

  static find = async (RepositoryService: any, options: any) => {
    const account: any = await RepositoryService.findOne(
      RepositoryService.entities.Project,
      options
    );
    return account;
  };

  static findAll = async (RepositoryService: any, options: any = {}) => {
    const projects: any = await RepositoryService.findAll(
      RepositoryService.entities.Project,
      options
    );
    return projects;
  };

  remove = async (RepositoryService: any, options: any = {}) => {
    const { uuid } = this;
    const removed = await RepositoryService.unsetOneRelationshipManyToMany([
      { user: { uuid: options.userUUID } },
      { project: { uuid: this.uuid } },
    ]);

    if (!removed) return;
    return await RepositoryService.removeOne(
      RepositoryService.entities.Project,
      {
        indexation: { uuid },
      }
    );
  };

  update = async (RepositoryService: any, data: any) => {
    this.updatedAt = new Date().getTime();
    console.log({ data });
    return await RepositoryService.updateOne(
      RepositoryService.entities.Project,
      {
        updatedAt: this.updatedAt,
        ...data,
      },
      { indexation: { uuid: this.uuid } }
    );
  };
}
