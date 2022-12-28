import { Institution } from "../../domain/entities/Institution";
import { DatabaseService } from "../../config/dependencies";
import { verifyToken2 } from "../../infrastructure/auth/JWT";
import boom from "@hapi/boom";

export const addNewInstitution = async (data: any) => {
  if (!data.user) throw boom.conflict("A user must be instanced!");
  const institution = await Institution.create(DatabaseService, data);
  return institution;
};

export const getAllInstitutions = async (data: any) => {
  return await Institution.findAll(DatabaseService, data);
};

export const updateInstitution = async (data: any) => {
  return await (
    await Institution.load(DatabaseService, { uuid: data.uuid })
  ).update(DatabaseService, data);
};

export const linkToIntitution = async (data: any) => {
  const { institutionUUID, token } = data;
  const { user } = await verifyToken2(token);
  DatabaseService.relate(
    { label: "user", uuid: user.uuid },
    { label: "institution", uuid: institutionUUID }
  );
};

export const unlinkFromInstitution = async (data: any) => {};

export const deleteInstitution = async (data: any) => {
  await (
    await Institution.load(DatabaseService, { uuid: data.uuid })
  ).remove(DatabaseService, { userUUID: data.user.uuid });

  return { message: "Intitution deleted", uuid: data.uuid };
};
