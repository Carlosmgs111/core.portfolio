import { DatabaseService } from "../../config/dependencies";
import { Certification } from "../../domain/entities/Certification";
import { Institution } from "../../domain/entities/Institution";
import { User_Certification } from "../../domain/entities/User_Certification";

export const addNewCertification = async (data: any) => {
  let { emitedBy, certificatedTo }: any = data;
  console.log({ emitedBy, certificatedTo });
  const institutionUUID = (
    await Institution.find(DatabaseService, {
      businessName: emitedBy,
    })
  ).uuid;
  console.log({institutionUUID})
  const certification = await Certification.create(DatabaseService, {
    ...data,
    institutionUUID,
  });
  console.log({User_Certification})
  const userCertification = await User_Certification.create(DatabaseService, {
    userUUID: data.user.uuid,
    certificationUUID: certification.uuid,
  });
  console.log({ userCertification });
  return certification;
};

export const getCertifications = async (data: any) => {
  return await Certification.findAll(DatabaseService, data);
};
