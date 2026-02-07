const filters = require("../../utils/teamFilters")
const teamInsertionQuery = require("../../utils/querys/teamInsertion")
const { handleRegistrationError } = require("../../utils/errorHandler");

const room404 = async (req,res) => {
    try{
        const {teamName,utr,leader,members} = req.body
        const filterConfig = {
            minMembers: 3,
            maxMembers: 3,
            minFemale: 0
        }
        
        const filterStatus= filters(req,res,filterConfig)
        if(!filterStatus){
            return
        }
        const registrationId = await teamInsertionQuery("Room 404",teamName, utr,leader, members)
        if(!registrationId){
            return res.status(400).json({
                success: false,
                message: "Team registration failed",
                error: "Unable to insert team data"
            })
        }
        res.status(201).json({
            success: true,
            message: "Room 404 registered successfully",
            data: {
                registrationId: registrationId,
                teamName: teamName,
                event: "Room 404"
            }
        })
    } catch (error) {
        handleRegistrationError(error, res, "Room 404");
    }
}

module.exports = room404