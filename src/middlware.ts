import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./constant";

const auth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization as string;
  if (!token) {
    return res.status(401).json({
      msg: "not authorized",
    });
  }
  try {
    const decordedId = jwt.verify(token, JWT_SECRET);
    //@ts-ignore
    req.user = decordedId;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: "expird or Invalid token",
    });
  }
};

export default auth;
