import mongoose from "mongoose";

export function initializeMongo() {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) throw new Error("MONGO_URL is not defined");

  mongoose.set("strictQuery", false);
  mongoose.connect(mongoUrl);
}
