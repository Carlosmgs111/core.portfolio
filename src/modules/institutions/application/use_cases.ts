import { Institution } from "../domain/entity";

export const addNewInstitution = async (RepositoryService: any, data: any) => {
  const institution = await Institution.create(RepositoryService, data);
  return institution;
};

export const getAllInstitutions = async (RepositoryService: any, data: any) => {
  return await Institution.findAll(RepositoryService, data);
};

export const updateInstitution = async (RepositoryService: any, data: any) => {
  return await (
    await Institution.load(RepositoryService, { uuid: data.uuid })
  ).update(RepositoryService, data);
};

export const linkToIntitution = async (
  RepositoryService: any,
  data: any
) => {
  const { institutionUUID, token, user } = data;
  RepositoryService.setOneRelationshipManyToMany([
    { label: "user", uuid: user.uuid },
    { label: "institution", uuid: institutionUUID },
  ]);
};

export const unlinkFromInstitution = async (
  RepositoryService: any,
  data: any
) => {};

export const deleteInstitution = async (RepositoryService: any, data: any) => {
  await (
    await Institution.load(RepositoryService, { uuid: data.uuid })
  ).remove(RepositoryService, { userUUID: data.user.uuid });

  return { message: "Intitution deleted", uuid: data.uuid };
};
