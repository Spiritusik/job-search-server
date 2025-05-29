import { Schema, model, Types } from "mongoose";

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: [String], default: ["USER"] },
});

export const User = model("User", userSchema);
