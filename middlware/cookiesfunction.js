import jwt from "jsonwebtoken";

export const verfytoken = async (req, res, next) => {
    // Extract the token from the cookies
    const token = req.cookies.token; // Access the 'token' cookie

    // Check if the token exists
    if (!token) {
        return res.status(401).json({ message: "User not logged in" }); // 401 Unauthorized
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user ID to the request object
        if (decoded.id) {
            req.body.userId = decoded.id; // Attach the user ID to the request
        } else {
            return res.status(401).json({ message: "Invalid token" }); // 401 Unauthorized
        }

        // Proceed to the next middleware/route
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Invalid or expired token" }); // 401 Unauthorized
    }
};