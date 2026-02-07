const filters = require("../../utils/teamFilters");
const teamInsertionQuery = require("../../utils/querys/teamInsertion");
const { handleRegistrationError } = require("../../utils/errorHandler");

const codeVibes = async (req, res) => {
    try {
        const { teamName, utr, leader, members } = req.body;
        console.log("[CODE VIBES] Registration request:", { teamName, leaderName: leader?.name });
        
        const filterConfig = {
            minMembers: 3,
            maxMembers: 6,
            minFemale: 1
        };
        
        const filterStatus = filters(req, res, filterConfig);
        if (!filterStatus) {
            return; // Response already sent by filters
        }
        
        const registrationId = await teamInsertionQuery("Code Vibes", teamName, utr, leader, members);
        if (!registrationId) {
            return res.status(400).json({
                success: false,
                message: "Team registration failed",
                error: "Unable to insert team data"
            });
        }
        
        res.status(201).json({
            success: true,
            message: "Code Vibes registered successfully",
            data: {
                registrationId: registrationId,
                teamName: teamName,
                event: "Code Vibes"
            }
        });
    } catch (error) {
        handleRegistrationError(error, res, "Code Vibes");
    }
}

module.exports = codeVibes;