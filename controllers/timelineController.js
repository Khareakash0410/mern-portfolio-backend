import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Timeline } from "../models/timelineSchema.js";




export const addTimeline = catchAsyncErrors(async(req, res, next) => {
   const {title, description, from, to} = req.body;
   const existedTimeline = await Timeline.findOne({
    title: title
   }); 
   if (existedTimeline) {
    return next(new ErrorHandler("Time Already existed for this title", 400));
   }
    const createTimeline = await Timeline.create({
        title,
        description,
        timeline: {
            from,
            to
        },
    });

    res.status(200).json({
        success: true,
        message: "New Timeline Added Successfully",
        createTimeline,
    });
});




export const deleteTimeline = catchAsyncErrors(async(req, res, next) => {
   const {id} = req.params;
   const findTimeline = await Timeline.findById(id);
   if (!findTimeline) {
    return next(new ErrorHandler("Timeline Not Found!", 404));
   }

   await findTimeline.deleteOne();
   res.status(200).json({
    success: true,
    message: "Timeline Deleted Successfully"
   });

});



export const getAllTimeline = catchAsyncErrors(async(req, res, next) => {
   const allTimelines = await Timeline.find();

   res.status(200).json({
    success: true,
    allTimelines,
   });
});