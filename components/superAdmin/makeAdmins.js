const pool=require("../../config/db")
const bcrypt=require("bcrypt")
require("dotenv").config()

const makeAdmins = async(req, res) => {
    const client = await pool.connect()
    try {
        const { username: currentUser } = req.body.user
        const { username, password, role, event } = req.body
        
        console.log(`[MAKE ADMIN] Request from: ${currentUser} to create admin: ${username}`)
        
        await client.query("BEGIN")
        
        // Check if current user is Super Admin
        const user_data = await pool.query("SELECT role FROM admin WHERE username=$1", [currentUser])
        if (user_data.rows.length === 0) {
            await client.query("ROLLBACK")
            return res.status(404).json({
                success: false,
                message: "Authorization failed",
                error: "Current user not found in database"
            })
        }
        if (user_data.rows[0].role !== "Super Admin") {
            await client.query("ROLLBACK")
            return res.status(403).json({
                success: false,
                message: "Authorization failed",
                error: "Only Super Admin can create new admins"
            })
        }
        
        // Validate input
        if (!username || !password || !role) {
            await client.query("ROLLBACK")
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: "Username, password, and role are required"
            })
        }
        
        // Check if username already exists
        const existing_admin = await pool.query("SELECT username FROM admin WHERE username=$1", [username])
        if (existing_admin.rows.length > 0) {
            await client.query("ROLLBACK")
            return res.status(409).json({
                success: false,
                message: "Validation failed",
                error: "Username already exists"
            })
        }
        
        let event_id = null
        
        // Get event ID only for non-Super Admin roles
        if (role !== "Super Admin" && event) {
            const event_data = await pool.query("SELECT event_id FROM events WHERE event_name=$1", [event])
            if (event_data.rows.length === 0) {
                await client.query("ROLLBACK")
                return res.status(404).json({
                    success: false,
                    message: "Validation failed",
                    error: `Event '${event}' not found`
                })
            }
            event_id = event_data.rows[0].event_id
        }
        
        // Hash password
        const hash = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS, 10))
        
        // Create admin
        await pool.query(
            "INSERT INTO admin (username, password, role, event_id) VALUES ($1, $2, $3, $4)", 
            [username, hash, role, event_id]
        )
        
        await client.query("COMMIT")
        
        console.log(`[MAKE ADMIN] Successfully created admin: ${username} with role: ${role}`)
        
        return res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: {
                username: username,
                role: role,
                event: event || null,
                createdBy: currentUser
            }
        })
        
    } catch (err) {
        console.log("[MAKE ADMIN] Error:", err)
        await client.query("ROLLBACK")
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: "Failed to create admin due to server error"
        })
    } finally {
        client.release()
    }
}

module.exports = makeAdmins