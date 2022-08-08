import { DatabaseService } from "../services/DatabaseServices.ts";
import { Certification } from "../entities/Certification";
import { Institution } from "../entities/Institution";
import { User } from "../entities/User";

export const addNewCertification = async (data: any) => {
  let { emitedBy, certificatedTo }: any = data;
  console.log({ emitedBy, certificatedTo });
  emitedBy = (
    await Institution.find(
      new DatabaseService({ __identifier: "Institution" }),
      {
        name: emitedBy,
      }
    )
  ).uuid;
  certificatedTo = (
    await User.find(new DatabaseService({ __identifier: "User" }), {
      username: certificatedTo,
    })
  ).uuid;
  return await Certification.create(
    new DatabaseService({ __identifier: "Certification" }),
    {
      ...data,
      emitedBy,
      certificatedTo,
    }
  );
};

export const getCertifications = async (data: any) => {
  return await Certification.findAll(
    new DatabaseService({ __identifier: "Certification" }),
    data
  );
};
