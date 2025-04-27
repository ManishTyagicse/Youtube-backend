import {v2} from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloundinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null

        //uploading the file
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })

        // file has been uploaded succesfully
        console.log("file uploaded successfully on cloudinary!!!", response.url);
        return response;
    }
    catch(error) {
        fs.unlinkSync(localFilePath) // remove the locally 
                                    //saved temporary file which didn't get uploaded
                                    // unlinkSync because we want the process to be synchronous and happen immediately when the upload fails
        return null
    }
}

export {uploadOnCloundinary}