type UserProps = {
  uuid: string;
  username: string;
  email: string;
  password: string;
  privilege: string;
  avatar: string;
};

export class User {
  uuid: string;
  username: string;
  email: string;
  password: string;
  privilege: string;
  avatar: string;
  createdAt: number = 0;
  updatedAt: number = 0;

  constructor({
    uuid,
    username,
    email,
    password,
    privilege,
    avatar,
  }: UserProps) {
    this.uuid = uuid;
    this.username = username;
    this.email = !email ? `${uuid}@${username}.email` : email;
    this.password = password;
    this.privilege = privilege;
    this.avatar = avatar;
    this.createdAt = new Date().getTime();
    this.updatedAt = this.createdAt;
  }
  remove = async (RepositoryService: any) => {
    return await RepositoryService.removeOne(RepositoryService.User, {
      indexation: { uuid: this.uuid },
    });
  };
  update = async (RepositoryService: any, data: any) => {
    this.updatedAt = new Date().getTime();
    const result = await RepositoryService.updateOne(
      RepositoryService.entities.User,
      data,
      { indexation: { uuid: this.uuid } }
    );
    return result;
  };
  changePassword = async (
    RepositoryService: any,
    { newPassword, oldPassword }: any,
    bcrypt: any
  ) => {
    if (await this.comparePassword(oldPassword, bcrypt)) {
      await this.hashPassword(newPassword, bcrypt);
      await this.update(RepositoryService, {});
      return true;
    }
    return false;
  };
  hashPassword = async (password: string | undefined, bcrypt: any) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password || this.password, salt);
    this.password = hash;
    return hash;
  };
  comparePassword = async (password: string, bcrypt: any): Promise<Boolean> => {
    return await bcrypt.compare(password, this.password);
  };
  static create = async (
    RepositoryService: any,
    data: any,
    bcrypt: any
  ): Promise<any> => {
    const account = new User({
      ...data,
      privilege: "admin",
    });
    await account.hashPassword(account.password, bcrypt);
    const result = await RepositoryService.createOne(
      RepositoryService.entities.User,
      account
    );
    return result;
  };
  static load = async (RepositoryService: any, options: any = {}) => {
    const user = await User.find(RepositoryService, options);
    const account = new User(user);
    return account;
  };
  static authLoad = async (
    RepositoryService: any,
    { indexation }: any = {},
    bcrypt: any
  ) => {
    const { password, ...rest } = indexation;
    console.log({ password, ...rest });
    const user = await User.find(RepositoryService, { indexation: rest });
    console.log({user});
    if (!(await User.comparePassword(password, user.password, bcrypt)))
      throw new Error("Password doesn't match!");
    const account = new User(user);
    return account;
  };
  static find = async (RepositoryService: any, options: any = {}) => {
    const { indexation } = options;
    console.log({ indexation });
    const account: any = await RepositoryService.findOne(
      RepositoryService.entities.User,
      {
        indexation,
      }
    );
    return account;
  };
  static findAll = async (DatabaseService: any, options: any = {}) =>
    await DatabaseService.findAll(DatabaseService.entities.User, options);
  static certifications = async (
    RepositoryService: any,
    { indexation }: any
  ) => {
    const user: any = await User.find(RepositoryService, {
      indexation,
      related: [["Certification"]],
    });
    return user.Certifications;
  };
  static projects = async (RepositoryService: any, { indexation }: any) => {
    const user = await User.find(RepositoryService, {
      indexation,
      related: [["Project"]],
    });
    return user.Projects;
  };
  static comparePassword = async (
    loaded: string,
    provided: string,
    bcrypt: any
  ) => await bcrypt.compare(loaded, provided);
}
