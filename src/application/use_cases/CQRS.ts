import { RepositoryService } from "../../config/dependencies";

export const sync = () => {
  RepositoryService.sync()
};
