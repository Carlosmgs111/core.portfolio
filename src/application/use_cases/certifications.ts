import { DatabaseService } from "../../config/dependencies";
import { Certification } from "../../domain/entities/Certification";
import { Institution } from "../../domain/entities/Institution";
import { User_Certification } from "../../domain/entities/User_Certification";
import boom from "@hapi/boom";

export const getCertifications = async (data: any) => {
  const institutions = (await Institution.findAll(DatabaseService, {})).map(
    (institution: any) => institution.dataValues
  );
  return [
    ...(await Certification.findAll(DatabaseService, data)).map((certification: any) => ({
      ...certification.dataValues, emitedAt: new Date(certification.dataValues.emitedAt).getTime(), emitedBy: institutions.find((i: any) => i.uuid === certification.institutionUUID).name,
    })).sort((a: any, b: any) => { if (a.emitedAt < b.emitedAt) return 1; return -1 }),
  ];
};

export const getCertificationByUUID = async (data: any) => {
  return await Certification.find(DatabaseService, data);
};

export const addNewCertification = async (data: any) => {
  if (!data.user) throw boom.conflict("A user must be instanced!");
  const institutionUUID = (
    await Institution.find(DatabaseService, {
      name: data.emitedBy,
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

export const addManyCertifications = async (data: any) => {
  const { certifications } = data;
  const newCertifications = []
  for (var certification of certifications) {
    newCertifications.push(await addNewCertification({ ...certification, user: data.user }));
  }
  return newCertifications;
};

export const updateCertification = async (data: any) => {
  await (
    await Certification.load(DatabaseService, { uuid: data.uuid })
  ).update(DatabaseService, data);
  return await getCertificationByUUID({ uuid: data.uuid });
};

export const removeCertification = async (data: any) => {
  console.log({ data });
  await (
    await User_Certification.load(DatabaseService, {
      certificationUUID: data.uuid,
    })
  ).remove(DatabaseService);
  await (
    await Certification.load(DatabaseService, { uuid: data.uuid })
  ).remove(DatabaseService);
  return { message: "Certification deleted", uuid: data.uuid };
};
