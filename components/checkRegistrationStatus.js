const pool = require("../config/db")

// Get registration status for an event by event name/slug (public endpoint)
const checkEventRegistrationStatus = async (req, res) => {
    try {
        const { event_name } = req.body

        if (!event_name) {
            return res.status(400).json({ success: false, message: "event_name is required" })
        }

        // Map event slugs to database event names
        const eventNameMap = {
            'ode-to-code': 'Ode To Code',
            'doctor-fix-it': 'Doctor Fix It',
            'code-vibes': 'Code Vibes',
            'room-404': 'Room 404',
            'dronix': 'Dronix',
            'innovex': 'Innovex',
            'robo-race': 'Robo Race',
            'line-follower': 'Line Follower',
            'robo-soccer': 'Robo Soccer',
            'robo-sumo': 'Robo Sumo',
            'e-arena-championship-bgmi': 'E Arena Championship (BGMI)',
            'e-arena-championship-free-fire': 'E Arena Championship (Free Fire)',
            'cad-clash': 'Cade Clash',
            'mechathon': 'Mechathon',
            'bridge-it': 'Bridge It',
            'quiz-o-mania': 'Quiz O Mania'
        }

        const dbEventName = eventNameMap[event_name.toLowerCase()] || event_name

        const result = await pool.query(
            "SELECT event_id, event_name, registration_status FROM events WHERE LOWER(event_name) = LOWER($1)",
            [dbEventName]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Event not found" })
        }

        return res.status(200).json({
            success: true,
            data: {
                event_id: result.rows[0].event_id,
                event_name: result.rows[0].event_name,
                registration_open: result.rows[0].registration_status
            }
        })
    } catch (error) {
        console.error("[CHECK EVENT REGISTRATION STATUS] Error:", error)
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message })
    }
}

// Get viewer registration status (public endpoint)
const checkViewerRegistrationStatus = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT setting_value FROM settings WHERE setting_key = 'viewer_registration_status'"
        )

        // Default to 'open' if setting doesn't exist
        const status = result.rows.length > 0 ? result.rows[0].setting_value : 'open'

        return res.status(200).json({
            success: true,
            data: {
                registration_open: status === 'open'
            }
        })
    } catch (error) {
        console.error("[CHECK VIEWER REGISTRATION STATUS] Error:", error)
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message })
    }
}

module.exports = { checkEventRegistrationStatus, checkViewerRegistrationStatus }
