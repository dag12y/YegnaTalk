import User from "./../models/userModel.js";

export async function getLoggedUser(req, res) {
    try {
        const user = await User.findOne({ _id: req.body.userId });

        res.send({
            message:"user fetched successfully",
            success:true,
            data:user
        })

    } catch (error) {
        res.send({
            message: error.message,
            success: false,
        });
    }
}
