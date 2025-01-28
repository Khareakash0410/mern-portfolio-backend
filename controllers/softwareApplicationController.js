import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { SoftwareApplication } from "../models/softwareApplicationSchema.js";
import {v2 as cloudinary} from "cloudinary";





export const addSoftwareApplication = catchAsyncErrors(async(req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Software Application Icon is Required", 400));
      }

      const {name} = req.body;
      const {svg} = req.files;

      if (!name) {
        return next(new ErrorHandler("Name of Software Application to Identify", 400));
      }

      const cloudinarySvg = await cloudinary.uploader.upload(svg.tempFilePath,{folder: "PORTFOLIO_SOFTWARE_SVG"}
      );

      if (!cloudinarySvg || cloudinarySvg.error) {
        console.error("Cloudinary Error:", cloudinarySvg.error || "Unknown Cloudinary Error");
        return next(new ErrorHandler("Failed to upload Software Icon", 500));
      }

      const existedSoftwareApllication = await SoftwareApplication.findOne({
        name
      })

      if (existedSoftwareApllication) {
        return next(new ErrorHandler("Already Existed Software Application", 400));
      }
      
      const newSoftwareApplication = await SoftwareApplication.create({
        name,
        svg: {
            public_id: cloudinarySvg.public_id,
            url: cloudinarySvg.secure_url,
        },
      });

      res.status(200).json({
        success: true,
        message: "New Software Application Created",
        newSoftwareApplication,
      });
});





export const deleteSoftwareApplication = catchAsyncErrors(async(req, res, next) => {
   const {id} = req.params;
   const findSoftwareApplication = await SoftwareApplication.findById(id);

   if (!findSoftwareApplication) {
    return next(new ErrorHandler("Software Application Not Found", 400));
   }

   const softwareApplicationSvgId = findSoftwareApplication.svg.public_id;

   await cloudinary.uploader.destroy(softwareApplicationSvgId);

   await findSoftwareApplication.deleteOne();

   res.status(200).json({
    success: true,
    message: "Software Application Deleted!"
   });
});





export const getAllSoftwareApplication = catchAsyncErrors(async(req, res, next) => {
     const allSoftwareApplication = await SoftwareApplication.find();
     res.status(200).json({
        success: true,
        allSoftwareApplication,
       });
});



