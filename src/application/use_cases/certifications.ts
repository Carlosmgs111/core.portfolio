import { DatabaseService } from "../../config/dependencies";
import { Certification } from "../../domain/entities/Certification";
import { Institution } from "../../domain/entities/Institution";
import { User_Certification } from "../../domain/entities/User_Certification";
import boom from "@hapi/boom";
import { filterAttrs } from "../../utils";
import { verifyToken2 } from "../../infrastructure/auth/JWT";

const formatCertifications = async (certifications: Object[]) => {
  return certifications
    .map((c: any) =>
      filterAttrs(
        {
          ...c.dataValues,
          emitedAt: new Date(c.dataValues.emitedAt).getTime(),
          grantedTo: c.Users[0].username,
          emitedBy: c.Institution.name,
        },
        ["Users", "Institution"]
      )
    )
    .sort((a: any, b: any) => {
      if (a.emitedAt < b.emitedAt) return 1;
      return -1;
    });
};

export const getCertifications = async (data: any) => {
  const { username, user, size: limit, page: offset } = data;
  return await formatCertifications(
    (
      await Certification.findAll(
        DatabaseService.setInclude([
          [
            "User",
            {
              attributes: ["username"],
              where: username && { username },
            },
          ],
          ["Institution", { attributes: ["name"], alias: "Institution" }],
        ]).setOptions({
          limit,
          offset,
        }),
        {}
      )
    ).map((c: any) => ({ ...c, grantedTo: c.Users[0].username }))
  );
};

export const getOwnCertifications = async (data: any) => {
  const { user } = await verifyToken2(data);
  //  console.log({user})
  return await user.certifications(DatabaseService, {});
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
  console.log({ certification });
  await User_Certification.create(DatabaseService, {
    userUUID: data.user.uuid,
    certificationUUID: certification.uuid,
  });
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
