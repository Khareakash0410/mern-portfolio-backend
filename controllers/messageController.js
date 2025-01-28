import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Message } from "../models/messageSchema.js";


export const sendMessage = catchAsyncErrors(async(req, res, next) => {
    const {senderName, subject, message} = req.body;

    if (!senderName || !subject || !message) {
        return next(new ErrorHandler("Please fill Full Form", 400));
    }

    const existedMessage = await Message.findOne({
        message
    });

    if (existedMessage) {
        return next(new ErrorHandler("Already message sent", 400));
    }

    const data = await Message.create({
        senderName, 
        subject, 
        message  
    });

    res.status(200).json({
       success: true,
       message: "Message Sent",
       data, 
    });

});


export const getAllMessage = catchAsyncErrors(async(req, res, next) => {
    const findMessage = await Message.find();
    res.status(200).json({
        success: true, 
        message: "All message here",
        findMessage
    });
});


export const deleteMessage = catchAsyncErrors(async(req, res, next) => {
    const {id} = req.params;
    const findMessage = await Message.findById(id);

    if (!findMessage) {
        return next(new ErrorHandler("Message Already Deleted", 400));
    }

    await findMessage.deleteOne();
    res.status(200).json({
        success: true,
        message: "Message Deleted"
    });
});