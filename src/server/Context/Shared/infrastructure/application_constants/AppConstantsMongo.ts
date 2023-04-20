import { model, Schema } from "mongoose";

export interface AppConstantsMongo {
  boostedRevenueDate: Date;
}

const AppConstantsSchema = new Schema<AppConstantsMongo>({
  boostedRevenueDate: Date,
});

export const AppConstantsModel = model<AppConstantsMongo>(
  "AppConstants",
  AppConstantsSchema,
);
