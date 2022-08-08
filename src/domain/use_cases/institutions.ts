import { DatabaseService } from "../services/DatabaseServices.ts";
import { Institution } from "../entities/Institution";

const DBService = new DatabaseService({ __identifier: "Institution" });

export const addNewInstitution = async (data: any) => {
  return await Institution.create(DBService, data);
};
/* 
export const getCertificates = async (data:any) => {
  return await Institution.findAll(DBService, data);
} */