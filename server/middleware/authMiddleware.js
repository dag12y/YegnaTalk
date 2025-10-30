import jwt from "jsonwebtoken";

export default (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        if (!req.body) req.body = {}; // ensure req.body exists

        req.body.userId = decodedToken.userId;

        next();
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
        });
    }
};
