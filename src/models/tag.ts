import mongoose, { model, Schema } from "mongoose";

const contentType = ["audio", "video", "article", "image"]; //extend as needed

const tagSchema = new Schema({
  title: String,
  type: {
    type: String,
    enum: contentType,
  },
  content: {
    type: Schema.Types.ObjectId,
    ref: "Content",
  },
});

const Tag = model("Tag", tagSchema);

export default Tag;
