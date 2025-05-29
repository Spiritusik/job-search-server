import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import ApiError from "@/errors/ApiError";

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);

    if (err instanceof ApiError) {
        res.status(err.status).json({ message: err.message });
        return;
    }

    res.status(500).json({ message: "Unexpected error!" });
};

export default errorMiddleware;
