const pool = require("../../config/db")

// Returns stats for viewers admin. 'paidRegistrations' counts only verified paid viewers (utr_number.status = true).
const getViewerStats = async (req, res) => {
    try {
        // Get paid registrations count (only verified - utr_number.status = true)
        const paidResult = await pool.query(`
            SELECT COUNT(*) as paid 
            FROM viewer_registrations vr
            JOIN utr_number u ON vr.utr_id = u.utr_id
            WHERE u.status = true
        `)
        const paidRegistrations = parseInt(paidResult.rows[0].paid, 10) || 0

        return res.status(200).json({
            success: true,
            data: {
                paidRegistrations
            }
        })
    } catch (error) {
        console.error("[VIEWER STATS] Error:", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

module.exports = getViewerStats
