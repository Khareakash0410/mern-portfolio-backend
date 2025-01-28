import mongoose from "mongoose";

const softwareApplicationSchema = new mongoose.Schema({
   name: {
    type: String,
    unique: true,
   },
   svg: {
    public_id: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
   },
});

export const SoftwareApplication = mongoose.model("SoftwareApplication", softwareApplicationSchema);