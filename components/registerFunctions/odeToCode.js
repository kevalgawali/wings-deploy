const pool = require("../../config/db");
const { handleRegistrationError } = require("../../utils/errorHandler");

const odeToCode = async (req, res) => {
    const client = await pool.connect();
    try {
        const { name, college, gender, branch, email, phone, utr } = req.body;
        console.log("[ODE TO CODE] Registration request:", { name, college, gender, branch, email, phone, utr });
        
        // Check if registration is open for this event
        const statusResult = await client.query(
            `SELECT registration_status FROM events WHERE event_name = $1`,
            ["Ode To Code"]
        );
        if (statusResult.rows.length > 0 && statusResult.rows[0].registration_status === false) {
            return res.status(403).json({
                success: false,
                message: "Registration closed",
                error: "Registration for this event is currently closed by coordinators"
            });
        }

        if (!(name && college && gender && branch && phone && utr)) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: "All fields are required"
            });
        }
        if (typeof (name) != "string" || typeof (college) != "string" || typeof (gender) != "string" || typeof (branch) != "string" || typeof (phone) != "string" || typeof (utr) != "string") {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: "Invalid data type"
            });
        }
        if (utr.length !== 12) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: "UTR length should be exactly 12 characters"
            });
        }
        
        await client.query('BEGIN');
        
        // 1️⃣ Insert UTR
        const utrQuery = `INSERT INTO utr_number (utr) VALUES ($1) RETURNING utr_id`;
        const utrResult = await client.query(utrQuery, [utr]);
        if (utrResult.rows.length === 0) throw new Error("UTR insert failed");
        const utr_id = utrResult.rows[0].utr_id;

        // 2️⃣ Get event_id
        const eventResult = await client.query(
            `SELECT event_id FROM events WHERE event_name = $1`,
            ["Ode To Code"]
        );
        if (eventResult.rows.length === 0) throw new Error("Event not found");
        const event_id = eventResult.rows[0].event_id;

        // 3️⃣ Insert participant
        const insertQuery = `
            INSERT INTO registrations
            (leader_name, college, gender, branch, email, phone_no, event_id, utr_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING registration_id
        `;

        const insertValues = [name, college, gender, branch, email, phone, event_id, utr_id];
        const result = await client.query(insertQuery, insertValues);

        await client.query('COMMIT');
        res.status(201).json({ 
            success: true, 
            message: "Registration successful",
            data: {
                registrationId: result.rows[0].registration_id
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        handleRegistrationError(error, res, "Ode To Code");
    } finally {
        client.release();
    }
}

module.exports = odeToCode;