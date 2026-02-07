const pool = require("../../config/db");

const paymentStatusUpdate = async (req, res) => {
    const client = await pool.connect();
    try {
        const {username} = req.body.user;
        const { registration_id, status } = req.body;
        
        if (registration_id === undefined || status === undefined) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: "registration_id and status are required"
            });
        }
        
        await client.query("BEGIN");
        console.log(`[PAYMENT UPDATE] Admin: ${username}, Registration: ${registration_id}, Status: ${status}`);
        
        const event_id = await client.query("SELECT event_id FROM admin WHERE username = $1", [username]);
        if(event_id.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({
                success: false,
                message: "Admin not found",
                error: "Admin account does not exist"
            });
        }
        if(!event_id.rows[0].event_id) {
            await client.query("ROLLBACK");
            return res.status(403).json({
                success: false,
                message: "Access denied",
                error: "Admin cannot access this registration"
            });
        }
        
        const update_utr = await client.query(
            "UPDATE utr_number SET status = $1 WHERE utr_id=(SELECT utr_id FROM registrations WHERE event_id=$2 AND registration_id=$3) RETURNING status", 
            [status, event_id.rows[0].event_id, registration_id]
        );
        
        if(update_utr.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({
                success: false,
                message: "Registration not found",
                error: "UTR not found for this registration"
            });
        }
        
        await client.query("COMMIT");
        res.json({
            success: true,
            message: "Payment status updated successfully", 
            status: update_utr.rows[0].status
        });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("[PAYMENT UPDATE] Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: "Failed to update payment status"
        });
    } finally {
        client.release();
    }
}

module.exports = paymentStatusUpdate;