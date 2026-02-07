const jwt = require("jsonwebtoken")
require("dotenv").config()

const generateToken = (user) => {
    try {
        // Check if JWT_SECRET is configured
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured in environment variables")
        }
        
        // Check if user data is provided
        if (!user) {
            throw new Error("User data is required for token generation")
        }
        
        // Generate token with expiration
        const token = jwt.sign(
            { username: user }, 
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // Token expires in 24 hours
        )
        
        return token
        
    } catch (error) {
        console.error("Token generation error:", error.message)
        throw new Error(`Failed to generate token: ${error.message}`)
    }
}

module.exports = generateToken