import { Institution } from "../../domain/entities/Institution";
import {DatabaseService} from "../../config/dependencies"

export const addNewInstitution = async (data: any) => {

DatabaseService.setupModel("Institution")
  return await Institution.create(DatabaseService, data);
};
/* 
export const getCertificates = async (data:any) => {
  return await Institution.findAll(DBService, data);
} */