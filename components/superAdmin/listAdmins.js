const pool = require("../../config/db");

/**
 * List all admin accounts (Super Admin only)
 * Returns admin details including their assigned events
 */
const listAdmins = async (req, res) => {
    try {
        const { username } = req.body.user;
        
        console.log(`[LIST ADMINS] Request from user: ${username}`);
        
        // Verify the requester is a Super Admin
        const adminCheck = await pool.query(
            "SELECT role FROM admin WHERE username = $1",
            [username]
        );
        
        if (adminCheck.rows.length === 0) {
            console.log(`[LIST ADMINS] User not found: ${username}`);
            return res.status(404).json({
                success: false,
                message: "User not found",
                error: "User account does not exist"
            });
        }
        
        if (adminCheck.rows[0].role !== "Super Admin") {
            console.log(`[LIST ADMINS] Unauthorized access attempt by: ${username}`);
            return res.status(403).json({
                success: false,
                message: "Authorization failed",
                error: "Only Super Admin can view admin list"
            });
        }
        
        // Get all admins with their event assignments
        const adminsQuery = await pool.query(`
            SELECT 
                a.admin_id,
                a.username,
                a.role,
                a.event_id,
                e.event_name
            FROM admin a
            LEFT JOIN events e ON a.event_id = e.event_id
            ORDER BY a.admin_id ASC
        `);
        
        console.log(`[LIST ADMINS] Found ${adminsQuery.rows.length} admin accounts`);
        
        const adminsList = adminsQuery.rows.map(admin => ({
            id: admin.admin_id.toString(),
            name: admin.username,
            email: admin.username,
            role: admin.role === "Super Admin" ? "super_admin" : "admin",
            isActive: true, // Default to active (can add is_active column to schema if needed)
            createdAt: new Date().toISOString().split('T')[0],
            eventId: admin.event_id?.toString() || null,
            eventName: admin.event_name || null
        }));
        
        console.log(`[LIST ADMINS] Successfully retrieved admin list`);
        
        return res.status(200).json({
            success: true,
            message: "Admin list retrieved successfully",
            data: adminsList
        });
        
    } catch (error) {
        console.error("[LIST ADMINS] Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: "Failed to retrieve admin list"
        });
    }
};

module.exports = listAdmins;
