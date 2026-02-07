const pool = require("../../config/db");

/**
 * Get detailed information about a specific team
 * Includes leader details and all team members
 */
const getTeamDetails = async (req, res) => {
    try {
        const { username } = req.body.user;
        const { team_id } = req.body;
        
        console.log(`[TEAM DETAILS] Request from admin: ${username} for team: ${team_id}`);
        
        if (!team_id) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: "Team ID is required"
            });
        }
        
        // Get the admin's event_id
        const adminQuery = await pool.query(
            "SELECT event_id FROM admin WHERE username = $1",
            [username]
        );
        
        if (adminQuery.rows.length === 0) {
            console.log(`[TEAM DETAILS] Admin not found: ${username}`);
            return res.status(404).json({
                success: false,
                message: "Admin not found",
                error: "Admin account does not exist"
            });
        }
        
        const admin_event_id = adminQuery.rows[0].event_id;
        
        // Get team details with verification that it belongs to admin's event
        const teamQuery = await pool.query(`
            SELECT 
                r.registration_id,
                r.team_name,
                r.leader_name,
                r.email,
                r.phone_no,
                r.gender,
                r.college,
                r.branch,
                r.event_id,
                u.utr,
                u.status as payment_status,
                e.event_name
            FROM registrations r
            JOIN utr_number u ON r.utr_id = u.utr_id
            JOIN events e ON r.event_id = e.event_id
            WHERE r.registration_id = $1
        `, [team_id]);
        
        if (teamQuery.rows.length === 0) {
            console.log(`[TEAM DETAILS] Team not found: ${team_id}`);
            return res.status(404).json({
                success: false,
                message: "Team not found",
                error: `Team with ID ${team_id} does not exist`
            });
        }
        
        const team = teamQuery.rows[0];
        
        // Verify admin has access to this team's event
        if (admin_event_id && team.event_id !== admin_event_id) {
            console.log(`[TEAM DETAILS] Admin ${username} not authorized for team ${team_id}`);
            return res.status(403).json({
                success: false,
                message: "Access denied",
                error: "You do not have permission to view this team"
            });
        }
        
        // Get team members
        const membersQuery = await pool.query(`
            SELECT 
                participant_id,
                participant_name,
                gender,
                phone_no
            FROM team_members
            WHERE team_id = $1
        `, [team_id]);
        
        const teamDetails = {
            id: team.registration_id.toString(),
            teamName: team.team_name || `Team ${team.registration_id}`,
            leaderName: team.leader_name,
            leaderEmail: team.email,
            leaderPhone: team.phone_no,
            leaderGender: team.gender === 'M' ? 'Male' : team.gender === 'F' ? 'Female' : 'Other',
            college: team.college,
            branch: team.branch,
            utrNumber: team.utr,
            paymentStatus: team.payment_status ? 'done' : 'pending',
            eventId: team.event_id.toString(),
            eventName: team.event_name,
            registrationDate: new Date().toISOString().split('T')[0],
            members: membersQuery.rows.map(m => ({
                id: m.participant_id.toString(),
                name: m.participant_name,
                gender: m.gender === 'M' ? 'Male' : m.gender === 'F' ? 'Female' : 'Other',
                phone: m.phone_no
            }))
        };
        
        console.log(`[TEAM DETAILS] Successfully retrieved details for team: ${team_id}`);
        
        return res.status(200).json({
            success: true,
            message: "Team details retrieved successfully",
            data: teamDetails
        });
        
    } catch (error) {
        console.error("[TEAM DETAILS] Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: "Failed to retrieve team details"
        });
    }
};

module.exports = getTeamDetails;
