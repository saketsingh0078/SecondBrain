import mongoose, { model, Schema, Types } from "mongoose";

try {
  mongoose.connect(
    "mongodb+srv://admin:Yuko%4012345@cluster0.f31vu5f.mongodb.net/secondBrain"
  );
  console.log("Connect to the db");
} catch (e) {
  console.log(e);
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const contentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  link: String,
  tags: [
    {
      ref: "Tags",
      type: Schema.Types.ObjectId,
    },
  ],
  userId: {
    ref: "User",
    type: Schema.Types.ObjectId,
  },
});

const tagsSchema = new Schema({
  tag: {
    type: String,
    required: true,
  },
});

const LinkSchema = new Schema({
  hash: String,
  userId: {
    ref: "User",
    type: Schema.Types.ObjectId,
  },
});

const User = model("User", userSchema);
const Content = model("Content", contentSchema);
const Tags = model("Tags", tagsSchema);
const Link = model("Link", LinkSchema);

export { User, Content, Tags, Link };
