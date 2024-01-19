import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import comression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import db from "./db/connect";
import errorMiddleware from "./middlewares/errors";
import { Request, Response, NextFunction } from "express";
import Image from "./model/image";
import upload from "./utils/multerconfig";
import ErrorHandler from "./utils/errorHandler";
import setResponseObject from "./middlewares/setResponse";
const PORT = process.env.PORT || 8080;
//Handle Uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.log(`Error: ${err.stack}`);
  console.log("Shutting down due to Uncaught Exceptions");
  process.exit(1);
});

//middlewares
const app = express();
app.use(cors());
app.use(comression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(errorMiddleware);

//routes
//image upload endpoint ==> /upload
app.post(
  "/upload",
  setResponseObject,
  upload.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //validate input
      if (!req.file) {
        res.status(400).json({
          status: "Error",
          message: "Select an Image to upload",
        });
      }
      // Create image
      const newImage = new Image({
        img: req.file?.buffer.toString("base64"),
      });

      await newImage.save();

      const response = {
        status: "Success",
        message: "file uploaded sucessfully",
        imageUrl: `/get_image/${newImage._id}`,
        details: {
          fileName: req.file?.originalname,
          size: req.file?.size,
          mimetype: req.file?.mimetype,
        },
      };

      res.status(200).json(response);

      //store image file in mongodb
    } catch (error: any) {
      next(error);
    }
  }
);

//get image endpoint ==> /get_image:id
app.get("/get_image/:id", async (req: Request, res: Response) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      throw new ErrorHandler("Image not found", 404);
    }
    const response = {
      message: "Image retrieved successfully",
      image,
    };
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Run server
const start = async (): Promise<void> => {
  try {
    await db(process.env.MONGO_URI as string);
    app.listen(PORT, () => {
      console.log(`Server Listening on port:${PORT}`);
    });
  } catch (error: any) {
    console.log(error.message);
    console.log("Shutting down the server due to unhandled promise rejection");
    process.exit(1);
  }
};

start();
