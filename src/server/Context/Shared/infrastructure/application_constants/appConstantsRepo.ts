import { AppConstants } from "./AppConstants";

export default interface AppConstantsRepo {
  getAll: () => Promise<AppConstants | null>;
  save: (constants: AppConstants) => Promise<void>;
}
