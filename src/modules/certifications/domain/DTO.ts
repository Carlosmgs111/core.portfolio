import { filterAttrs } from "../../../utils";
import { Certification } from "./Certification";

export const formatCertifications = (certifications: [Certification]) =>
  certifications
    .map((certification: any) =>
      filterAttrs(
        {
          ...certification,
          emitedAt: new Date(certification.emitedAt).getTime(),
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
