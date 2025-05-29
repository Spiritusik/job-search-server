import { Schema, model, Types } from "mongoose";

const tokenSchema = new Schema({
    refreshToken: { type: String, required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
});

export const Token = model("Token", tokenSchema);