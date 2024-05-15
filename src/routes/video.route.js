import { Router } from "express";
import { getAllVideos, postVideo } from "../controllers/video.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router();
router.route("/getAllVideos").get(getAllVideos);
router.route("/").post(verifyJWT, upload.fields([
    {
        name: "videoFile",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]),postVideo);

export default router;