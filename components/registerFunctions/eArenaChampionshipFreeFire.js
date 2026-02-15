const filters = require("../../utils/teamFilters");
const teamInsertionQuery = require("../../utils/querys/teamInsertion");
const { handleRegistrationError } = require("../../utils/errorHandler");

const eArenaChampionshipFreeFire = async (req, res) => {
    try {
        const { teamName, utr, leader, members } = req.body;
        console.log("[E ARENA FREE FIRE] Registration request:", { teamName, leaderName: leader?.name });
        
        const filterConfig = {
            minMembers: 1,
            maxMembers: 5,
            minFemale: 0
        };
        
        const filterStatus = filters(req, res, filterConfig);
        if (!filterStatus) {
            return; // Response already sent by filters
        }
        
        const registrationId = await teamInsertionQuery("E Arena Championship (Free Fire)", teamName, utr, leader, members);
        if (!registrationId) {
            return res.status(400).json({
                success: false,
                message: "Team registration failed",
                error: "Unable to insert team data"
            });
        }
        
        res.status(201).json({
            success: true,
            message: "E Arena Championship (Free Fire) registered successfully",
            data: {
                registrationId: registrationId,
                teamName: teamName,
                event: "E Arena Championship (Free Fire)"
            }
        });
    } catch (error) {
        handleRegistrationError(error, res, "E Arena Championship (Free Fire)");
    }
}

module.exports = eArenaChampionshipFreeFire;
