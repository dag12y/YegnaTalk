import User from "./../models/userModel.js";

export async function getLoggedUser(req, res) {
    try {
        //get the logged user
        const user = await User.findOne({ _id: req.body.userId });

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
