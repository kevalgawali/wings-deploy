const pool = require("../../config/db");

/**
 * Get all events list (for admin creation dropdown)
 */
const getEvents = async (req, res) => {
    try {
        const { username } = req.body.user;
        
        console.log(`[GET EVENTS] Request from user: ${username}`);
        
        // Get all events
        const eventsQuery = await pool.query(`
            SELECT event_id, event_name, is_team_event
            FROM events
            ORDER BY event_name ASC
        `);
        
        console.log(`[GET EVENTS] Found ${eventsQuery.rows.length} events`);
        
        const eventsList = eventsQuery.rows.map(event => ({
            id: event.event_id.toString(),
            name: event.event_name,
            isTeamEvent: event.is_team_event
        }));
        
        return res.status(200).json({
            success: true,
            message: "Events retrieved successfully",
            data: eventsList
        });
        
    } catch (error) {
        console.error("[GET EVENTS] Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: "Failed to retrieve events"
        });
    }
};

module.exports = getEvents;
