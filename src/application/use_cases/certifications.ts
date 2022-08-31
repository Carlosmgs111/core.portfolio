import { DatabaseService } from "../services/DatabaseServices";
import { Certification } from "../../domain/entities/Certification";
import { Institution } from "../../domain/entities/Institution";
import { User } from "../../domain/entities/User";

const DBS = new DatabaseService({})

export const addNewCertification = async (data: any) => {
  let { emitedBy, certificatedTo }: any = data;
  console.log({ emitedBy, certificatedTo });
  emitedBy = (
    await Institution.find(
      DBS.setup("Institution" ),
      {
        businessName: emitedBy,
      }
    )
  ).uuid;
  certificatedTo = (
    await User.find(DBS.setup("User" ), {
      username: certificatedTo,
    })
  ).uuid;
  return await Certification.create(
    DBS.setup("Certification" ),
    {
      ...data,
      emitedBy,
      certificatedTo,
    }
  );
};

export const getCertifications = async (data: any) => {
  return await Certification.findAll(
    DBS.setup("Certification" ),
    data
  );
};
