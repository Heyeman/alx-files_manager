import { Router } from "express";
import { getStatus, getStats } from "../controllers/AppController";
import { postNew, getMe } from "../controllers/UsersController";
import { getConnect, getDisconnect } from "../controllers/AuthController";
import { postUpload } from "../controllers/FilesController";
const router = Router();
//app routes
router.get("/status", getStatus);
router.get("/stats", getStats);
//users routes
router.post("/users", postNew);
router.get("/connect", getConnect);
router.get("/disconnect", getDisconnect);
router.get("/users/me", getMe);

//files controller
router.post("/files", postUpload);
module.exports = router;
