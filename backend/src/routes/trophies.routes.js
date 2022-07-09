import express from "express";
import nocache from "nocache";

import auth from "../middleware/auth.middleware.js";
import * as trophyControllers from "../controllers/trophies.controllers.js";

const trophiesRouter = express.Router();

trophiesRouter.post("/:trophyId/collect", [nocache(), auth], trophyControllers.collectTrophy);
//trophiesRouter.get("/:userId/trophies", [nocache(), auth], trophyControllers.getTrophiesUser);
trophiesRouter.get("/:user_id/trophies", trophyControllers.getTrophiesUser);


// Dev Routes
trophiesRouter.get("/", trophyControllers.getAllTrophies);
trophiesRouter.post("/create", trophyControllers.createTrophy);
trophiesRouter.put("/:id", trophyControllers.updateTrophy);
trophiesRouter.delete("/:id", trophyControllers.deleteTrophy);

export default trophiesRouter;
