import { Router } from "express";
import { askTravelAssistant } from "../controllers/assistant.controller.js";

const router = Router();

router.post("/travel-guide", askTravelAssistant);

export default router;
