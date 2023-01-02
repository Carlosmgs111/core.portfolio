import { DatabaseService } from "../../config/dependencies";
import { Certification } from "../../domain/entities/Certification";
import { Institution } from "../../domain/entities/Institution";
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

// ! ---------------------------------------------------------------------------------------------

export const getCertifications = async (data: any) => {
  const { username, user, size, page } = data;
  return formats.se(
    await Certification.findAll(DatabaseService, {
      related: [
        [
          "User",
          {
            attributes: ["username"],
            credentials: username && { username },
          },
        ],
        [
          "Institution",
          { attributes: ["name"], as: "Institution" },
          // { singular: true },
        ],
      ],
      size,
      page,
    })
  );
};

export const getOwnCertifications = async (data: any) => {
  const { token } = data;
  const { user } = await verifyToken2(token);
  return await User.certifications(DatabaseService, {
    username: user.username,
  });
};

export const getCertificationByUUID = async (data: any) => {
  return await Certification.find(DatabaseService, data);
};

export const addNewCertification = async (data: any) => {
  if (!data.user) throw boom.conflict("A user must be instanced!");
  const certification = await Certification.create(DatabaseService, data);
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
  await (
    await Certification.load(DatabaseService, { credentials: { uuid } })
  ).update(DatabaseService, data);
  return formats.se([
    {
      ...(await getCertificationByUUID({
        credentials: { uuid },
        related: [["Institution", { attributes: ["name"], as: "Institution" }]],
      })),
      Users: [user],
    },
  ])[0];
};

export const removeCertification = async (data: any) => {
  await (
    await Certification.load(DatabaseService, {
      credentials: { uuid: data.uuid },
    })
  ).remove(DatabaseService, { userUUID: data.user.uuid });
  return { message: "Certification deleted", uuid: data.uuid };
};
