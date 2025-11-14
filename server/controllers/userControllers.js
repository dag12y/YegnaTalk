import User from "./../models/userModel.js";
import cloudinary from "../configs/cloudinary.js";

export async function getLoggedUser(req, res) {
    try {
        //get the logged user
        const user = await User.findById(req.body.userId );

        res.send({
            message:"user fetched successfully",
            success:true,
            data:user
        })

    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false,
        });
    }
}

export async function getAllUsers(req,res) {
    try {
        //getting all users except the logged user
        const allUsers=await User.find({_id:{$ne:req.body.userId}})

         res.send({
            message:"All users fetched successfully",
            success:true,
            data:allUsers
        })
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false,
        });
    }
}

export async function uploadProfilePic(req, res) {
    try {
        if (!req.file) throw new Error("No file uploaded");

        const streamUpload = (reqFile) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "YegnaTalk" },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                stream.end(reqFile.buffer);
            });
        };

        const result = await streamUpload(req.file);

        const user = await User.findByIdAndUpdate(
            req.body.userId,
            { profile: result.secure_url },
            { new: true }
        );

        res.status(201).send({
            message: "Profile picture uploaded successfully",
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false,
        });
    }
}


