import { model, Schema } from "mongoose";

export interface UserMongo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  encryptedPassword: string;
  account: string;
}

const UserSchema = new Schema<UserMongo>({
  _id: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  encryptedPassword: { type: String, required: true },
  account: { type: String, ref: "Account" },
});

export const UserModel = model<UserMongo>("User", UserSchema);
