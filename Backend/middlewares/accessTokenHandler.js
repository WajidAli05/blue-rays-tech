import jwt from "jsonwebtoken";
import { config } from "dotenv";

// Load environment variables from .env file
config();

const validateToken = async (req, res, next) => {
    try {
        // Get the token from the header. The token is in Bearer Token under the Authorization header
        const bearerHeader = req.headers["authorization"];

        // Split the token from the header
        if (!bearerHeader || !bearerHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Access Denied: Invalid Authorization header" });
        }
        const token =  bearerHeader.split(' ')[1];
       
        // Deny access if the authorization header is not present
        if (!token) {
            return res.status(401).json({ message: "Access Denied: No Authorization header" });
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