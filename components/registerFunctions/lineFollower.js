const filters = require("../../utils/teamFilters");
const teamInsertionQuery = require("../../utils/querys/teamInsertion");
const { handleRegistrationError } = require("../../utils/errorHandler");

const lineFollower = async (req, res) => {
    try {
        const { teamName, utr, leader, members } = req.body;
        console.log("[LINE FOLLOWER] Registration request:", { teamName, leaderName: leader?.name });
        
        const filterConfig = {
            minMembers: 2,
            maxMembers: 4,
            minFemale: 0
        };
        
        const filterStatus = filters(req, res, filterConfig);
        if (!filterStatus) {
            return; // Response already sent by filters
        }
        
        const registrationId = await teamInsertionQuery("Line Follower", teamName, utr, leader, members);
        if (!registrationId) {
            return res.status(400).json({
                success: false,
                message: "Team registration failed",
                error: "Unable to insert team data"
            });
        }
        
        res.status(201).json({
            success: true,
            message: "Line Follower registered successfully",
            data: {
                registrationId: registrationId,
                teamName: teamName,
                event: "Line Follower"
            }
        });
    } catch (error) {
        handleRegistrationError(error, res, "Line Follower");
    }
}

module.exports = lineFollower;
