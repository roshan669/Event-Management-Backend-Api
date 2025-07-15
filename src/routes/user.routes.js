import { Router } from "express";
import {
  cancelRegistration,
  createUser,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/create").post(createUser);
router.route("/cancelregistration").delete(cancelRegistration);

export default router;
