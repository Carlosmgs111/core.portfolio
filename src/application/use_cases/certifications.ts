import { DatabaseService } from "../services/DatabaseServices";
import { Certification } from "../../domain/entities/Certification";
import { Institution } from "../../domain/entities/Institution";
import { User } from "../../domain/entities/User";

export const addNewCertification = async (data: any) => {
  let { emitedBy, certificatedTo }: any = data;
  console.log({ emitedBy, certificatedTo });
  emitedBy = (
    await Institution.find(
      new DatabaseService({ __identifier: "Institution" }),
      {
        businessName: emitedBy,
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
