const pool = require("../../config/db");

/**
 * Delete an admin account (Super Admin only)
 * Cannot delete Super Admin accounts or self
 */
const deleteAdmin = async (req, res) => {
    const client = await pool.connect();
    
    try {
        const { username } = req.body.user;
        const { targetAdminId } = req.body;
        
        console.log(`[DELETE ADMIN] Request from: ${username} to delete admin ID: ${targetAdminId}`);
        
        if (!targetAdminId) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: "Target admin ID is required"
            });
        }
        
        await client.query("BEGIN");
        
        // Verify the requester is a Super Admin
        const adminCheck = await client.query(
            "SELECT admin_id, role FROM admin WHERE username = $1",
            [username]
        );
        
        if (adminCheck.rows.length === 0) {
            await client.query("ROLLBACK");
            console.log(`[DELETE ADMIN] User not found: ${username}`);
            return res.status(404).json({
                success: false,
                message: "User not found",
                error: "User account does not exist"
            });
        }
        
        if (adminCheck.rows[0].role !== "Super Admin") {
            await client.query("ROLLBACK");
            console.log(`[DELETE ADMIN] Unauthorized access attempt by: ${username}`);
            return res.status(403).json({
                success: false,
                message: "Authorization failed",
                error: "Only Super Admin can delete admin accounts"
            });
        }
        
        const requesterId = adminCheck.rows[0].admin_id;
        
        // Check if trying to delete self
        if (requesterId.toString() === targetAdminId.toString()) {
            await client.query("ROLLBACK");
            console.log(`[DELETE ADMIN] User ${username} attempted to delete self`);
            return res.status(400).json({
                success: false,
                message: "Invalid operation",
                error: "Cannot delete your own account"
            });
        }
        
        // Get target admin details
        const targetAdmin = await client.query(
            "SELECT admin_id, username, role FROM admin WHERE admin_id = $1",
            [targetAdminId]
        );
        
        if (targetAdmin.rows.length === 0) {
            await client.query("ROLLBACK");
            console.log(`[DELETE ADMIN] Target admin not found: ${targetAdminId}`);
            return res.status(404).json({
                success: false,
                message: "Admin not found",
                error: `Admin with ID ${targetAdminId} does not exist`
            });
        }
        
        // Prevent deletion of Super Admin accounts
        if (targetAdmin.rows[0].role === "Super Admin") {
            await client.query("ROLLBACK");
            console.log(`[DELETE ADMIN] Attempted to delete Super Admin: ${targetAdminId}`);
            return res.status(403).json({
                success: false,
                message: "Operation forbidden",
                error: "Cannot delete Super Admin accounts"
            });
        }
        
        // Delete the admin
        await client.query(
            "DELETE FROM admin WHERE admin_id = $1",
            [targetAdminId]
        );
        
        await client.query("COMMIT");
        
        console.log(`[DELETE ADMIN] Successfully deleted admin: ${targetAdmin.rows[0].username} (ID: ${targetAdminId})`);
        
        return res.status(200).json({
            success: true,
            message: "Admin deleted successfully",
            data: {
                deletedAdminId: targetAdminId,
                deletedUsername: targetAdmin.rows[0].username,
                deletedBy: username
            }
        });
        
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("[DELETE ADMIN] Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: "Failed to delete admin"
        });
    } finally {
        client.release();
    }
};

module.exports = deleteAdmin;
