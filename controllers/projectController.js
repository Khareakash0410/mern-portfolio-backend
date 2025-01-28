import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Project } from "../models/projectSchema.js";
import {v2 as cloudinary} from "cloudinary";




export const addProject = catchAsyncErrors(async(req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Project Banner is Required", 400));
      }

      const {title,
        description,
        gitLink,
        projectLink,
        technology,
        techStack,
        deployed} = req.body;

      const {svg} = req.files;

      if (!title || !description || !gitLink ||
        !projectLink ||
        !technology ||
        !techStack ||
        !deployed) {
        return next(new ErrorHandler("All Information are required", 400));
      }

      const cloudinarySvg = await cloudinary.uploader.upload(svg.tempFilePath,{folder:"PORTFOLIO_PROJECT_SVG"});
      console.log(cloudinarySvg);

      if (!cloudinarySvg || cloudinarySvg.error) {
        console.error("Cloudinary Error:", cloudinarySvg.error || "Unknown Cloudinary Error");
        return next(new ErrorHandler("Failed to upload Project Image", 500));
      }

      const existedProject = await Project.findOne({
        title
      });
     
      if (existedProject) {
        return next(new ErrorHandler("Project Already Existed!", 400));
      }

      const newProject = await Project.create({
        title,
        description,
        gitLink,
        projectLink,
        technology,
        techStack,
        deployed,
        svg: {
            public_id: cloudinarySvg.public_id,
            url: cloudinarySvg.secure_url,
        },
      });

      res.status(201).json({
        success: true,
        message: "Project Created Successfully!",
        newProject,
      });
});





export const deleteProject = catchAsyncErrors(async(req, res, next) => {
   const {id} = req.params;

   const findProject = await Project.findById(id);

   if (!findProject) {
    return next(new ErrorHandler("Project Not Found!", 400));
   }

   await findProject.deleteOne();

   res.status(200).json({
    success: true,
    message: "Project deleted!"
   });
});





export const updateProject = catchAsyncErrors(async(req, res, next) => {
     const updatedData = {
        title: req.body.title,
        description: req.body.description,
        gitLink: req.body.gitLink,
        projectLink: req.body.projectLink,
        technology: req.body.technology,
        techStack: req.body.techStack,
        deployed: req.body.deployed
     };

     if (req.files && req.files.svg) {
             const svg = req.files.svg;
             const project = await Project.findById(req.params.id);
             const svgPublicId = project.svg.public_id;
             await cloudinary.uploader.destroy(svgPublicId);
             const cloudinarySvg = await cloudinary.uploader.upload(svg.tempFilePath,{folder: "PORTFOLIO_PROJECT_SVG"}
             );
     
             updatedData.svg = {
                 public_id: cloudinarySvg.public_id,
                 url: cloudinarySvg.secure_url,
             };
         };

     if (!updatedData.title && !updatedData.description && !updatedData.gitLink && !updatedData.projectLink && !updatedData.technology && !updatedData.techStack && !updatedData.deployed && !req.files) {
            return next(new ErrorHandler("Please provide at least one category", 400));
         }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updatedData, {
         new: true,
         runValidators: true,
         useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "Project Updated Successfully", 
        updatedProject,
    });
});






export const getAllProject = catchAsyncErrors(async(req, res, next) => {
  const allProject = await Project.find();
  res.status(200).json({
    success: true,
    allProject,
  });
});





export const getSingleProject = catchAsyncErrors(async(req, res, next) => {
    const {id} = req.params;
    const findProject = await Project.findById(id);

    res.status(200).json({
        success: true,
        findProject,
    });
});