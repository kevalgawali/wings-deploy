const filters = require("../../utils/teamFilters")
const teamInsertionQuery = require("../../utils/querys/teamInsertion")
const { handleRegistrationError } = require("../../utils/errorHandler");

const innovex = async(req,res) => {
    try{
        const {teamName,utr,leader,members} = req.body
        const filterConfig = {
            minMembers: 1,
            maxMembers: 3,
            minFemale: 0
        }
        const filterStatus= filters(req,res,filterConfig)
        if(!filterStatus){
            return res.status(400).json({
                success: false,
                message: "Team registration failed",
                error: "Invalid team configuration"
            })
        }
        const registrationId = await teamInsertionQuery("Innovex",teamName, utr,leader, members)
        if(!registrationId){
            return res.status(400).json({
                success: false,
                message: "Team registration failed",
                error: "Unable to insert team data"
            })
        }
        res.status(201).json({
            success: true,
            message: "Innovex registered successfully",
            data: {
                registrationId: registrationId,
                teamName: teamName,
                event: "Innovex"
            }
        })
    } catch (error) {
        handleRegistrationError(error, res, "Innovex");
    }
}

module.exports = innovex