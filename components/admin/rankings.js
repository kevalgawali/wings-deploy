const pool = require("../../config/db");

// Get all verified teams for ranking (only teams with verified payments can be ranked)
const getTeamsForRanking = async (req, res) => {
    try {
        const { username } = req.body.user;

        // Get admin's event
        const eventResult = await pool.query(
            "SELECT event_id, event_name FROM events WHERE event_id = (SELECT event_id FROM admin WHERE username = $1)",
            [username]
        );

        if (eventResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        const event_id = eventResult.rows[0].event_id;
        const event_name = eventResult.rows[0].event_name;

        // Solo events
        const SOLO_EVENTS = ['Ode To Code', 'Doctor Fix It'];
        const isSoloEvent = SOLO_EVENTS.includes(event_name);

        // Get verified teams/participants with their current rank
        const teamsResult = await pool.query(`
            SELECT 
                r.registration_id,
                r.team_name,
                r.leader_name,
                r.college,
                r.email,
                r.rank
            FROM registrations r
            JOIN utr_number u ON r.utr_id = u.utr_id
            WHERE r.event_id = $1 AND u.status = true
            ORDER BY 
                CASE WHEN r.rank IS NULL THEN 1 ELSE 0 END,
                r.rank ASC,
                r.registration_id ASC
        `, [event_id]);

        const teams = teamsResult.rows.map(row => ({
            id: row.registration_id.toString(),
            teamName: isSoloEvent ? row.leader_name : (row.team_name || row.leader_name),
            participantName: row.leader_name,
            college: row.college,
            email: row.email,
            rank: row.rank
        }));

        res.json({
            success: true,
            data: {
                eventName: event_name,
                isSoloEvent,
                teams
            }
        });

    } catch (error) {
        console.error("[RANKINGS] Get teams error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch teams for ranking"
        });
    }
};

// Assign rank to a team
const assignRank = async (req, res) => {
    try {
        const { username } = req.body.user;
        const { registration_id, rank } = req.body;

        if (!registration_id || rank === undefined || rank === null) {
            return res.status(400).json({
                success: false,
                message: "Registration ID and rank are required"
            });
        }

        // Validate rank (must be positive integer or null to remove)
        if (rank !== null && (typeof rank !== 'number' || rank < 1 || !Number.isInteger(rank))) {
            return res.status(400).json({
                success: false,
                message: "Rank must be a positive integer"
            });
        }

        // Get admin's event
        const eventResult = await pool.query(
            "SELECT event_id FROM admin WHERE username = $1",
            [username]
        );

        if (eventResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        const event_id = eventResult.rows[0].event_id;

        // Verify the registration belongs to admin's event and has verified payment
        const verifyResult = await pool.query(`
            SELECT r.registration_id 
            FROM registrations r
            JOIN utr_number u ON r.utr_id = u.utr_id
            WHERE r.registration_id = $1 AND r.event_id = $2 AND u.status = true
        `, [registration_id, event_id]);

        if (verifyResult.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: "Registration not found or not authorized"
            });
        }

        // Check if the rank is already assigned to another team (if rank is not null)
        if (rank !== null) {
            const existingRankResult = await pool.query(`
                SELECT registration_id, team_name, leader_name 
                FROM registrations 
                WHERE event_id = $1 AND rank = $2 AND registration_id != $3
            `, [event_id, rank, registration_id]);

            if (existingRankResult.rows.length > 0) {
                const existingTeam = existingRankResult.rows[0];
                return res.status(409).json({
                    success: false,
                    message: `Rank ${rank} is already assigned to "${existingTeam.team_name || existingTeam.leader_name}"`,
                    existingTeam: {
                        id: existingTeam.registration_id,
                        name: existingTeam.team_name || existingTeam.leader_name
                    }
                });
            }
        }

        // Update the rank
        await pool.query(
            "UPDATE registrations SET rank = $1 WHERE registration_id = $2",
            [rank, registration_id]
        );

        res.json({
            success: true,
            message: rank !== null ? `Rank ${rank} assigned successfully` : "Rank removed successfully"
        });

    } catch (error) {
        console.error("[RANKINGS] Assign rank error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to assign rank"
        });
    }
};

// Get rankings leaderboard
const getRankings = async (req, res) => {
    try {
        const { username } = req.body.user;

        // Get admin's event
        const eventResult = await pool.query(
            "SELECT event_id, event_name FROM events WHERE event_id = (SELECT event_id FROM admin WHERE username = $1)",
            [username]
        );

        if (eventResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        const event_id = eventResult.rows[0].event_id;
        const event_name = eventResult.rows[0].event_name;

        const SOLO_EVENTS = ['Ode To Code', 'Doctor Fix It'];
        const isSoloEvent = SOLO_EVENTS.includes(event_name);

        // Get ranked teams only
        const rankingsResult = await pool.query(`
            SELECT 
                r.registration_id,
                r.team_name,
                r.leader_name,
                r.college,
                r.rank
            FROM registrations r
            JOIN utr_number u ON r.utr_id = u.utr_id
            WHERE r.event_id = $1 AND u.status = true AND r.rank IS NOT NULL
            ORDER BY r.rank ASC
        `, [event_id]);

        const rankings = rankingsResult.rows.map(row => ({
            id: row.registration_id.toString(),
            teamName: isSoloEvent ? row.leader_name : (row.team_name || row.leader_name),
            participantName: row.leader_name,
            college: row.college,
            rank: row.rank
        }));

        res.json({
            success: true,
            data: {
                eventName: event_name,
                isSoloEvent,
                rankings
            }
        });

    } catch (error) {
        console.error("[RANKINGS] Get rankings error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch rankings"
        });
    }
};

module.exports = {
    getTeamsForRanking,
    assignRank,
    getRankings
};
