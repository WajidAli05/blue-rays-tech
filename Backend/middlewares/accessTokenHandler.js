import jwt from "jsonwebtoken";
import { config } from "dotenv";

// Load environment variables from .env file
config();

const validateToken = async (req, res, next) => {
    try {
        const token =  req.cookies?.token;
       
        // Deny access if the authorization header is not present
        if (!token) {
            return res.status(401).json({ message: "Access Denied: No token found in cookies" });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(400).json({ message: "Invalid Token" });
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export { validateToken };