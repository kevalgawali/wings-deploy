const pool = require("../../config/db")
const bcrypt = require("bcrypt")
require("dotenv").config()

const changeAdminPasswords = async(req, res) => {
    const client = await pool.connect()
    try {
        const { username } = req.body.user
        console.log("User:", username)
        const { targetUsername, newPassword } = req.body
        
        await client.query("BEGIN")
        
        // Check if current user is Super Admin
        const user_data = await pool.query("SELECT role FROM admin WHERE username=$1", [username])
        if (user_data.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                error: "Current user not found in database"
            })
        }
        if (user_data.rows[0].role !== "Super Admin") {
            return res.status(403).json({
                success: false,
                message: "Authorization failed",
                error: "Only Super Admin can change admin passwords"
            })
        }
        
        // Check if target admin exists
        const target_admin = await pool.query("SELECT username, role FROM admin WHERE username=$1", [targetUsername])
        if (target_admin.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Target admin not found",
                error: `Admin with username '${targetUsername}' does not exist`
            })
        }
        
        // Validate new password
        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid password",
                error: "New password is required"
            })
        }
        
        // Hash the new password
        const hash = bcrypt.hashSync(newPassword, parseInt(process.env.SALT_ROUNDS, 10))
        
        // Update the password
        await pool.query("UPDATE admin SET password=$1 WHERE username=$2", [hash, targetUsername])
        
        await client.query("COMMIT")
        
        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
            data: {
                targetUsername: targetUsername,
                role: target_admin.rows[0].role,
                changedBy: username
            }
        })
        
    } catch (err) {
        console.log(err)
        await client.query("ROLLBACK")
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: "Failed to change password due to server error"
        })
    } finally {
        client.release()
    }
}

module.exports = changeAdminPasswords