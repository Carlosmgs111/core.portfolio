import { filterAttrs } from "../../../utils";
import { Certificate } from "../domain/entity";

export const serializeCertificates = (certificates: [Certificate]) =>
  certificates
    .map((certificate: any) =>
      filterAttrs(
        {
          ...certificate,
          emitedAt: new Date(certificate.emitedAt).getTime(),
          grantedTo: certificate.Users ? certificate.Users[0]?.username : "",
          emitedBy: certificate.Institution ? certificate.Institution?.name : "",
        },
        ["Users", "Institution"]
      )
    )
    .sort((a: any, b: any) => {
      if (a.emitedAt < b.emitedAt) return 1;
      return -1;
    });
