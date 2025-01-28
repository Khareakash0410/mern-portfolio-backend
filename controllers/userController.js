import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/error.js"
import {User} from "../models/userSchema.js"
import {v2 as cloudinary} from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";



export const register = catchAsyncErrors(async(req, res, next) => {
      if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Avatar and Resume are Required", 400));
      }


      const {avatar} = req.files;
      console.log(avatar)

      const cloudinaryAvatar = await cloudinary.uploader.upload(avatar.tempFilePath,{folder: "AVATAR"}
      );

      if (!cloudinaryAvatar || cloudinaryAvatar.error) {
        console.error("Cloudinary Error:", cloudinaryAvatar.error || "Unknown Cloudinary Error");
        return next(new ErrorHandler("Failed to upload Avatar", 500));
      }



      const {resume} = req.files;
      console.log(resume)

      const cloudinaryResume = await cloudinary.uploader.upload(resume.tempFilePath,
        {folder: "RESUME"}
      );

      if (!cloudinaryResume || cloudinaryResume.error) {
        console.error("Cloudinary Error:", cloudinaryResume.error || "Unknown Cloudinary Error");
        return next(new ErrorHandler("Failed to upload Resume", 500));
      }




       const {fullName,email,phone,aboutMe,password,portfolioURL,githubURL,instagramURL,twitterURL,linkedInURL,facebookURL}  = req.body;
       
       const existedUser = await User.findOne({
        email
       })

       if (existedUser) {
        return next(new ErrorHandler("User Already Existed", 400));
       }

       const createUser = await User.create({
        fullName,
        email,
        phone,
        aboutMe,
        password,
        portfolioURL,
        githubURL,
        instagramURL,
        twitterURL,
        linkedInURL,
        facebookURL,
        avatar: {
            public_id: cloudinaryAvatar.public_id,
            url: cloudinaryAvatar.secure_url
        },
        resume: {
            public_id: cloudinaryResume.public_id,
            url: cloudinaryResume.secure_url
        },
       });

       generateToken(createUser, "User Registered", 201, res);

});



export const login = catchAsyncErrors(async(req, res, next) => {
    const {email, password} = req.body;
    if (!email || ! password) {
        return next(new ErrorHandler("Email and Password are required"));
    }
   
    const findUser = await User.findOne({email}, "+password");
    if (!findUser) {
        return next(new ErrorHandler("Wrong Email Address"));
    }

    const passwordMatch = await findUser.comparePassword(password);

    if (!passwordMatch) {
        return next(new ErrorHandler("Wrong Password"));
    }

    generateToken(findUser, "Logged In successfully", 200, res);
});



export const logout = catchAsyncErrors(async(req, res, next) => {
    res.status(200).cookie("token", "" , {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "None",
        secure:true
    }).json({
        success: true,
        message: "Logout Successfully"
    });
});



export const getUser = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({
        success: true,
        user,
    });

});



export const updateUser = catchAsyncErrors(async(req, res, next) => {
    const newUserData =  {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        aboutMe: req.body.aboutMe,
        portfolioURL: req.body.portfolioURL,
        githubURL: req.body.githubURL,
        instagramURL: req.body.instagramURL,
        twitterURL: req.body.twitterURL,
        linkedInURL: req.body.linkedInURL,
        facebookURL: req.body.facebookURL,
    };

    if (req.files && req.files.avatar) {
        const avatar = req.files.avatar;
        const user = await User.findById(req.user._id);
        const avatarPublicId = user.avatar.public_id;
        await cloudinary.uploader.destroy(avatarPublicId);
        const cloudinaryAvatar = await cloudinary.uploader.upload(avatar.tempFilePath,{folder: "AVATAR"}
        );

        newUserData.avatar = {
            public_id: cloudinaryAvatar.public_id,
            url: cloudinaryAvatar.secure_url,
        };
    }


    if (req.files && req.files.resume) {
        const resume = req.files.resume;
        const user = await User.findById(req.user._id);
        const resumePublicId = user.resume.public_id;
        await cloudinary.uploader.destroy(resumePublicId);
        const cloudinaryResume = await cloudinary.uploader.upload(resume.tempFilePath,{folder: "RESUME"}
        );

        newUserData.resume = {
            public_id: cloudinaryResume.public_id,
            url: cloudinaryResume.secure_url,
        };
    }

    if (!newUserData.fullName && !newUserData.email && !newUserData.phone && !newUserData.aboutMe && !newUserData.portfolioURL && !newUserData.githubURL && !newUserData.instagramURL && !newUserData.twitterURL && !newUserData.linkedInURL && !newUserData.facebookURL && !req.files) {
        return next(new ErrorHandler("Please Update at least one category",400));
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, newUserData, {
         new: true,
         runValidators: true,
         useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "User Updated Successfully",
        updatedUser,
    });

});



export const updatePassword = catchAsyncErrors(async(req, res, next) => {
    const {currentPassword, newPassword, confirmNewPassword} = req.body;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return next(new ErrorHandler("Please provide all required Details", 400));
    }
    const findUser = await User.findById(req.user._id).select("password");
    const isPasswordMatch = await findUser.comparePassword(currentPassword);

    if (!isPasswordMatch) {
        return next(new ErrorHandler("Incorrect Current Password", 400));
    }

    if (newPassword !== confirmNewPassword) {
        return next(new ErrorHandler("New Password and Confirm New Password not match", 400));
    }

    findUser.password = newPassword;
    await findUser.save();

    res.status(200).json({
        success: true,
        message: "Password Updated Successfully",
    });
});



export const getUserForPortfolio = catchAsyncErrors(async(req, res, next) => {
    const id = "6797880c3f09f83377e45ed1"
    const findUser = await User.findById(id);
    res.status(200).json({
        success: true,
        findUser,
    });

});



export const forgetPassword = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return next(new ErrorHandler("User Not Found!", 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false}); 

    const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;

    const message = `Your reset Password Token is : \n\n ${resetPasswordUrl} \n\n If you have not Requeseted this , Kindly ignore it`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Portfolio Dashboard Recover Password",
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email Sent to ${user.email} successfully!`
        })
    } catch (error) {
       user.resetPasswordExpire = undefined;
       user.resetPasswordToken = undefined;
       await user.save();
       return next(new ErrorHandler(error.message, 500));   
    }
});



export const resetPassword = catchAsyncErrors(async(req, res, next) => {
    const {resetToken} = req.params;
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const findUser = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!findUser) {
        return next(new ErrorHandler("Reset Password Token is Invalid or Expired!", 404));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password and confirmPassword do not Match!", 400));
    }

    findUser.password = req.body.password
    findUser.resetPasswordToken = undefined
    findUser.resetPasswordExpire = undefined
    
    await findUser.save();

    generateToken(findUser, "Reset Password Successfully", 201, res);
});