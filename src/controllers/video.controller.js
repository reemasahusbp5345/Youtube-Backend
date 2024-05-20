import { Video } from "../models/video.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";

const getAllVideos = asyncHandler(async (_, res) => {
  try {
    const videos = await Video.find().populate('owner','username avatar');
    if (!videos) {
      throw new ApiError(500, "Error while fetching data");
    }
    res
      .status(200)
      .json(new ApiResponse(201, videos, "All video fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal server error: ", error);
  }
});

const getVideoById=asyncHandler(async(req,res)=>{
  try {
    const id=req?.params?.id;
    if(!id){
      throw new ApiError(401,"Id not found");
    }
    const video=await Video.findById(id).populate('owner','username avatar');
    if(!video){
      throw new ApiError(401,"Video not found")
    };

    res.status(200).json(new ApiResponse(201,video,"Video fetched successfully"))
  } catch (error) {
    throw new ApiError(500,"Internal Server Error: ",error)
  }
})
const postVideo = asyncHandler(async (req, res) => {
  try {
    const { title, description, duration } = req.body;
    // validation not empty

    if (
      ![title, description, duration].every(
        (field) => field && field.trim() !== ""
      )
    ) {
      throw new ApiError(400, "All * fields are required");
    }

    // check for videoFile and thumbnail upload to clouinary
    const videoFileLocalPath = req?.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req?.files?.thumbnail?.[0]?.path;

    if (!videoFileLocalPath) {
      throw new ApiError(400, "Video File is required");
    }
    if (!thumbnailLocalPath) {
      throw new ApiError(400, "Thumbnail is required");
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile) {
      throw new ApiError(400, "Video File is required");
    }
    if (!thumbnail) {
      throw new ApiError(400, "Thumbnail is required");
    }

    // create video entry in db
    const video = await Video.create({
      videoFile: videoFile?.url,
      thumbnail: thumbnail?.url,
      owner: req?.user?._id,
      title,
      description,
      duration,
    });

    if (!video) {
      throw new ApiError(500, "Failed to upload video on database");
    }
    return res
      .status(201)
      .json(new ApiResponse(200, video, "Video Saved successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal server error: ", error);
  }
});

export { getAllVideos, getVideoById, postVideo };
