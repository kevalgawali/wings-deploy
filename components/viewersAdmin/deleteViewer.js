const pool = require("../../config/db")

const deleteViewer = async (req, res) => {
    const client = await pool.connect()
    try {
        const { viewer_id } = req.body

        if (!viewer_id) {
            return res.status(400).json({
                success: false,
                message: "Viewer ID is required"
            })
        }

        await client.query('BEGIN')

        // Check if viewer exists and get the utr_id
        const existingViewer = await client.query(
            "SELECT id, utr_id FROM viewer_registrations WHERE id = $1",
            [viewer_id]
        )

        if (existingViewer.rows.length === 0) {
            await client.query('ROLLBACK')
            return res.status(404).json({
                success: false,
                message: "Viewer registration not found"
            })
        }

        const utrId = existingViewer.rows[0].utr_id

        // Delete the viewer registration first (due to foreign key)
        await client.query("DELETE FROM viewer_registrations WHERE id = $1", [viewer_id])

        // Delete the associated utr_number record if it exists
        if (utrId) {
            await client.query("DELETE FROM utr_number WHERE utr_id = $1", [utrId])
        }

        await client.query('COMMIT')

        console.log(`[DELETE VIEWER] Successfully deleted viewer ID: ${viewer_id}`)

        return res.status(200).json({
            success: true,
            message: "Viewer registration deleted successfully"
        })
    } catch (error) {
        await client.query('ROLLBACK')
        console.error("[DELETE VIEWER] Error:", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    } finally {
        client.release()
    }
}

module.exports = deleteViewer
