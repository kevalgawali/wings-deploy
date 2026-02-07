const pool = require("../../config/db")

const updatePayment = async (req, res) => {
    const client = await pool.connect()
    try {
        const { viewer_id, status } = req.body || {}
        const { username: currentUser } = req.body.user || {}

        if (!viewer_id || !status) {
            return res.status(400).json({ success: false, message: 'viewer_id and status are required' })
        }

        // Only allow users with role 'Viewers Admin' or 'Super Admin'
        const userRes = await pool.query('SELECT role FROM admin WHERE username=$1', [currentUser])
        if (userRes.rows.length === 0) {
            return res.status(403).json({ success: false, message: 'Unauthorized user' })
        }
        const role = userRes.rows[0].role
        if (!(role === 'Viewers Admin' || role === 'Super Admin')) {
            return res.status(403).json({ success: false, message: 'User does not have permission to update payments' })
        }

        await client.query('BEGIN')

        // Get the utr_id for this viewer
        const viewerRes = await client.query('SELECT utr_id, registration_id FROM viewer_registrations WHERE id = $1', [viewer_id])
        if (viewerRes.rows.length === 0) {
            await client.query('ROLLBACK')
            return res.status(404).json({ success: false, message: 'Viewer registration not found' })
        }

        const utrId = viewerRes.rows[0].utr_id
        if (!utrId) {
            await client.query('ROLLBACK')
            return res.status(400).json({ success: false, message: 'No UTR number linked to this viewer' })
        }

        // Update utr_number.status (true = paid, false = pending)
        const newStatus = status === 'done'
        await client.query('UPDATE utr_number SET status = $1 WHERE utr_id = $2', [newStatus, utrId])

        await client.query('COMMIT')

        return res.status(200).json({
            success: true,
            message: `Payment status updated to '${status === 'done' ? 'done' : 'pending'}'`,
            data: { registration_id: viewerRes.rows[0].registration_id, id: viewer_id, payment_status: status === 'done' ? 'done' : 'pending' }
        })
    } catch (error) {
        console.error('[UPDATE PAYMENT] Error:', error)
        await client.query('ROLLBACK')
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message })
    } finally {
        client.release()
    }
}

module.exports = updatePayment
