import mongoose, { model, Schema } from "mongoose";

const theModel =
  mongoose.models.Post ||
  model(
    "Post",
    new Schema({
      _id: { type: String, required: true },
      authorId: { type: String, required: true },
      content: { type: String, required: true },
      createdAt: Date,
    })
  );

export default theModel;
