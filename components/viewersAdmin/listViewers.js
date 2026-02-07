const pool = require("../../config/db")

const listViewers = async (req, res) => {
    try {
        const { status } = req.body || {} // status: 'all' | 'paid' | 'pending'

        let whereClause = ''

        if (status === 'paid') {
            whereClause = "WHERE u.status = true"
        } else if (status === 'pending') {
            whereClause = "WHERE u.status = false OR u.status IS NULL"
        }

        const query = `
            SELECT 
                vr.id,
                vr.registration_id,
                vr.name,
                vr.college_name,
                u.utr as utr_number,
                u.status as payment_verified,
                vr.created_at
            FROM viewer_registrations vr
            LEFT JOIN utr_number u ON vr.utr_id = u.utr_id
            ${whereClause}
            ORDER BY vr.created_at DESC
        `

        const result = await pool.query(query)

        // Map to frontend format
        const viewers = result.rows.map(row => ({
            id: row.id.toString(),
            registrationId: row.id.toString(),
            name: row.name,
            collegeName: row.college_name,
            utrNumber: row.utr_number || '',
            paymentStatus: row.payment_verified === true ? 'done' : 'pending',
            createdAt: row.created_at
        }))

        return res.status(200).json({
            success: true,
            data: viewers
        })
    } catch (error) {
        console.error("[LIST VIEWERS] Error:", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

module.exports = listViewers
