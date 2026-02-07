const pool = require("../../config/db");

// Solo events that don't have team members
const SOLO_EVENTS = ['Ode To Code', 'Doctor Fix It'];

/**
 * List all teams/participants registered for the admin's event
 * Returns teams with their payment status and member details
 * For solo events, returns participant data instead of team data
 */
const listTeams = async (req, res) => {
    try {
        const { username } = req.body.user;
        
        console.log(`[LIST TEAMS] Request from admin: ${username}`);
        
        // Get the admin's event_id
        const adminQuery = await pool.query(
            "SELECT event_id FROM admin WHERE username = $1",
            [username]
        );
        
        if (adminQuery.rows.length === 0) {
            console.log(`[LIST TEAMS] Admin not found: ${username}`);
            return res.status(404).json({
                success: false,
                message: "Admin not found",
                error: "Admin account does not exist"
            });
        }
        
        const event_id = adminQuery.rows[0].event_id;
        
        if (!event_id) {
            console.log(`[LIST TEAMS] Admin ${username} has no event assigned`);
            return res.status(403).json({
                success: false,
                message: "Access denied",
                error: "No event assigned to this admin"
            });
        }
        
        // Get event name
        const eventQuery = await pool.query(
            "SELECT event_name FROM events WHERE event_id = $1",
            [event_id]
        );
        
        const eventName = eventQuery.rows[0]?.event_name || "Unknown Event";
        const isSoloEvent = SOLO_EVENTS.includes(eventName);
        
        // Get all registrations for this event with UTR status
        const teamsQuery = await pool.query(`
            SELECT 
                r.registration_id,
                r.team_name,
                r.leader_name,
                r.email,
                r.phone_no,
                r.gender,
                r.college,
                r.branch,
                u.utr,
                u.status as payment_status,
                e.event_name
            FROM registrations r
            JOIN utr_number u ON r.utr_id = u.utr_id
            JOIN events e ON r.event_id = e.event_id
            WHERE r.event_id = $1
            ORDER BY r.registration_id DESC
        `, [event_id]);
        
        console.log(`[LIST TEAMS] Found ${teamsQuery.rows.length} ${isSoloEvent ? 'participants' : 'teams'} for event ${eventName}`);
        
        let responseData;
        
        if (isSoloEvent) {
            // For solo events, return participant data (no team members)
            responseData = teamsQuery.rows.map(participant => ({
                id: participant.registration_id.toString(),
                registrationId: participant.registration_id.toString(),
                // For solo events, use participant name instead of team name
                participantName: participant.leader_name,
                teamName: participant.leader_name, // Keep for backward compatibility
                leaderName: participant.leader_name,
                leaderEmail: participant.email,
                leaderPhone: participant.phone_no,
                leaderGender: participant.gender === 'M' ? 'Male' : participant.gender === 'F' ? 'Female' : 'Other',
                email: participant.email,
                phone: participant.phone_no,
                gender: participant.gender === 'M' ? 'Male' : participant.gender === 'F' ? 'Female' : 'Other',
                college: participant.college,
                branch: participant.branch,
                utrNumber: participant.utr,
                paymentStatus: participant.payment_status ? 'done' : 'pending',
                eventId: event_id.toString(),
                eventName: participant.event_name,
                registrationDate: new Date().toISOString().split('T')[0],
                isSoloEvent: true,
                members: [] // No team members for solo events
            }));
        } else {
            // For team events, get team members for each registration
            responseData = await Promise.all(
                teamsQuery.rows.map(async (team) => {
                    const membersQuery = await pool.query(`
                        SELECT 
                            participant_id,
                            participant_name,
                            gender,
                            phone_no
                        FROM team_members
                        WHERE team_id = $1
                    `, [team.registration_id]);
                    
                    return {
                        id: team.registration_id.toString(),
                        registrationId: team.registration_id.toString(),
                        teamName: team.team_name || `Team ${team.registration_id}`,
                        leaderName: team.leader_name,
                        leaderEmail: team.email,
                        leaderPhone: team.phone_no,
                        leaderGender: team.gender === 'M' ? 'Male' : team.gender === 'F' ? 'Female' : 'Other',
                        college: team.college,
                        branch: team.branch,
                        utrNumber: team.utr,
                        paymentStatus: team.payment_status ? 'done' : 'pending',
                        eventId: event_id.toString(),
                        eventName: team.event_name,
                        registrationDate: new Date().toISOString().split('T')[0],
                        isSoloEvent: false,
                        members: membersQuery.rows.map(m => ({
                            id: m.participant_id.toString(),
                            name: m.participant_name,
                            gender: m.gender === 'M' ? 'Male' : m.gender === 'F' ? 'Female' : 'Other',
                            phone: m.phone_no
                        }))
                    };
                })
            );
        }
        
        console.log(`[LIST TEAMS] Successfully retrieved ${responseData.length} ${isSoloEvent ? 'participants' : 'teams'}`);
        
        return res.status(200).json({
            success: true,
            message: isSoloEvent ? "Participants retrieved successfully" : "Teams retrieved successfully",
            data: responseData,
            isSoloEvent: isSoloEvent
        });
        
    } catch (error) {
        console.error("[LIST TEAMS] Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: "Failed to retrieve teams"
        });
    }
};

module.exports = listTeams;
