import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config";

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];
  const decoded = jwt.verify(token as string, JWT_SECRET);
  if (decoded) {
    if (typeof decoded === "string") {
      res.status(403).json({
        message: "You are not logged in",
      });
      return;
    }
    //@ts-ignore
    req.userId = (decoded as JwtPayload).id;
    next();
  } else {
    res.status(403).json({
      message: "You are not logged in",
    });
  }
};

export default auth;
