const pool = require('../config/db');

/**
 * Check if registration is open for a specific event
 * @param {string} eventName - The event name exactly as stored in database
 * @returns {Promise<boolean>} - Returns true if registration is open, false otherwise
 */
const checkEventRegistrationOpen = async (eventName) => {
    try {
        const result = await pool.query(
            'SELECT registration_status FROM events WHERE name = $1',
            [eventName]
        );
        
        // If event not found, default to open
        if (result.rows.length === 0) {
            console.log(`[REGISTRATION CHECK] Event "${eventName}" not found in database, defaulting to open`);
            return true;
        }
        
        return result.rows[0].registration_status === true;
    } catch (error) {
        console.error('[REGISTRATION CHECK] Error checking registration status:', error);
        // Default to open on error to prevent blocking registrations
        return true;
    }
};

module.exports = checkEventRegistrationOpen;
