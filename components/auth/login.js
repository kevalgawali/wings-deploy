const pool=require("../../config/db")
const generateToken = require("../../utils/auth/jwtTokenGenerator")
const bcrypt = require("bcrypt")

const login = async(req, res) => {
    try {
        const {username, password} = req.body
        
        // Input validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: "Username and password are required"
            })
        }
        
        // Check if user exists
        const passwordFromDB = await pool.query("select password,role from admin where username=$1", [username])
        if (passwordFromDB.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Authentication failed",
                error: "User not found"
            })
        }
        
        if (passwordFromDB.rows.length > 1) {
            return res.status(500).json({
                success: false,
                message: "Database error",
                error: "Multiple users found with same username"
            })
        }
        
        // Compare password
        const hash = passwordFromDB.rows[0].password
        const passMatch = await bcrypt.compare(password, hash)
        
        if (passMatch) {
            const token = generateToken(username)
            const cookieOptions = {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production',
            }
            res.cookie("token", token, cookieOptions)
            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    user:{
                    role:passwordFromDB.rows[0].role,
                    username: username,
                    token: token,
                    error:false
                    }
                },
            })
        } else {
            return res.status(401).json({
                success: false,
                message: "Authentication failed",
                error: "Invalid password"
            })
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: "Server encountered an unexpected error during login"
        })
    }
}

module.exports = login