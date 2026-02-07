const filters = require("../../utils/teamFilters");
const teamInsertionQuery = require("../../utils/querys/teamInsertion");
const { handleRegistrationError } = require("../../utils/errorHandler");

const cadClash = async (req, res) => {
    try {
        const { teamName, utr, leader, members } = req.body;
        console.log("[CAD CLASH] Registration request:", { teamName, leaderName: leader?.name });
        
        const filterConfig = {
            minMembers: 2,
            maxMembers: 2,
            minFemale: 0
        };
        
        const filterStatus = filters(req, res, filterConfig);
        if (!filterStatus) {
            return; // Response already sent by filters
        }
        
        const registrationId = await teamInsertionQuery("Cad Clash", teamName, utr, leader, members);
        if (!registrationId) {
            return res.status(400).json({
                success: false,
                message: "Team registration failed",
                error: "Unable to insert team data"
            });
        }
        
        res.status(201).json({
            success: true,
            message: "Cad Clash registered successfully",
            data: {
                registrationId: registrationId,
                teamName: teamName,
                event: "Cad Clash"
            }
        });
    } catch (error) {
        handleRegistrationError(error, res, "CAD Clash");
    }
}

module.exports = cadClash;