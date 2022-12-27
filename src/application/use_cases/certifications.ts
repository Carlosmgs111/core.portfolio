import { DatabaseService } from "../../config/dependencies";
import { Certification } from "../../domain/entities/Certification";
import { Institution } from "../../domain/entities/Institution";
import { User_Certification } from "../../domain/entities/User_Certification";
import { User } from "../../domain/entities/User";
import boom from "@hapi/boom";
import { filterAttrs } from "../../utils";
import { verifyToken2 } from "../../infrastructure/auth/JWT";

const sequelizeFormatCertifications = (certifications: [Certification]) =>
  certifications
    .map((certification: any) =>
      filterAttrs(
        {
          ...certification.dataValues,
          emitedAt: new Date(certification.dataValues.emitedAt).getTime(),
          grantedTo: certification.Users[0].username,
          emitedBy: certification.Institution.name,
        },
        ["Users", "Institution"]
      )
    )
    .sort((a: any, b: any) => {
      if (a.emitedAt < b.emitedAt) return 1;
      return -1;
    });

const mongooseFormatCertifications = (certifications: [Certification]) =>
  certifications.map((certification: any) => ({
    ...certification._doc,
    grantedTo: "cmgs111",
  }));

const formats = {
  se: sequelizeFormatCertifications,
  mo: mongooseFormatCertifications,
};

export const getCertifications = async (data: any) => {
  const { username, user, size, page } = data;
  return formats.se(
    await Certification.findAll(DatabaseService, {
      related: DatabaseService.getRelated([
        [
          "User",
          {
            attributes: ["username"],
            credentials: username && { username },
          },
        ],
        ["Institution", { attributes: ["name"], as: "Institution" }],
      ]),
      size,
      page,
    })
  );
};

export const getOwnCertifications = async (data: any) => {
  const { token } = data;
  const { user } = await verifyToken2(token);
  console.log({ getOwnCertifications: user });
  return await User.certifications(DatabaseService, {
    username: user.username,
  });
};

export const getCertificationByUUID = async (data: any) => {
  return await Certification.find(DatabaseService, data);
};

export const addNewCertification = async (data: any) => {
  console.log({ dataUser: data.user, data });
  if (!data.user) throw boom.conflict("A user must be instanced!");
  const institutionUUID = (
    await Institution.find(DatabaseService, {
      name: data.emitedBy,
    })
  ).uuid;
  console.log({ institutionUUID });
  const certification = await Certification.create(DatabaseService, {
    ...data,
    institutionUUID,
  });
  console.log({ certification });

  return {
    ...certification,
    emitedBy: data.emitedBy,
    grantedTo: data.user.username,
  };
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
  return {
    ...(await getCertificationByUUID({ uuid })).dataValues,
    emitedBy: data.emitedBy,
    grantedTo: data.user.username,
  };
};

export const removeCertification = async (data: any) => {
  await (
    await Certification.load(DatabaseService, { uuid: data.uuid })
  ).remove(DatabaseService, { userUUID: data.user.uuid });
  return { message: "Certification deleted", uuid: data.uuid };
};
