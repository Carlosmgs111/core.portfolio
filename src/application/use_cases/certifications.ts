import { DatabaseService } from "../services/DatabaseServices";
import { Certification } from "../../domain/entities/Certification";
import { Institution } from "../../domain/entities/Institution";
import { User } from "../../domain/entities/User";

const DBS = new DatabaseService({})

export const addNewCertification = async (data: any) => {
  let { emitedBy, certificatedTo }: any = data;
  console.log({ emitedBy, certificatedTo });
  
  DBS.setup("Institution" )
  emitedBy = (
    await Institution.find(
      DBS,
      {
        businessName: emitedBy,
      }
    )
  ).uuid;
  DBS.setup("User" )
  /* certificatedTo = (
    await User.find(DBS, {
      username: data.user.username,
    })
  ).uuid; */
  DBS.setup("Certification")
  return await Certification.create(
    DBS,
    {
      ...data,
      emitedBy,
      certificatedTo:data.user.uuid,
    }
  );
};

export const getCertifications = async (data: any) => {
  return await Certification.findAll(
    DBS.setup("Certification" ),
    data
  );
};
