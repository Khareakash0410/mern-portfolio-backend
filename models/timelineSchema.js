import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is Required"],
        unique: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    timeline: {
      from : {
        type: String,
        required: [true, "Timeline Must be started from anytime"],
      },
      to: String,
    },
});

export const Timeline = mongoose.model("Timeline", timelineSchema);