const pool = require("../../config/db");

// Solo events that don't have team members
const SOLO_EVENTS = ['Ode To Code', 'Doctor Fix It'];

const adminDashboard = async(req, res) => {
    try {
        const { username } = req.body.user;
        
        console.log(`[ADMIN DASHBOARD] Request from: ${username}`);
        
        const event = await pool.query(
            "SELECT event_id, event_name FROM events WHERE event_id = (SELECT event_id FROM admin WHERE username = $1)", 
            [username]
        );
        
        if (event.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
                error: "No event assigned to this admin"
            });
        }
        
        const event_id = event.rows[0].event_id;
        const event_name = event.rows[0].event_name;
        const isSoloEvent = SOLO_EVENTS.includes(event_name);
        
        // Get total registrations
        const totalTeamsResult = await pool.query(
            "SELECT COUNT(*) FROM registrations WHERE event_id = $1",
            [event_id]
        );
        const totalTeams = parseInt(totalTeamsResult.rows[0].count) || 0;
        
        // Get verified registrations count
        const verifiedTeamsResult = await pool.query(
            "SELECT COUNT(*) FROM utr_number WHERE status = true AND utr_id IN (SELECT utr_id FROM registrations WHERE event_id = $1)",
            [event_id]
        );
        const verifiedTeams = parseInt(verifiedTeamsResult.rows[0].count) || 0;
        
        let totalParticipants = 0;
        
        if (isSoloEvent) {
            // For solo events, verified participants = verified registrations (1 person per registration)
            totalParticipants = verifiedTeams;
        } else {
            // For team events, count only participants from verified teams
            // Get verified registration IDs
            const verifiedRegistrationsResult = await pool.query(`
                SELECT r.registration_id 
                FROM registrations r
                JOIN utr_number u ON r.utr_id = u.utr_id
                WHERE r.event_id = $1 AND u.status = true
            `, [event_id]);
            
            const verifiedRegIds = verifiedRegistrationsResult.rows.map(r => r.registration_id);
            
            if (verifiedRegIds.length > 0) {
                // Count team members from verified teams
                const membersResult = await pool.query(
                    "SELECT COUNT(*) FROM team_members WHERE team_id = ANY($1)",
                    [verifiedRegIds]
                );
                const verifiedMembers = parseInt(membersResult.rows[0].count) || 0;
                // Total participants = verified leaders + verified members
                totalParticipants = verifiedTeams + verifiedMembers;
            }
        }
        
        console.log(`[ADMIN DASHBOARD] Event: ${event_name}, Solo: ${isSoloEvent}, Total: ${totalTeams}, Verified: ${verifiedTeams}, Participants: ${totalParticipants}`);
        
        const result = {
            eventName: event_name,
            eventId: event_id,
            totalConfirmedTeamsCount: verifiedTeams,
            totalParticipantsCount: totalParticipants,
            totalTeams: totalTeams,
            pendingPayments: totalTeams - verifiedTeams,
            paymentVerifiedTeams: verifiedTeams,
            isSoloEvent: isSoloEvent
        };
        
        res.json({ success: true, data: result });
    } catch (error) {
        console.error("[ADMIN DASHBOARD] Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: "Failed to fetch dashboard data"
        });
    }
}

module.exports = adminDashboard;