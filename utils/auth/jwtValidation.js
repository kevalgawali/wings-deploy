const jwt = require("jsonwebtoken")
require("dotenv").config()

const jwtValidation = (req, res, next) => {
    try {
        const token = req.cookies.token
        
        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
                error: "No token provided - Please login first"
            })
        }
        
        // Verify token
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.body.user = user
        console.log("Authenticated user:", user)
        next()
        
    } catch (err) {
        console.log("JWT validation error:", err)
        
        // Handle different JWT errors
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Authentication failed",
                error: "Invalid token"
            })
        } else if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Authentication failed",
                error: "Token expired - Please login again"
            })
        } else {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: "Server encountered an error during authentication"
            })
        }
    }
}

module.exports=jwtValidation