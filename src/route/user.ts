import { NextFunction, Request, Response, Router } from "express";
import auth from "../middlware";

const router = Router();

router.post("/signin", (req, res) => {});
router.post("/signup", (req, res) => {});
router.post("/content", auth, (req, res) => {});
router.get("/content", (req, res) => {});
router.delete("/content/:id", (req, res) => {});

export default router;
