import { Institution } from "../domain/Institution";
import { RepositoryService } from "../../config/dependencies";
import { verifyToken2 } from "../../infrastructure/auth/JWT";
import boom from "@hapi/boom";

export const addNewInstitution = async (data: any) => {
  if (!data.user) throw boom.conflict("A user must be instanced!");
  const institution = await Institution.create(RepositoryService, data);
  return institution;
};

export const getAllInstitutions = async (data: any) => {
  return await Institution.findAll(RepositoryService, data);
};

export const updateInstitution = async (data: any) => {
  return await (
    await Institution.load(RepositoryService, { uuid: data.uuid })
  ).update(RepositoryService, data);
};

export const linkToIntitution = async (data: any) => {
  const { institutionUUID, token } = data;
  const { user } = await verifyToken2(token);
  RepositoryService.createOneRelationshipN2N([
    { label: "user", uuid: user.uuid },
    { label: "institution", uuid: institutionUUID },
  ]);
};

export const unlinkFromInstitution = async (data: any) => {};

export const deleteInstitution = async (data: any) => {
  await (
    await Institution.load(RepositoryService, { uuid: data.uuid })
  ).remove(RepositoryService, { userUUID: data.user.uuid });

  return { message: "Intitution deleted", uuid: data.uuid };
};
