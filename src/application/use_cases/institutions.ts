import { Institution } from "../../domain/entities/Institution";
import { DatabaseService } from "../../config/dependencies";
import { User_Institution } from "../../domain/entities/User_Institution";

export const addNewInstitution = async (data: any) => {
  const institution = await Institution.create(DatabaseService, data);
  await User_Institution.create(DatabaseService, {
    institutionUUID: institution.uuid,
    userUUID: data.user.uuid,
  });
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

export const deleteInstitution = async (data: any) => {
  return await (
    await Institution.load(DatabaseService, { uuid: data.uuid })
  ).remove(DatabaseService);
};
