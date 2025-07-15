import { Router } from "express";
import {
  createEvent,
  getEventDetails,
  getEventStats,
  listUpcomingEvents,
  registerEvent,
} from "../controllers/event.controller.js";

const router = Router();

router.route("/create").post(createEvent);

router.route("/register").post(registerEvent);

router.route("details").get(getEventDetails);

router.route("/upcoming").get(listUpcomingEvents);

router.route("/stats").get(getEventStats);

export default router;
