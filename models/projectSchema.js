import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({

 title: {
    type: String,
    unique: true,
 },
 description: String,
 gitLink: String,
 projectLink: String,
 technology: String,
 techStack: String,
 deployed: String,
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


export const Project = mongoose.model("Project", projectSchema);