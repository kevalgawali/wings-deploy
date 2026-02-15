const filters = require("../../utils/teamFilters");
const teamInsertionQuery = require("../../utils/querys/teamInsertion");
const { handleRegistrationError } = require("../../utils/errorHandler");

const roboSoccer = async (req, res) => {
    try {
        const { teamName, utr, leader, members } = req.body;
        console.log("[ROBO SOCCER] Registration request:", { teamName, leaderName: leader?.name });
        
        const filterConfig = {
            minMembers: 2,
            maxMembers: 3,
            minFemale: 0
        };
        
        const filterStatus = filters(req, res, filterConfig);
        if (!filterStatus) {
            return; // Response already sent by filters
        }
        
        const registrationId = await teamInsertionQuery("Robo Soccer", teamName, utr, leader, members);
        if (!registrationId) {
            return res.status(400).json({
                success: false,
                message: "Team registration failed",
                error: "Unable to insert team data"
            });
        }
        
        res.status(201).json({
            success: true,
            message: "Robo Soccer registered successfully",
            data: {
                registrationId: registrationId,
                teamName: teamName,
                event: "Robo Soccer"
            }
        });
    } catch (error) {
        handleRegistrationError(error, res, "Robo Soccer");
    }
}

module.exports = roboSoccer;
