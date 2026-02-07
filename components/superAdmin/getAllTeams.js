const pool = require("../../config/db");

/**
 * Get all teams across all events (Super Admin only)
 * Returns summary of all registrations with payment status
 */
const getAllTeams = async (req, res) => {
    try {
        const { username } = req.body.user;
        
        console.log(`[GET ALL TEAMS] Request from user: ${username}`);
        
        // Verify the requester is a Super Admin
        const adminCheck = await pool.query(
            "SELECT role FROM admin WHERE username = $1",
            [username]
        );
        
        if (adminCheck.rows.length === 0) {
            console.log(`[GET ALL TEAMS] User not found: ${username}`);
            return res.status(404).json({
                success: false,
                message: "User not found",
                error: "User account does not exist"
            });
        }
        
        if (adminCheck.rows[0].role !== "Super Admin") {
            console.log(`[GET ALL TEAMS] Unauthorized access attempt by: ${username}`);
            return res.status(403).json({
                success: false,
                message: "Authorization failed",
                error: "Only Super Admin can view all teams"
            });
        }
        
        // Get all registrations with UTR status grouped by event
        const statsQuery = await pool.query(`
            SELECT 
                e.event_id,
                e.event_name,
                COUNT(r.registration_id) as total_teams,
                COUNT(CASE WHEN u.status = true THEN 1 END) as verified_teams,
                COUNT(CASE WHEN u.status = false THEN 1 END) as pending_teams
            FROM events e
            LEFT JOIN registrations r ON e.event_id = r.event_id
            LEFT JOIN utr_number u ON r.utr_id = u.utr_id
            GROUP BY e.event_id, e.event_name
            ORDER BY e.event_name ASC
        `);
        
        // Get total participant count (leaders + members)
        const participantsQuery = await pool.query(`
            SELECT 
                e.event_id,
                COUNT(DISTINCT r.registration_id) as leaders,
                COUNT(tm.participant_id) as members
            FROM events e
            LEFT JOIN registrations r ON e.event_id = r.event_id
            LEFT JOIN team_members tm ON r.registration_id = tm.team_id
            GROUP BY e.event_id
        `);
        
        const participantsMap = {};
        participantsQuery.rows.forEach(row => {
            participantsMap[row.event_id] = parseInt(row.leaders || 0) + parseInt(row.members || 0);
        });
        
        const eventStats = statsQuery.rows.map(event => ({
            eventId: event.event_id.toString(),
            eventName: event.event_name,
            totalTeams: parseInt(event.total_teams || 0),
            verifiedTeams: parseInt(event.verified_teams || 0),
            pendingTeams: parseInt(event.pending_teams || 0),
            totalParticipants: participantsMap[event.event_id] || 0
        }));
        
        // Calculate overall stats
        const overallStats = {
            totalEvents: eventStats.length,
            totalTeams: eventStats.reduce((sum, e) => sum + e.totalTeams, 0),
            totalVerified: eventStats.reduce((sum, e) => sum + e.verifiedTeams, 0),
            totalPending: eventStats.reduce((sum, e) => sum + e.pendingTeams, 0),
            totalParticipants: eventStats.reduce((sum, e) => sum + e.totalParticipants, 0)
        };
        
        console.log(`[GET ALL TEAMS] Retrieved stats for ${eventStats.length} events`);
        
        return res.status(200).json({
            success: true,
            message: "All teams statistics retrieved successfully",
            data: {
                overall: overallStats,
                events: eventStats
            }
        });
        
    } catch (error) {
        console.error("[GET ALL TEAMS] Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: "Failed to retrieve teams statistics"
        });
    }
};

module.exports = getAllTeams;
