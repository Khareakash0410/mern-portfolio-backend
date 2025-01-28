import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Skill } from "../models/skillSchema.js";
import {v2 as cloudinary} from "cloudinary";




export const addSkill = catchAsyncErrors(async(req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Skill Icon is Required", 400));
      }

      const {title, proficiency} = req.body;
      const {svg} = req.files;

      if (!title || !proficiency) {
        return next(new ErrorHandler("Title or Proficiency is required", 400));
      }

      const cloudinarySvg = await cloudinary.uploader.upload(svg.tempFilePath,{folder: "PORTFOLIO_SKILL_SVG"}
      );

      if (!cloudinarySvg || cloudinarySvg.error) {
        console.error("Cloudinary Error:", cloudinarySvg.error || "Unknown Cloudinary Error");
        return next(new ErrorHandler("Failed to upload Skill Icon", 500));
      }

      const existedSkill = await Skill.findOne({
        title
      });

      if (existedSkill) {
        return next(new ErrorHandler("Already Existed Skill", 400));
      }

      const createSkill = await Skill.create({
        title,
        proficiency,
        svg: {
            public_id: cloudinarySvg.public_id,
            url: cloudinarySvg.secure_url,
        },
      });

      res.status(200).json({
        success: true,
        message: "Skill added Successfully",
        createSkill,
      });
});





export const deleteSkill = catchAsyncErrors(async(req, res, next) => {
    const {id} = req.params;
    const findSkill = await Skill.findById(id);
 
    if (!findSkill) {
     return next(new ErrorHandler("Skill Not Found", 400));
    }
 
    const skillSvgId = findSkill.svg.public_id;
 
    await cloudinary.uploader.destroy(skillSvgId);
 
    await findSkill.deleteOne();
 
    res.status(200).json({
     success: true,
     message: "Skill Deleted!"
    });
});





export const updateSkill = catchAsyncErrors(async(req, res, next) => {
    const {id} = req.params;
    let findSkill = await Skill.findById(id);
 
    if (!findSkill) {
     return next(new ErrorHandler("Skill Not Found", 400));
    }

    const {proficiency} = req.body;
    if(!proficiency) {
        return next(new ErrorHandler("New Proficiency level is required", 400));
    }

    findSkill = await Skill.findByIdAndUpdate(id, {proficiency}, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
 
    res.status(200).json({
        success: true,
        message: "Skill Updated Successfully!",
        findSkill
    });
});




export const getAllSkill = catchAsyncErrors(async(req, res, next) => {
  const allSkill = await Skill.find();
     res.status(200).json({
        success: true,
        allSkill,
       });
});