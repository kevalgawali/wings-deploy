const pool = require("../../config/db")

// Get registration status for an event
const getRegistrationStatus = async (req, res) => {
    try {
        const { event_id } = req.body

        if (!event_id) {
            return res.status(400).json({ success: false, message: "event_id is required" })
        }

        const result = await pool.query(
            "SELECT registration_status FROM events WHERE event_id = $1",
            [event_id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Event not found" })
        }

        return res.status(200).json({
            success: true,
            data: {
                registration_status: result.rows[0].registration_status
            }
        })
    } catch (error) {
        console.error("[GET REGISTRATION STATUS] Error:", error)
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message })
    }
}

// Toggle registration status for an event (admin only)
const toggleRegistrationStatus = async (req, res) => {
    try {
        const { event_id, status } = req.body

        if (event_id === undefined || status === undefined) {
            return res.status(400).json({ success: false, message: "event_id and status are required" })
        }

        const result = await pool.query(
            "UPDATE events SET registration_status = $1 WHERE event_id = $2 RETURNING event_id, event_name, registration_status",
            [status, event_id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Event not found" })
        }

        return res.status(200).json({
            success: true,
            message: `Registration ${status ? 'opened' : 'closed'} for ${result.rows[0].event_name}`,
            data: result.rows[0]
        })
    } catch (error) {
        console.error("[TOGGLE REGISTRATION STATUS] Error:", error)
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message })
    }
}

module.exports = { getRegistrationStatus, toggleRegistrationStatus }
