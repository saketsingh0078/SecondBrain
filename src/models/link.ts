import mongoose, { model, Schema } from "mongoose";

const linkSchema = new Schema({
  hash: String,
  user: {
    type: Schema.Types.ObjectId,
  },
});

const Link = model("Link", linkSchema);

export default Link;
