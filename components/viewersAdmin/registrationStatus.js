const pool = require("../../config/db")

// Get viewer registration status (public)
const getViewerRegistrationStatus = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT setting_value FROM settings WHERE setting_key = 'viewer_registration_status'"
        )

        // Default to 'open' if setting doesn't exist
        const status = result.rows.length > 0 ? result.rows[0].setting_value : 'open'

        return res.status(200).json({
            success: true,
            data: {
                registration_status: status === 'open'
            }
        })
    } catch (error) {
        console.error("[GET VIEWER REGISTRATION STATUS] Error:", error)
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message })
    }
}

// Toggle viewer registration status (admin only)
const toggleViewerRegistrationStatus = async (req, res) => {
    try {
        const { status } = req.body

        if (status === undefined) {
            return res.status(400).json({ success: false, message: "status is required" })
        }

        const newStatus = status ? 'open' : 'closed'

        // Upsert the setting
        const result = await pool.query(`
            INSERT INTO settings (setting_key, setting_value, updated_at) 
            VALUES ('viewer_registration_status', $1, NOW())
            ON CONFLICT (setting_key) 
            DO UPDATE SET setting_value = $1, updated_at = NOW()
            RETURNING setting_value
        `, [newStatus])

        return res.status(200).json({
            success: true,
            message: `Viewer registration ${status ? 'opened' : 'closed'}`,
            data: {
                registration_status: result.rows[0].setting_value === 'open'
            }
        })
    } catch (error) {
        console.error("[TOGGLE VIEWER REGISTRATION STATUS] Error:", error)
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message })
    }
}

module.exports = { getViewerRegistrationStatus, toggleViewerRegistrationStatus }
