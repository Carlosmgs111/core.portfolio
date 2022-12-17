import { DatabaseService } from "../../config/dependencies";
import { Certification } from "../../domain/entities/Certification";
import { Institution } from "../../domain/entities/Institution";
import { User } from "../../domain/entities/User";
import { User_Certification } from "../../domain/entities/User_Certification";
import boom from "@hapi/boom";

export const getCertifications = async (data: any) => {
  const { username, user } = data;
  const certifications = username
    ? await User.certifications(DatabaseService, {
        username,
      })
    : await Certification.findAll(DatabaseService, data);
  const institutions = (await Institution.findAll(DatabaseService, {})).map(
    (institution: any) => institution.dataValues
  );

  return certifications
    .map((certification: any) => ({
      ...certification.dataValues,
      emitedAt: new Date(certification.dataValues.emitedAt).getTime(),
      emitedBy: institutions.find(
        (i: any) => i.uuid === certification.institutionUUID
      ).name,
      grantedTo: user?.username,
    }))
    .sort((a: any, b: any) => {
      if (a.emitedAt < b.emitedAt) return 1;
      return -1;
    });
};

export const getCertificationsByUsername = async (data: any) => {
  const { username } = data;
  const user = await User.find(DatabaseService, { username });
  if (!user && username) throw boom.conflict("Username don't register!");
  console.log({ user });
  return user;
};

export const getOwnCertifications = async (data: any) => {};

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
  const newCertifications = [];
  for (var certification of certifications) {
    newCertifications.push(
      await addNewCertification({ ...certification, user: data.user })
    );
  }
  return newCertifications;
};

export const updateCertification = async (data: any) => {
  const { user, uuid } = data;
  const user_certification = await User_Certification.find(DatabaseService, {
    certificationUUID: uuid,
  });
  if (user_certification.userUUID !== user.uuid)
    throw boom.conflict("You are not the owner!");
  await (
    await Certification.load(DatabaseService, { uuid })
  ).update(DatabaseService, data);
  return await getCertificationByUUID({ uuid });
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
