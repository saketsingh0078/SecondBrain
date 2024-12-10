import express, { Request, Response } from "express";
import cors from "cors";
import zod from "zod";
import { Content, Link, User } from "./db";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import auth from "./middleware";
import random from "./utils";

const PORT = 8000;
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({
    msg: " health check",
  });
});

const signinSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(3),
});

const signupSchema = zod.object({
  name: zod.string(),
  email: zod.string().email(),
  password: zod.string().min(3),
});

app.post(
  "/api/v1/signin",
  async (req: Request, res: Response): Promise<any> => {
    const { success } = signinSchema.safeParse(req.body);
    if (!success) {
      return res.status(4111).json({
        msg: "Incorrect input",
      });
    }

    try {
      const user = await User.findOne({
        email: req.body.email,
        password: req.body.password,
      });

      if (user) {
        const token = jwt.sign(
          {
            id: user._id,
          },
          JWT_SECRET
        );

        return res.status(200).json({
          token,
          msg: "User logged in successfully",
        });
      }
      return res.status(403).json({
        msg: "Incorrect Credentials",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        msg: "Erorr while signing",
      });
    }
  }
);

app.post("/api/v1/signup", async (req, res) => {
  const { success } = signupSchema.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      msg: "Incorrect input",
    });
    return;
  }

  const existingUser = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (existingUser) {
    res.status(403).json({
      msg: "user already exist",
    });
    return;
  }

  try {
    const user = User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    const token = jwt.sign(
      {
        //@ts-ignore
        id: user._id,
      },
      JWT_SECRET
    );

    res.status(200).json({
      token,
      msg: "User is signUp successfully ",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "Error while signup",
    });
  }
});

app.post(
  "/api/v1/content",
  auth,
  async (req: Request, res: Response): Promise<any> => {
    const title = req.body.title;
    const type = req.body.type;
    const link = req.body.link;

    //@ts-ignore
    const userId = req.userId;

    try {
      const content = await Content.create({
        title,
        type,
        link,
        tag: [],
        userId,
      });

      return res.status(200).json({
        content,
        msg: "content is created successfully",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        msg: "Error while content creating",
      });
    }
  }
);

app.get(
  "/api/v1/content",
  auth,
  async (req: Request, res: Response): Promise<any> => {
    //@ts-ignore
    const userId = req.userId;

    try {
      const content = await Content.find({ userId }).populate({
        path: "userId",
        select: { name: 1, email: 1 },
      });

      return res.status(200).json({
        content,
        msg: "Get the User content successfully",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        msg: " error while fetching user Content",
      });
    }
  }
);

app.delete(
  "/api/v1/content",
  auth,
  async (req: Request, res: Response): Promise<any> => {
    const contentId = req.body.contentId;
    //@ts-ignore
    const userId = req.userId;
    if (!contentId)
      return res.status(411).json({
        msg: "ContentId is requires",
      });

    try {
      await Content.deleteOne({ _id: contentId, userId });
      return res.status(200).json({
        msg: "Content deleted",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        msg: "Error while deleting Content",
      });
    }
  }
);

app.post(
  "/api/v1/brain/share",
  async (req: Request, res: Response): Promise<any> => {
    const share = req.body.share;
    //@ts-ignore
    const userId = res.userId;
    if (share) {
      const existingLink = await Link.findOne({
        userId,
      });

      if (existingLink) {
        return res.status(200).json({
          hash: existingLink.hash,
        });
      }

      const hash = random(10);
      const link = Link.create({
        hash,
        userId,
      });
      return res.status(200).json({
        hash,
        msg: "hash is generated successfully",
      });
    } else {
      await Link.deleteOne({ userId });

      return res.status(200).json({
        msg: " Link is removed ",
      });
    }
  }
);

app.get(
  "/api/v1/brain/:shareLink",
  async (req: Request, res: Response): Promise<any> => {
    const hash = req.params.shareLink;

    const link = await Link.findOne({ hash });

    if (!link) {
      return res.status(411).json({
        msg: "Incorrect input",
      });
    }

    const content = await Content.find({
      userId: link.userId,
    });

    const user = await User.findById({
      _id: link.userId,
    });

    if (!user) {
      return res.status(411).json({
        msg: "user is not found ",
      });
    }

    return res.status(200).json({
      name: user.name,
      content,
    });
  }
);

app.listen(PORT, () => {
  console.log(`connected to server at port ${PORT}`);
});
