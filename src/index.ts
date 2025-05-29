import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "@/routes"
import errorMiddleware from "@/middlewares/ErrorHandlingMiddleware";
import { env } from "@/config/env";


const DB_URL = `mongodb+srv://${env.MONGGO_DB_ACCESS_LOGIN}:${env.MONGGO_DB_ACCESS_PASSWORD}@job-search.gdztwpq.mongodb.net/?retryWrites=true&w=majority&appName=job-search`

const PORT = env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: env.CLIENT_URL,
}));
app.use('/api', router);

app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log("MongoDB connected");
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (e) {
        console.error("Failed to start server:", e);
        process.exit(1);
    }
};

start();