import express, { urlencoded } from "express";
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))
app.use(express.json({limit : "16kb"})); // this is used to parse any kind of json object send to request
app.use(express.urlencoded({extended : true,limit : "16kb"})) //this is needed to parse params info send in the request params by different browsers as different browsers have different types
// extended : true means object in object, object ladder 
app.use(express.static("public"));// used to store files,images, pdf in public folder or any folder available to anyone
app.use(cookieParser()); // crud operations in cookies

export {app};