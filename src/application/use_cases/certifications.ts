import { DatabaseService } from "../../config/dependencies";
import { Certification } from "../../domain/entities/Certification";
import { Institution } from "../../domain/entities/Institution";
import { User } from "../../domain/entities/User";

export const addNewCertification = async (data: any) => {
  let { emitedBy, certificatedTo }: any = data;
  console.log({ emitedBy, certificatedTo });

  DatabaseService.setupModel("Institution");
  emitedBy = (
    await Institution.find(DatabaseService, {
      businessName: emitedBy,
    })
  ).uuid;
  DatabaseService.setupModel("User");
  /* certificatedTo = (
    await User.find(DatabaseService, {
      username: data.user.username,
    })
  ).uuid; */
  DatabaseService.setupModel("Certification");
  return await Certification.create(DatabaseService, {
    ...data,
    emitedBy,
    certificatedTo: data.user.uuid,
  });
};

export const getCertifications = async (data: any) => {
  return await Certification.findAll(
    DatabaseService.setupModel("Certification"),
    data
  );
};
