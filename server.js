import cors from "cors"
import path from "path"
import express from 'express'
import morgan from "morgan"

const app = express()
app.use(cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization", "authorization"]
}))
app.use((req,res,next) => {
    req.api = req.url.split("?")[0];
    next()
})
app.use(express.json({ limit: "10mb" }))
app.use("/public", express.static(path.join(process.cwd(), "public")));
app.set("view engine", "ejs");
app.use(morgan("dev"))

export default app