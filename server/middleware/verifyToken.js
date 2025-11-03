import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        req.user = decoded; // attach user info to request
        next(); // continue to the protected route
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
