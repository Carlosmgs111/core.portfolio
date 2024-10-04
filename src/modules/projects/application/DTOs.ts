import { Project } from "../domain/entity";
import { filterAttrs, fromEnumToArray } from "../../../utils";
import { kind, state, stack } from "../../../enums";
export const serializeProjects = (projects: [Project]) =>
  projects.map((project: any) =>
    filterAttrs(
      {
        ...project,
        buildedBy: project.Users.map(({ username }: any) => username),
        // kind: fromEnumToArray(kind),
        // state: fromEnumToArray(state),
        // stack: fromEnumToArray(stack),
      },
      ["Users"]
    )
  );
