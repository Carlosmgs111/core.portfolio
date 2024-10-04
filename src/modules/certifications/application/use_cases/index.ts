import { Certificate } from "../../domain/entity";
import { User } from "../../../users/domain/entity";
import { serializeCertificates } from "../DTOs";

export const getCertifications = async (RepositoryService: any, data: any) => {
  const { username, user, size, page } = data;
  return serializeCertificates(
    await Certificate.findAll(RepositoryService, {
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

export const getOwnCertifications = async (
  RepositoryService: any,
  data: any
) => {
  const { token, user } = data;
  return await User.certifications(RepositoryService, {
    indexation: { username: user.username },
  });
};

export const getCertificationByUUID = async (
  RepositoryService: any,
  data: any
) => {
  return await Certificate.find(RepositoryService, data);
};

export const addNewCertification = async (
  RepositoryService: any,
  data: any
) => {
  const certification = await Certificate.createOne(RepositoryService, data);
  return {
    ...certification,
    emitedBy: data.emitedBy,
    grantedTo: data.user.username,
  };
};

export const addManyCertifications = async (
  RepositoryService: any,
  data: any
) => {
  const { certifications, user, emitedBy } = data;
  const newCertifications = await Certificate.createMany(
    RepositoryService,
    certifications.map((c: any) => ({ ...c, user }))
  );
  return newCertifications.map((c: any) => ({
    ...c,
    emitedBy,
    grantedTo: user.username,
  }));
};

export const updateCertification = async (
  RepositoryService: any,
  data: any
) => {
  const { user, uuid, token, ...rest } = data;
  const result = await (
    await Certificate.load(RepositoryService, {
      indexation: { uuid },
    })
  ).update(RepositoryService, rest);
  return { updated: result };
};

export const removeCertification = async (
  RepositoryService: any,
  data: any
) => {
  await (
    await Certificate.load(RepositoryService, {
      indexation: { uuid: data.uuid },
    })
  ).remove(RepositoryService, { userUUID: data.user.uuid });
  return { message: "Certification deleted", uuid: data.uuid };
};
