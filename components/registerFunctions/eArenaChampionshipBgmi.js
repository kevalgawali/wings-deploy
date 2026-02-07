const filters = require("../../utils/teamFilters");
const teamInsertionQuery = require("../../utils/querys/teamInsertion");
const { handleRegistrationError } = require("../../utils/errorHandler");

const eArenaChampionshipBgmi = async (req, res) => {
    try {
        const { teamName, utr, leader, members } = req.body;
        console.log("[E ARENA BGMI] Registration request:", { teamName, leaderName: leader?.name });
        
        const filterConfig = {
            minMembers: 1,
            maxMembers: 4,
            minFemale: 0
        };
        
        const filterStatus = filters(req, res, filterConfig);
        if (!filterStatus) {
            return; // Response already sent by filters
        }
        
        const registrationId = await teamInsertionQuery("E Arena Championship (BGMI)", teamName, utr, leader, members);
        if (!registrationId) {
            return res.status(400).json({
                success: false,
                message: "Team registration failed",
                error: "Unable to insert team data"
            });
        }
        
        res.status(201).json({
            success: true,
            message: "E Arena Championship (BGMI) registered successfully",
            data: {
                registrationId: registrationId,
                teamName: teamName,
                event: "E Arena Championship (BGMI)"
            }
        });
    } catch (error) {
        handleRegistrationError(error, res, "E Arena Championship (BGMI)");
    }
}

module.exports = eArenaChampionshipBgmi;
