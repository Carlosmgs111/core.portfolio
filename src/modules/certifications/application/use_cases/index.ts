import { Certification } from "../../domain/entity";
import { User } from "../../../users/domain/entity";
import { RepositoryService } from "../../../../config/dependencies";
import { verifyToken2 } from "../../../../services/AuthServices";
import boom from "@hapi/boom";
import { formatCertifications } from "../../DTOs";

export const getCertifications = async (data: any, RS: any) => {
  const { username, user, size, page } = data;
  return formatCertifications(
    await Certification.findAll(RS, {
      related: [
        [
          "User",
          {
            attributes: ["username"],
            // ! ⚠️ must implement a correct use of filtered finding with related entities
            // ? ⚠️ this just work fine with sequelize adapter
            // ? ⚠️ must be implemented in mongoose adapter
            credentials: username && { username },
          },
        ],
        ["Institution", { attributes: ["name"], as: "Institution" }],
      ],
      size,
      page,
    })
  );
};

export const getOwnCertifications = async (data: any) => {
  const { token } = data;
  const { user } = await verifyToken2(token);
  return await User.certifications(RepositoryService, {
    username: user.username,
  });
};

export const getCertificationByUUID = async (data: any) => {
  return await Certification.find(RepositoryService, data);
};

export const addNewCertification = async (data: any) => {
  if (!data.user) throw boom.conflict("A user must be instanced!");
  const certification = await Certification.createOne(RepositoryService, data);
  return {
    ...certification,
    emitedBy: data.emitedBy,
    grantedTo: data.user.username,
  };
};

export const addManyCertifications = async (data: any) => {
  const { certifications, user, emitedBy } = data;
  const newCertifications = await Certification.createMany(
    RepositoryService,
    certifications.map((c: any) => ({ ...c, user }))
  );
  return newCertifications.map((c: any) => ({
    ...c,
    emitedBy,
    grantedTo: user.username,
  }));
};

export const updateCertification = async (data: any) => {
  const { user, uuid, token, ...rest } = data;
  const result = await (
    await Certification.load(RepositoryService, {
      indexation: { uuid },
    })
  ).update(RepositoryService, rest);
  return { updated: result };
};

export const removeCertification = async (data: any) => {
  await (
    await Certification.load(RepositoryService, {
      indexation: { uuid: data.uuid },
    })
  ).remove(RepositoryService, { userUUID: data.user.uuid });
  return { message: "Certification deleted", uuid: data.uuid };
};
