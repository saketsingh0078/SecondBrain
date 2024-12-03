import mongoose, { model, Schema, Types } from "mongoose";

const contentSchema = new Schema({
  title: String,
  link: String,
  tag: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Content = model("Content", contentSchema);

export default Content;
