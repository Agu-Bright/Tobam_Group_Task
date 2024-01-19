import mongoose, { Document, Model, Schema } from "mongoose";

interface IImage extends Document {
  img: string;
}

const imageSchema: Schema<IImage> = new mongoose.Schema({
  img: {
    type: String,
    required: [true, "Select an image to upload"],
  },
});

const Image: Model<IImage> = mongoose.model<IImage>("Image", imageSchema);

export default Image;
