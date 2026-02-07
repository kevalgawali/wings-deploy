const pool = require("../../config/db");

const teamInsertionQuery = async (event, teamName, utr, leader, members) => {
    const client = await pool.connect();
    console.log("team insertion query")
    try {
        // Check if registration is open for this event
        const statusResult = await client.query(
            `SELECT registration_status FROM events WHERE event_name = $1`,
            [event]
        );
        if (statusResult.rows.length > 0 && statusResult.rows[0].registration_status === false) {
            throw new Error("REGISTRATION_CLOSED");
        }

        await client.query("BEGIN")
        // 1️⃣ Insert UTR
        const utrQuery = `INSERT INTO utr_number (utr) VALUES ($1) RETURNING utr_id`;
        const utrResult = await client.query(utrQuery, [utr]);
        if (utrResult.rows.length === 0) throw new Error("UTR insert failed");
        if (utrResult.rows.length === 0) throw new Error("UTR insert failed");
        const utr_id = utrResult.rows[0].utr_id;

        const eventResult = await client.query(
            `SELECT event_id FROM events WHERE event_name = $1`,
            [event]
        );

        if (eventResult.rows.length === 0) {
            throw new Error("Event not found");
        }
        const event_id = eventResult.rows[0].event_id;
        const insertQuery = `
                  INSERT INTO registrations
                            (leader_name, college, gender, branch, email, phone_no, event_id, utr_id,team_name)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9) RETURNING registration_id
                            `;

        const insertValues = [leader.name, leader.college, leader.gender, leader.branch, leader.email, leader.phone, event_id, utr_id, teamName];
        const result = await client.query(insertQuery, insertValues);
        if (result.rows.length === 0) throw new Error("Registration insert failed");
        const registration_id = result.rows[0].registration_id;
        let membersInsertionQuery = `INSERT INTO team_members(participant_name,gender,phone_no,team_id) values `;
        let memberNumber = 0
        let memberValues = []
        Object.keys(members).forEach(member => {
            membersInsertionQuery += `($${memberNumber + 1},$${memberNumber + 2},$${memberNumber + 3},$${memberNumber + 4}),`
            memberValues.push(members[member].name, members[member].gender, members[member].phone, registration_id)
            memberNumber += 4
        })
        membersInsertionQuery = membersInsertionQuery.slice(0, -1)
        await client.query(membersInsertionQuery, memberValues)
        await client.query('COMMIT');
        return registration_id
    } catch (error) {
        await client.query('ROLLBACK');
        console.log("[TEAM INSERTION ERROR]", error);
        
        if (error.message === "REGISTRATION_CLOSED") {
            throw new Error("REGISTRATION_CLOSED");
        }
        
        // Handle PostgreSQL unique constraint violations
        if (error.code === '23505') {
            const detail = error.detail || '';
            const constraint = error.constraint || '';
            
            // UTR number duplicate
            if (constraint.includes('utr') || detail.toLowerCase().includes('utr')) {
                throw new Error("DUPLICATE_UTR");
            }
            // Email duplicate
            if (constraint.includes('email') || detail.toLowerCase().includes('email')) {
                throw new Error("DUPLICATE_EMAIL");
            }
            // Phone number duplicate
            if (constraint.includes('phone') || detail.toLowerCase().includes('phone')) {
                throw new Error("DUPLICATE_PHONE");
            }
            // Team name duplicate
            if (constraint.includes('team_name') || detail.toLowerCase().includes('team_name')) {
                throw new Error("DUPLICATE_TEAM_NAME");
            }
            // Generic duplicate
            throw new Error("DUPLICATE_ENTRY");
        }
        
        // Handle foreign key violations
        if (error.code === '23503') {
            throw new Error("INVALID_REFERENCE");
        }
        
        // Handle check constraint violations
        if (error.code === '23514') {
            throw new Error("VALIDATION_ERROR");
        }
        
        throw new Error(`Team insertion failed: ${error.message}`)
    }
    finally {
        client.release()
    }
}

module.exports = teamInsertionQuery