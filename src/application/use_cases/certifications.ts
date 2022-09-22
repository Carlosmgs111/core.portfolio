import { DatabaseService } from "../../config/dependencies";
import { Certification } from "../../domain/entities/Certification";
import { Institution } from "../../domain/entities/Institution";
import { User_Certification } from "../../domain/entities/User_Certification";

export const getCertifications = async (data: any) => {
  return await Certification.findAll(DatabaseService, data);
};

export const addNewCertification = async (data: any) => {
  const institutionUUID = (
    await Institution.find(DatabaseService, {
      businessName: data.emitedBy,
    })
  ).uuid;
  const certification = await Certification.create(DatabaseService, {
    ...data,
    institutionUUID,
  });
  await User_Certification.create(DatabaseService, {
    userUUID: data.user.uuid,
    certificationUUID: certification.uuid,
  });
  return certification;
};

export const updateCertification = async (data:any)=>{
  return await(await Certification.load(DatabaseService,{uuid:data.uuid})).update(DatabaseService, data)
}

export const removeCertification = async (data: any) => {
  await (
    await User_Certification.load(DatabaseService, {
      certificationUUID: data.uuid,
    })
  ).remove(DatabaseService);
  return await (
    await Certification.load(DatabaseService, { uuid: data.uuid })
  ).remove(DatabaseService);
};
