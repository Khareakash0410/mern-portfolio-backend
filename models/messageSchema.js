import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderName: {
        type: String,
        minLength: [2, "Name must contain at least 2 characters"],
    },
    subject: {
      type: String,
      minLength: [3, "Subject must contain at least 2 characters"],
    },
    message: {
      type: String,
      minLength: [10, "Message must contain at least 10 characters"],
      unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

export const Message = mongoose.model("Message", messageSchema);