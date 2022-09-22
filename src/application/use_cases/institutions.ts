import { Institution } from "../../domain/entities/Institution";
import { DatabaseService } from "../../config/dependencies";

export const addNewInstitution = async (data: any) => {
  return await Institution.create(DatabaseService, data);
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
