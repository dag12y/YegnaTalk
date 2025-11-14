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

export async function uploadProfilePic(req,res) {
    try {
        const image = req.body.image;

        //upload image to cloudinary
        const uploadedImage = await cloudinary.uploader.upload(image,{
            folder:'YegnaTalk',
        })
        //update the user model and set profile property
        const user = await User.findByIdAndUpdate(
            {_id:req.body.userId},
            {profile:uploadedImage.secure_url},
            {new:true}
        )

        res.status(201).send({
            message:'Profile picture uploaded successfully.',
            success:true,
            data:user
        })
    } catch (error) {
        res.status(400).send({
            message:error.message,
            success:false
        })
    }
}
