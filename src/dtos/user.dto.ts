import { JwtPayload } from "@/types/jwtPayload";
import { Types } from "mongoose";

export function getPayload(user: { _id: Types.ObjectId; email: string; role: string[] }): JwtPayload {
    return {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
    };
}
